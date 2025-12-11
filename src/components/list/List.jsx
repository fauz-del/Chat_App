import "./list.scss";
import { useState, useEffect } from "react";
import UserInfo from "./userinfo/UserInfo";
import ChatList from "./chatList/ChatList";
import { supabase } from "../../lib/supabase";

const List = ({
  onSelectUser,        
  currentUserId,
  lastChattedUserId,   
  currentUser,
  messages,
  onUserAdded
}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", currentUserId);

      if (!error) setUsers(data || []);
    };
    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          const updated = payload.new;

          setUsers((prev) => {
            const exists = prev.find((u) => u.id === updated.id);
            if (exists) {
              return prev.map((u) => (u.id === updated.id ? updated : u));
            }
            return [...prev, updated];
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="list">
      {currentUser && <UserInfo currentUser={currentUser} />}

      <ChatList
        users={users}
        onSelectUser={onSelectUser}       
        currentUserId={currentUserId}
        lastChattedUserId={lastChattedUserId}
        onUserAdded={onUserAdded}
        messages={messages}
      />
    </div>
  );
};

export default List;