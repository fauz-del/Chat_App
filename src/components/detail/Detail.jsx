import './detail.css';
import Kitty from "../../utils/Kitty.jpg";
import { ArrowUp, ArrowDown, Download } from "lucide-react";

const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src={Kitty} alt="" />
        <h2>Jane Mattews</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <ArrowUp size={20} />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <ArrowUp size={20} />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <ArrowDown size={20} />
          </div>

          <div className="photos">

            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.imgur.com/ianNcjf.jpeg" alt="" />
                <span>photo_2025-4.png</span>
                <Download size={20} />
              </div>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.imgur.com/ianNcjf.jpeg" alt="" />
                <span>photo_2025-4.png</span>
                <Download size={20} />
              </div>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.imgur.com/ianNcjf.jpeg" alt="" />
                <span>photo_2025-4.png</span>
                <Download size={20} />
              </div>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.imgur.com/ianNcjf.jpeg" alt="" />
                <span>photo_2025-4.png</span>
                <Download size={20} />
              </div>
            </div>

          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <ArrowUp size={20} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Detail;