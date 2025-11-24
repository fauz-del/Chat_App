import './userinfo.scss';
import { Pencil, MoreHorizontal, Video } from "lucide-react";
import Kitty from "../../../utils/Kitty.jpg";

const UserInfo = () => {
  return (
    <div className="userinfo">
     <div className= "user">
       <img src= { Kitty } alt= "" />
       <h2>Joe Doe</h2>
     </div>
     <div className= "icons">
       <Pencil size={20} />
       <Video size={20} />
       <MoreHorizontal size={20} />
     </div>
    </div>
  );
}

export default UserInfo;