// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          {/* 추가할 경로들을 여기에 정의 */}
        </Routes>
      </Router>
  );
};

export default App;
