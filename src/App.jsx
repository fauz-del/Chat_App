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
  const [lastChattedUserId, setLastChattedUserId] = useState(null);
  const [messages, setMessages] = useState([]);

  // --------------------------------------
  // AUTH
  // --------------------------------------
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user || null);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      setCurrentUser(data?.session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // --------------------------------------
  // FETCH USERS
  // --------------------------------------
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

  // --------------------------------------
  // SELECT INITIAL USER
  // --------------------------------------
  useEffect(() => {
    if (!users.length) return;

    let initialUser = users.find(u => u.id === lastChattedUserId);
    if (!initialUser) initialUser = users[0];

    setSelectedUser(initialUser);
  }, [users, lastChattedUserId]);

  // --------------------------------------
  // FETCH MESSAGES
  // --------------------------------------
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),
           and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  // --------------------------------------
  // HOOKS MUST END BEFORE CONDITIONAL RETURNS
  // --------------------------------------

  if (currentUser === undefined) return null;

  if (!currentUser) return <Navigate to="/login" replace />;

  // --------------------------------------
  // UI
  // --------------------------------------
  return (
    <div className="container">
      <List
        users={users}
        onSelectUser={handleSelectUser}
        currentUserId={currentUser.id}
        lastChattedUserId={lastChattedUserId}
        currentUser={currentUser}
        onUserAdded={handleUserAdded}
        messages={messages}
      />

      <Chat selectedUser={selectedUser} currentUser={currentUser}
        messages={messages}
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

  // FUNCTIONS
  function handleSelectUser(user) {
    setSelectedUser(user);
    setLastChattedUserId(user.id);

    const unread = messages.filter(
      msg => msg.sender_id === user.id && !msg.read
    );

    unread.forEach(msg =>
      supabase.from("messages").update({ read: true }).eq("id", msg.id)
    );

    setMessages(prev =>
      prev.map(msg =>
        msg.sender_id === user.id ? { ...msg, read: true } : msg
      )
    );
  }

  function handleUserAdded(user) {
    setUsers(prev => [...prev, user]);
  }
}

export default App;