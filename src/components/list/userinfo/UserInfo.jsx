import { useState, useEffect } from "react";
import "./userinfo.scss";
import { Pencil, MoreHorizontal, Video, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import Kitty from "../../../utils/Kitty.jpg";

const UserInfo = ({ currentUser }) => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    avatar_url: Kitty,
    status: "offline",
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState({ file: null, url: "" });

  useEffect(() => {
    if (!currentUser) return;

    let channel;

    const loadProfile = async () => {
      // Fetch profile from the "users" table
      const { data: profile, error } = await supabase
        .from("users")
        .select("username, avatar_url, status")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setUserInfo({
        username: profile.username || "",
        avatar_url: profile.avatar_url || Kitty,
        status: profile.status || "offline",
      });

      // Subscribe to real-time updates
      channel = supabase
        .channel("user-status")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `id=eq.${currentUser.id}`,
          },
          (payload) => {
            setUserInfo((prev) => ({
              ...prev,
              username: payload.new.username,
              avatar_url: payload.new.avatar_url || Kitty,
              status: payload.new.status || "offline",
            }));
          }
        )
        .subscribe();
    };

    loadProfile();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const openEditMenu = () => {
    setNewUsername(userInfo.username);
    setNewAvatar({ file: null, url: userInfo.avatar_url });
    setOpenEdit(true);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setNewAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const saveChanges = async () => {
    if (!currentUser) return;

    let avatarUrl = userInfo.avatar_url;

    // Upload new avatar if selected
    if (newAvatar.file) {
      const filePath = `avatars/${currentUser.id}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, newAvatar.file);

      if (uploadError) return alert("Error uploading image");

      const { data } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("users")
      .update({ username: newUsername, avatar_url: avatarUrl })
      .eq("id", currentUser.id);

    if (error) return alert("Error updating profile");

    setUserInfo({ ...userInfo, username: newUsername, avatar_url: avatarUrl });
    setOpenEdit(false);
  };

  return (
    <>
      <div className="userinfo">
        <div className="user">
          <img src={userInfo.avatar_url} alt={userInfo.username} />
          <div className="name-status">
            <h2>{userInfo.username}</h2>
            <span className={`status ${userInfo.status}`}>
              {userInfo.status === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="icons">
          <Pencil size={20} onClick={openEditMenu} />
          <Video size={20} />
          <MoreHorizontal size={20} />
        </div>
      </div>

      {openEdit && (
        <div className="edit-modal">
          <div className="edit-content">
            <X className="close" size={20} onClick={() => setOpenEdit(false)} />
            <h3>Edit Profile</h3>

            <div className="avatar-preview">
              <img src={newAvatar.url} alt="avatar preview" />
            </div>

            <div className="file-input">
              <label htmlFor="avatar-upload">Choose Avatar</label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Change username"
            />

            <button className="save-btn" onClick={saveChanges}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;