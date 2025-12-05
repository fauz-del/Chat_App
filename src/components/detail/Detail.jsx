import './detail.scss';
import Kitty from "../../utils/Kitty.jpg";
import { ArrowUp, ArrowDown, Download } from "lucide-react";

const Detail = ({ selectedUser }) => {
  if (!selectedUser) return null;

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
            <span>Privacy & help</span>
            <ArrowUp size={20} className="ic" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <ArrowDown size={20} className="ic" />
          </div>
        </div>

        <div className="photos">
          <div className="photoItem">
            <div className="photoDetail">
              <img src="https://i.imgur.com/ianNcjf.jpeg" alt="" />
              <span>photo_2025-4.png</span>
            </div>
            <Download size={20} className="ic icon" />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img src="https://i.imgur.com/ianNcjf.jpeg" alt="" />
              <span>photo_2025-4.png</span>
            </div>
            <Download size={20} className="ic icon" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <ArrowUp size={20} className="ic" />
          </div>
        </div>
        <button>Block User</button>
        <button className="logout">Logout</button>
      </div>
    </div>
  );
};

export default Detail;