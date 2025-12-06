import { useState, useEffect, useRef } from "react";
import "./chat.scss";
import { Image, Camera, Mic, Smile, Phone, Video, Info } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { supabase } from "../../lib/supabase";
import Kitty from "../../utils/Kitty.jpg";

const Chat = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const endRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages between users
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
      else console.error("Error fetching messages:", error);
    };

    loadMessages();
  }, [selectedUser, currentUser]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;

          // Only include messages for this chat
          if (
            (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [selectedUser, currentUser]);

  // Send text message
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          content: text,
          image_url: null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      // Append the new message immediately
      setMessages((prev) => [...prev, data]);
      setText(""); // Clear input
    } catch (err) {
      console.error("Unexpected error sending message:", err);
    }
  };

  // Send image message
  const sendImage = async (file) => {
    if (!file || !currentUser?.id || !selectedUser?.id) return;

    const filePath = `chat-images/${currentUser.id}-${Date.now()}.jpg`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return;
    }

    const { data } = supabase.storage.from("chat-images").getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    try {
      const { data: insertedData, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          content: "",
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending image message:", error);
        return;
      }

      // Append image message immediately
      setMessages((prev) => [...prev, insertedData]);
    } catch (err) {
      console.error("Unexpected error sending image:", err);
    }
  };

  // Handle emoji selection
  const handleEmoji = (e) => setText((prev) => prev + e.emoji);

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

      {/* MESSAGES */}
      <div className="center">
        {messages.map((msg) => (
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
        <div ref={endRef}></div>
      </div>

      {/* INPUT BOX */}
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
          <Smile size={20} onClick={() => setOpenEmoji((prev) => !prev)} />
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