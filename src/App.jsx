import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Notification from "./components/notification/Notification";
import { supabase } from "./lib/supabase";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setCurrentUser(session?.user || null)
    );

    supabase.auth.getSession().then(({ data }) => {
      setCurrentUser(data?.session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", currentUser.id);

      if (!error) setUsers(data || []);
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
    };

    fetchMessages();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          if (msg.sender_id === currentUser.id || msg.receiver_id === currentUser.id) {
            setMessages(prev => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    const unreadMessages = messages.filter(
      msg => msg.sender_id === user.id && msg.receiver_id === currentUser.id && !msg.read
    );

    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map(msg =>
          supabase.from("messages").update({ read: true }).eq("id", msg.id)
        )
      );

      setMessages(prev =>
        prev.map(msg =>
          msg.sender_id === user.id && msg.receiver_id === currentUser.id
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedUser) return;

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

      if (error) return console.error("Error sending message:", error);
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error("Unexpected error sending message:", err);
    }
  };

  const handleSendImage = async (file) => {
    if (!file || !selectedUser) return;

    const filePath = `chat-images/${currentUser.id}-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) return console.error("Image upload failed:", uploadError);

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

      if (error) return console.error("Error sending image:", error);
      setMessages(prev => [...prev, insertedData]);
    } catch (err) {
      console.error("Unexpected error sending image:", err);
    }
  };

  if (currentUser === undefined) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <List
        onSelectUser={handleSelectUser}
        currentUserId={currentUser.id}
        lastChattedUserId={selectedUser?.id}
        currentUser={currentUser}
        messages={messages}
        onUserAdded={(user) => setUsers(prev => [...prev, user])}
         />

      <Chat
        selectedUser={selectedUser}
        currentUser={currentUser}
        messages={messages}
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        setMessages={setMessages}
      />

      <Detail
        selectedUser={selectedUser}
        currentUser={currentUser}
        messages={messages}
        setSelectedUser={setSelectedUser}
      />

      <Notification />
    </div>
  );
}

export default App;