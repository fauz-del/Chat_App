import Home from "./components/home/Home";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";

function App() {
  return (
    <div className="container">
      <Home />
      <List />
      <Chat />
      <Detail />
    </div>
  );
}

export default App;