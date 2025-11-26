import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import "./index.css";

const App = () => {
  const user = true;

  return (
    <>
      <div className="container">
        {user ? (
          <>
            <List />
            <Chat />
            <Detail />
          </>
        ) : (
          <Login />
        )}
      </div>

      <Notification /> {/* Place OUTSIDE container */}
    </>
  );
};

export default App;