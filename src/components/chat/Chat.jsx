import { useState, useEffect, useRef } from "react";
import "./chat.scss";
import { Image, Camera, Mic, Smile, Phone, Video, Info } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { supabase } from "../../lib/supabase";
import Kitty from "../../utils/Kitty.jpg";

const Chat = ({ selectedUser, currentUser, messages, setMessages }) => {
  const [text, setText] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const loadMessages = async () => {
      const orFilter = `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(orFilter)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      setMessages(data || []);

      const unread = data.filter(
        (m) =>
          m.sender_id === selectedUser.id &&
          m.receiver_id === currentUser.id &&
          !m.read
      );

      if (unread.length > 0) {
        await supabase
          .from("messages")
          .update({ read: true })
          .in("id", unread.map((m) => m.id));

        setMessages((prev) =>
          prev.map((m) =>
            unread.some((u) => u.id === m.id) ? { ...m, read: true } : m
          )
        );
      }
    };

    loadMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const channel = supabase.channel(
      `messages-${currentUser.id}-${selectedUser.id}`
    );

    const filter = `or(sender_id=eq.${currentUser.id},receiver_id=eq.${currentUser.id})`;

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter
      },
      async (payload) => {
        const msg = payload.new;

        const isChatMessage =
          (msg.sender_id === currentUser.id &&
            msg.receiver_id === selectedUser.id) ||
          (msg.sender_id === selectedUser.id &&
            msg.receiver_id === currentUser.id);

        if (!isChatMessage) return;

        setMessages((prev) => [...prev, msg]);

        if (msg.sender_id === selectedUser.id && !msg.read) {
          await supabase
            .from("messages")
            .update({ read: true })
            .eq("id", msg.id);

          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
          );
        }
      }
    );

    channel.subscribe();

    return () => supabase.removeChannel(channel);
  }, [selectedUser, currentUser]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: text,
        image_url: null,
        read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Send error:", error);
      return;
    }

    setMessages((prev) => [...prev, data]);
    setText("");
  };

  const sendImage = async (file) => {
    if (!file || !selectedUser) return;

    const filePath = `chat-images/${currentUser.id}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) return console.error("Upload error:", uploadError);

    const { data } = supabase.storage.from("chat-images").getPublicUrl(filePath);
    const url = data.publicUrl;

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: "",
        image_url: url,
        read: false,
      })
      .select()
      .single();

    if (error) console.error("Send image error:", error);
    else setMessages((prev) => [...prev, inserted]);
  };

  const handleEmoji = (emojiData) => setText((prev) => prev + emojiData.emoji);

  if (!selectedUser)
    return <div className="chat empty">Select a user to start chatting</div>;

  return (
    <div className="chat">
      {/* TOP BAR */}
      <div className="top">
        <div className="user">
          <img src={selectedUser.avatar_url || Kitty} alt="" />
          <div className="text">
            <span>{selectedUser.username}</span>
            <p>{selectedUser.status === "online" ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="icons">
          <Phone size={20} />
          <Video size={20} />
          <Info size={20} />
        </div>
      </div>

      <div className="center">
        {messages
          .filter(
            (m) =>
              (m.sender_id === currentUser.id &&
                m.receiver_id === selectedUser.id) ||
              (m.sender_id === selectedUser.id &&
                m.receiver_id === currentUser.id)
          )
          .map((msg) => (
            <div
              key={msg.id}
              className={msg.sender_id === currentUser.id ? "message own" : "message"}
            >
              {msg.sender_id !== currentUser.id && (
                <img src={selectedUser.avatar_url || Kitty} alt="" />
              )}

              <div className="texts">
                {msg.image_url && <img src={msg.image_url} alt="sent" />}
                {msg.content && <p>{msg.content}</p>}
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        <div ref={endRef} />
      </div>

      <div className="bottom">
        <div className="icons">
          <label>
            <Image size={20} />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => sendImage(e.target.files[0])}
            />
          </label>
          <Camera size={20} />
          <Mic size={20} />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <div className="emoji">
          <Smile size={20} onClick={() => setOpenEmoji((p) => !p)} />
          {openEmoji && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;