import "./chatlist.scss";
import { useState, useMemo } from "react";
import { Search, Plus, Minus } from "lucide-react";
import AddUser from "./addUser/addUser";
import Kitty from "../../../utils/Kitty.jpg";

const ChatList = ({
  users = [],
  onSelectUser,
  currentUserId,
  lastChattedUserId,
  onUserAdded,
  messages = []
}) => {
  const [addMode, setAddMode] = useState(false);
  const [search, setSearch] = useState("");

  // Calculate unread count per user
  const unreadMap = useMemo(() => {
    const map = {};
    messages.forEach((msg) => {
      if (msg.receiver_id === currentUserId && !msg.read) {
        map[msg.sender_id] = (map[msg.sender_id] || 0) + 1;
      }
    });
    return map;
  }, [messages, currentUserId]);

  // Filter out current user and search
  const filteredUsers = users
    .filter(u => u.id !== currentUserId)
    .filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="chatlist">
      {/* SEARCH AND ADD */}
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
        <div className="add" onClick={() => setAddMode(prev => !prev)}>
          {addMode ? <Minus size={22} /> : <Plus size={22} />}
        </div>
      </div>

      {/* USERS */}
      {filteredUsers.map((user) => {
        const unreadCount = unreadMap[user.id] || 0;

        return (
          <div
            key={user.id}
            className={`item ${user.id === lastChattedUserId ? "active" : ""}`}
            onClick={() => onSelectUser(user)}
          >
            <img src={user.avatar_url || Kitty} alt={user.username} />
            <div className="texts">
              <span>{user.username}</span>
              <p className={`status ${user.status}`}>
                {user.status === "online" ? "Online" : "Offline"}
              </p>
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
        );
      })}

      {/* ADD USER FORM */}
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