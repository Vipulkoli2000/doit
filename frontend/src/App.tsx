// import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Project from "./Pages/Project";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<Users />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </>
  );
}

export default App;
