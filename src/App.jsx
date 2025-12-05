import { useState, useEffect } from "react";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import { supabase } from "./lib/supabase";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastChattedUserId, setLastChattedUserId] = useState(null);

  // Fetch current logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  // Fetch users excluding current user
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

  // Set selected user automatically
  useEffect(() => {
    if (!users.length) return;

    let initialUser = users.find(u => u.id === lastChattedUserId);
    if (!initialUser) initialUser = users[0];

    setSelectedUser(initialUser);
  }, [users, lastChattedUserId]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setLastChattedUserId(user.id);
  };

  const handleUserAdded = (user) => {
    setUsers(prev => [...prev, user]);
  };

  return (
    <div className="container">
      <List
        users={users}
        onSelectUser={handleSelectUser}
        currentUserId={currentUser?.id}
        lastChattedUserId={lastChattedUserId}
        currentUser={currentUser}
        onUserAdded={handleUserAdded}
      />
      <Chat selectedUser={selectedUser} currentUser={currentUser} />
      <Detail selectedUser={selectedUser} />
    </div>
  );
}

export default App;