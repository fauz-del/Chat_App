import './chatlist.css';
import { useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import Kitty from "../../../utils/Kitty.jpg";

const ChatList = () => {
  const [addMode, setAddModel] = useState(false);

  return (
    <div className="chatlist">
      <div className="search">

        <div className="searchBar">
          <Search size={20} />
          <input type="text" placeholder="Search" />
        </div>

        <div className="add" onClick={() => setAddModel(prev => !prev)}>
          {addMode ? <Minus size={22} /> : <Plus size={22} />}
        </div>
      </div>
      <div className= 'item'>
       <img src= {Kitty} alt= "" />
       <div className= 'texts'>
         <span>Jane Mattews</span>
         <p>Hello</p>
       </div>
      </div>
      <div className= 'item'>
        <img src= {Kitty} alt= "" />
        <div className= 'texts'>
          <span>Jane Mattews</span>
          <p>Hello</p>
        </div>
      </div>
      <div className= 'item'>
       <img src= {Kitty} alt= "" />
       <div className= 'texts'>
         <span>Jane Mattews</span>
         <p>Hello</p>
       </div>
       </div>
       <div className= 'item'>
        <img src= {Kitty} alt= "" />
        <div className= 'texts'>
         <span>Jane Mattews</span>
         <p>Hello</p>
        </div>
       </div>
      <div className= 'item'>
        <img src= {Kitty} alt= "" />
        <div className= 'texts'>
          <span>Jane Mattews</span>
          <p>Hello</p>
        </div>
      </div>
      <div className= 'item'>
       <img src= {Kitty} alt= "" />
       <div className= 'texts'>
         <span>Jane Mattews</span>
         <p>Hello</p>
       </div>
      </div>
      
      
      
    </div>
  );
}

export default ChatList;