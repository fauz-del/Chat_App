import "./list.scss";
import { useState, useEffect } from "react";
import ChatList from "./chatList/ChatList";
import UserInfo from "./userinfo/UserInfo";
import { supabase } from "../../lib/supabase";

const List = ({ currentUser, messages, onSelectUser }) => {
  const [users, setUsers] = useState([]); // all users added to chat list

  useEffect(() => {
    // Optionally, you can load previously added users if you have a mapping table
    // For now, it starts empty for new users
  }, []);

  const handleUserAdded = (user) => {
    // Avoid adding duplicates
    setUsers((prev) => {
      if (prev.find((u) => u.id === user.id)) return prev;
      return [...prev, user];
    });
  };

  return (
    <div className="list">
      {/* Show current logged-in user info */}
      <UserInfo currentUser={currentUser} />

      {/* Chat list */}
      <ChatList
        users={users}                     // pass users prop
        onSelectUser={onSelectUser}
        currentUserId={currentUser.id}
        lastChattedUserId={null}          // track selected chat if needed
        onUserAdded={handleUserAdded}
        messages={messages}
      />
    </div>
  );
};

export default List;