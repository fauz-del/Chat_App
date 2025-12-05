import './addUser.scss';
import Kitty from "../../../../utils/Kitty.jpg";
import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const AddUser = ({ onUserAdded, currentUserId, existingUsers }) => {
  const [query, setQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    // Load all users excluding current user and already in chat list
    const loadUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", currentUserId);

      if (!error) {
        const filtered = data.filter(
          u => !existingUsers.some(ex => ex.id === u.id)
        );
        setFoundUsers(filtered);
      }
    };

    loadUsers();
  }, [currentUserId, existingUsers]);

  const handleAdd = async (user) => {
    // Add user to chat list
    onUserAdded(user);
  };

  return (
    <div className="addUser">
      <input
        type="text"
        placeholder="Search by username"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {foundUsers
        .filter(u => u.username.toLowerCase().includes(query.toLowerCase()))
        .map(user => (
          <div key={user.id} className="user">
            <div className="detail">
              <img src={user.avatar_url || Kitty} alt={user.username} />
              <span>{user.username}</span>
            </div>
            <button onClick={() => handleAdd(user)}>Add User</button>
          </div>
        ))}
      {foundUsers.length === 0 && <p>No user found</p>}
    </div>
  );
};

export default AddUser;