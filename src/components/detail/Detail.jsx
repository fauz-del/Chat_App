import { useState, useEffect } from "react";
import './detail.scss';
import { toast } from "react-toastify";
import Kitty from "../../utils/Kitty.jpg";
import { ArrowUp, ArrowDown, Download } from "lucide-react";
import { supabase } from "../../lib/supabase";

const Detail = ({ selectedUser, currentUser, messages, setSelectedUser }) => {
  // === Hooks always at the top ===
  const [photosOpen, setPhotosOpen] = useState(true);
  const [blocked, setBlocked] = useState(false);

  // Check if the user is blocked whenever selectedUser or currentUser changes
  useEffect(() => {
    const checkBlockedStatus = async () => {
      if (!currentUser || !selectedUser) return;

      try {
        const { data, error } = await supabase
          .from("blocked_users")
          .select("*")
          .eq("blocker_id", currentUser.id)
          .eq("blocked_id", selectedUser.id);

        if (!error && data && data.length > 0) setBlocked(true);
        else setBlocked(false);
      } catch (err) {
        console.error("Failed to check blocked status:", err);
        setBlocked(false);
      }
    };

    checkBlockedStatus();
  }, [currentUser, selectedUser]);

  // Prevent rendering if no user is selected
  if (!selectedUser || !currentUser) return null;

  // Filter shared photos between currentUser and selectedUser
  const sharedPhotos = Array.isArray(messages)
    ? messages.filter(msg =>
        msg.image_url &&
        (
          (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id) ||
          (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id)
        )
      )
    : [];

  // Block or unblock user
  const handleBlockToggle = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      if (!blocked) {
        // Block user
        await supabase
          .from("blocked_users")
          .insert({ blocker_id: currentUser.id, blocked_id: selectedUser.id });

        toast.success(`${selectedUser.username} has been blocked.`, { position: "bottom-left" });
      } else {
        // Unblock user
        await supabase
          .from("blocked_users")
          .delete()
          .eq("blocker_id", currentUser.id)
          .eq("blocked_id", selectedUser.id);

        toast.info(`${selectedUser.username} has been unblocked.`, { position: "bottom-left" });
      }

      setBlocked(!blocked);
    } catch (err) {
      console.error("Error updating block status:", err);
      toast.error("Failed to update block status.", { position: "bottom-left" });
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      toast.info("Logging out...", { position: "bottom-left" });
      await supabase.auth.signOut();
      setSelectedUser(null);
      window.location.href = "#/login";
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Failed to logout.", { position: "bottom-left" });
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={selectedUser.avatar_url || Kitty} alt="" />
        <h2>{selectedUser.username}</h2>
        <p>{selectedUser.status === "online" ? "Online" : "Offline"}</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <ArrowUp size={20} className="ic" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <ArrowUp size={20} className="ic" />
          </div>
        </div>

        <div className="option" onClick={() => setPhotosOpen(!photosOpen)}>
          <div className="title">
            <span>Shared Photos</span>
            {photosOpen ? <ArrowUp size={20} className="ic" /> : <ArrowDown size={20} className="ic" />}
          </div>
        </div>

        {photosOpen && (
          <div className="photos">
            {sharedPhotos.length > 0 ? sharedPhotos.map((msg, idx) => (
              <div key={idx} className="photoItem">
                <div className="photoDetail">
                  <img src={msg.image_url} alt={`shared-${idx}`} />
                  <span>{msg.image_url.split("/").pop()}</span>
                </div>
                <Download
                  size={20}
                  className="ic icon"
                  onClick={() => window.open(msg.image_url, "_blank")}
                />
              </div>
            )) : <p className="no-photos">No shared photos</p>}
          </div>
        )}

        <button className="block-btn" onClick={handleBlockToggle}>
          {blocked ? "Unblock User" : "Block User"}
        </button>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;