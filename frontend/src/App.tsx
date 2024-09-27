// import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Routes, Route } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
// import Project from "./Pages/Project";
import Project from "./Pages/Project";
import Archived from "./Pages/TaskManager/Done";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<Users />} />
        <Route path="/project" element={<Project />} />
        <Route path="/Archived" element={<Archived />} />
      </Routes>
    </>
  );
}

export default App;
