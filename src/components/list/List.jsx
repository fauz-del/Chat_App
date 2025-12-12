import "./list.scss";
import { useState, useEffect } from "react";
import ChatList from "./chatList/ChatList";
import UserInfo from "./userinfo/UserInfo";
import { supabase } from "../../lib/supabase";

const List = ({ currentUser, messages, onSelectUser }) => {
  const [users, setUsers] = useState([]); 
  
  const fetchChatList = async () => {
  const { data, error } = await supabase
    .from("user_chats")
    .select(`
      chat_with_id,
      users:users!user_chats_chat_with_id_fkey(*)
    `)
    .eq("user_id", currentUser.id);

  if (error) {
    console.error("Error fetching chat list:", error);
    return;
  }

  const formattedUsers = data.map((item) => item.users);
  setUsers(formattedUsers);
};

  useEffect(() => {
    if (currentUser?.id) {
      fetchChatList(); 
    }
  }, [currentUser]);

  const handleUserAdded = async (user) => {
    const { error } = await supabase.from("user_chats").insert({
      user_id: currentUser.id,
      chat_with_id: user.id,
    });

    if (error && error.code !== "23505") {
      console.error("Error adding user:", error);
      return;
    }

    fetchChatList();
  };

  return (
    <div className="list">
      <UserInfo currentUser={currentUser} />

      <ChatList
        users={users}                  
        onSelectUser={onSelectUser}
        currentUserId={currentUser.id}
        lastChattedUserId={null}
        onUserAdded={handleUserAdded}
        messages={messages}
      />
    </div>
  );
};

export default List;