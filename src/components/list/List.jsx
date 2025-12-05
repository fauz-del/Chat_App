import './list.scss';
import { useState, useEffect } from "react";
import UserInfo from "./userinfo/UserInfo";
import ChatList from "./chatList/ChatList";
import { supabase } from "../../lib/supabase";

const List = ({ onSelectUser, currentUserId, lastChattedUserId, currentUser }) => {
  const [users, setUsers] = useState([]);

  // Load initial users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", currentUserId);

      if (!error) setUsers(data);
    };
    fetchUsers();
  }, [currentUserId]);

  const handleUserAdded = (newUser) => {
    // Check if user is already in the chat list
    if (!users.find(u => u.id === newUser.id)) {
      setUsers(prev => [...prev, newUser]);
    }
  };

  return (
    <div className="list">
      <UserInfo currentUser={currentUser} />
      <ChatList
        users={users}
        onSelectUser={onSelectUser}
        currentUserId={currentUserId}
        lastChattedUserId={lastChattedUserId}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default List;