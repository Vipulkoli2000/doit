// @ts-nocheck
import React from "react";
import TaskManager from "@/Pages/TaskManager";
import Sidebar from "@/Dashboard/Sidebar";
import Task from "@/Pages/TaskManager/Task";
//
const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row bg-background">
      <Sidebar className="hidden md:block" />{" "}
      <main className="flex-1 bg-black px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Task />
      </main>
    </div>
  );
};

export default Dashboard;
