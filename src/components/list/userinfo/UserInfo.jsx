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
    if (!currentUser?.id) return;

    let channel;

    const goOnline = async () => {
      try {
        await supabase.from("users").update({ status: "online" }).eq("id", currentUser.id);
        setUserInfo((prev) => ({ ...prev, status: "online" }));
      } catch (err) {
        console.error("Error setting online:", err);
      }
    };

    const goOffline = async () => {
      try {
        await supabase.from("users").update({ status: "offline" }).eq("id", currentUser.id);
        setUserInfo((prev) => ({ ...prev, status: "offline" }));
      } catch (err) {
        console.error("Error setting offline:", err);
      }
    };

    const loadProfile = async () => {
      try {
        
        const { data: profile, error } = await supabase
          .from("users")
          .select("username, avatar_url, status")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (error) throw error;

        if (!profile) {
          const { error: insertError } = await supabase.from("users").insert({
            id: currentUser.id,
            username: "New User",
            avatar_url: null,
            status: "offline",
          });
          if (insertError) throw insertError;

          setUserInfo({
            username: "New User",
            avatar_url: Kitty,
            status: "offline",
          });
        } else {
          setUserInfo({
            username: profile.username || "New User",
            avatar_url: profile.avatar_url || Kitty,
            status: profile.status || "offline",
          });
        }

        await goOnline();

        channel = supabase
          .channel("user-status")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "users" },
            (payload) => {
              if (payload.new.id === currentUser.id) {
                setUserInfo((prev) => ({
                  ...prev,
                  username: payload.new.username || prev.username,
                  avatar_url: payload.new.avatar_url || prev.avatar_url,
                  status: payload.new.status || prev.status,
                }));
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") goOnline();
      else goOffline();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    window.addEventListener("beforeunload", goOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", goOffline);
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

    if (newAvatar.file) {
      try {
        const fileExtension = newAvatar.file.name.split(".").pop();
        const filePath = `chat_images/${currentUser.id}-${Date.now()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("chat_images")
          .upload(filePath, newAvatar.file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("chat_images").getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      } catch (err) {
        console.error("Error uploading avatar:", err);
        return alert("Error uploading avatar");
      }
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ username: newUsername, avatar_url: avatarUrl })
        .eq("id", currentUser.id);

      if (error) throw error;

      setUserInfo({ ...userInfo, username: newUsername, avatar_url: avatarUrl });
      setOpenEdit(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    }
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