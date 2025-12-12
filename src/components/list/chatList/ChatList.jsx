import { useState, useMemo } from "react";
import { Search, Plus, Minus } from "lucide-react";
import AddUser from "./addUser/addUser";
import Kitty from "../../../utils/Kitty.jpg";
import "./chatlist.scss";

const ChatList = ({
  users = [],          // users already added to chat list
  onSelectUser,
  currentUserId,
  lastChattedUserId,
  onUserAdded,
  messages = []
}) => {
  const [addMode, setAddMode] = useState(false);
  const [search, setSearch] = useState("");

  // Count unread messages
  const unreadMap = useMemo(() => {
    const map = {};
    messages.forEach((msg) => {
      if (msg.receiver_id === currentUserId && !msg.read) {
        map[msg.sender_id] = (map[msg.sender_id] || 0) + 1;
      }
    });
    return map;
  }, [messages, currentUserId]);

  const filteredUsers = users
    .filter((u) => u.id !== currentUserId)
    .filter((u) => {
      const username = u.username || u.user_metadata?.full_name || u.email;
      return username.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="chatlist">
      {/* SEARCH BAR & ADD BUTTON */}
      <div className="search">
        <div className="searchBar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="add" onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? <Minus size={22} /> : <Plus size={22} />}
        </div>
      </div>

      {/* USERS */}
      {filteredUsers.map((user) => {
        const unreadCount = unreadMap[user.id] || 0;
        const username = user.username || user.user_metadata?.full_name || user.email;
        const avatar = user.avatar_url || user.user_metadata?.avatar_url || Kitty;

        return (
          <div
            key={user.id}
            className={`item ${user.id === lastChattedUserId ? "active" : ""}`}
            onClick={() => onSelectUser(user)}
          >
            <img src={avatar} alt={username} />

            <div className="texts">
              <span>{username}</span>
              <p className={`status ${user.status}`}>
                {user.status === "online" ? "Online" : "Offline"}
              </p>
            </div>

            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </div>
        );
      })}

      {/* ADD USER PANEL */}
      {addMode && (
        <AddUser
          onUserAdded={onUserAdded}
          currentUserId={currentUserId}
          existingUsers={users}
        />
      )}
    </div>
  );
};

export default ChatList;