import './addUser.scss';
import Kitty from "../../../../utils/Kitty.jpg";
import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const AddUser = ({ onUserAdded, currentUserId, existingUsers }) => {
  const [query, setQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, username, avatar_url, status") // select only needed fields
          .neq("id", currentUserId); // exclude current user

        if (error) throw error;

        // Exclude users already in chat list
        const filtered = data.filter(
          u => !existingUsers.some(ex => ex.id === u.id)
        );

        setFoundUsers(filtered);
      } catch (err) {
        console.error("Error loading users:", err.message);
      }
    };

    loadUsers();
  }, [currentUserId, existingUsers]);

  const handleAdd = (user) => {
    onUserAdded(user);
    // Optionally remove from foundUsers so it disappears after adding
    setFoundUsers(prev => prev.filter(u => u.id !== user.id));
  };

  return (
    <div className="addUser">
      <input
        type="text"
        placeholder="Search by username"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {foundUsers.filter(u => u.username.toLowerCase().includes(query.toLowerCase())).map(user => (
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