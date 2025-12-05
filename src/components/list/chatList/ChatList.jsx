import './chatlist.scss';
import { useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import AddUser from "./addUser/addUser";
import Kitty from "../../../utils/Kitty.jpg";

const ChatList = ({
  users = [], // <-- default to empty array
  onSelectUser,
  currentUserId,
  lastChattedUserId,
  onUserAdded
}) => {
  const [addMode, setAddMode] = useState(false);
  const [search, setSearch] = useState("");

  // Always safe to call filter now
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="add" onClick={() => setAddMode(prev => !prev)}>
          {addMode ? <Minus size={22} /> : <Plus size={22} />}
        </div>
      </div>

      {filteredUsers.map(user => (
        <div key={user.id} className="item" onClick={() => onSelectUser(user)}>
          <img src={user.avatar_url || Kitty} alt={user.username} />
          <div className="texts">
            <span>{user.username}</span>
            <p className={`status ${user.status}`}>
              {user.status === "online" ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      ))}

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