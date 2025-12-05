import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import Kitty from "../../utils/Kitty.jpg";
import char from "../../utils/char.jpeg";
import { supabase } from "../../lib/supabase";

const Login = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const navigate = useNavigate();

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      let avatarUrl = "";
      if (avatar.file) {
        const filePath = `avatars/user-${userId}.png`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar.file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = urlData.publicUrl;
      }

      const { error: dbError } = await supabase.from("users").insert({
        id: userId,
        username,
        email,
        avatar_url: avatarUrl,
        status: "online",
      });

      if (dbError) throw dbError;

      toast.success(`Welcome, ${username}!`);
      navigate("/app");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    if (!email || !password) {
      toast.error("Email & password are required");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await supabase
        .from("users")
        .update({ status: "online" })
        .eq("id", data.user.id);

      toast.success("Welcome back!");
      navigate("/app");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || char || Kitty} alt="" />
            Upload an image
          </label>

          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />

          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;