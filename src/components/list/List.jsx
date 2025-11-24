import './list.scss';
import UserInfo from "./userinfo/UserInfo";
import ChatList from "./chatList/ChatList";

const List = () => {
  return (
    <div className="list">
      <UserInfo/>
      <ChatList/>
    </div>
  )
}

export default List;