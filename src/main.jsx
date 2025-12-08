import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Notification />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<App />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);