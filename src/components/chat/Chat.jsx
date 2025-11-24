import { useState, useRef, useEffect } from "react";
import './chat.scss';

import { Phone, Video, Info, Image, Camera, Mic, Smile } from "lucide-react";
import Kitty from "../../utils/Kitty.jpg";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEmoji = e => {
    setText(prev => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={Kitty} alt="" />
          <div className="text">
            <span>Jane Mattews</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        <div className="icons">  
          <Phone size={20} />  
          <Video size={20} />  
          <Info size={20} />  
        </div>  
      </div>  

      <div className="center">  
        <div className="message">  
          <img src={Kitty} alt="" />  
          <div className="texts">  
            <p>Lorem ipsum dolor sit amev consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>  
            <span>1 min ago</span>  
          </div>  
        </div>  

        <div className="message own">  
          <div className="texts">  
            <p>Lorem ipsum dolor sit amev consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>  
            <span>1 min ago</span>  
          </div>  
        </div>  

        <div className="message">  
          <img src={Kitty} alt="" />  
          <div className="texts">  
            <p>Lorem ipsum dolor sit amev consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>  
            <span>1 min ago</span>  
          </div>  
        </div>  

        <div className="message own">  
          <div className="texts">  
            <p>Lorem ipsum dolor sit amev consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>  
            <span>1 min ago</span>  
          </div>  
        </div>  

        <div className="message">  
          <img src={Kitty} alt="" />  
          <div className="texts">  
            <p>Lorem ipsum dolor sit amev consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>  
            <span>1 min ago</span>  
          </div>  
        </div>  

        <div className="message own">  
          <div className="texts">  
            <img src="https://i.imgur.com/yypWr1D.jpeg" alt="" />  
            <p>Lorem ipsum dolor sit amev consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>  
            <span>1 min ago</span>  
          </div>  
        </div>  

        <div ref={endRef}></div>  
      </div>  

      <div className="bottom">  
        <div className="icons">  
          <Image size={20} />  
          <Camera size={20} />  
          <Mic size={20} />  
        </div>  

        <input   
          type="text"   
          placeholder="Type a message..."   
          value={text}  
          onChange={e => setText(e.target.value)} 
        />  

        <div className="emoji">  
          <Smile size={20} onClick={() => setOpen(prev => !prev)} />  
          
          {open && (  
            <div className="picker">  
              <EmojiPicker onEmojiClick={handleEmoji} />  
            </div>  
          )}  
        </div>  

        <button className="sendButton">Send</button>  
      </div>  
    </div>
  );
};

export default Chat;