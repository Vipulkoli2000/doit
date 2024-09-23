// @ts-nocheck
import React from "react";
import TaskManager from "@/Pages/TaskManager";
import Sidebar from "@/Dashboard/Sidebar";
import Pagess from "@/tasks/pagess";
import New from "@/Pages/TaskManager/New";
import Task from "@/Pages/TaskManager/Task";
//
const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row bg-background">
      <Sidebar className="hidden md:block" />{" "}
      {/* Hide on mobile, show on medium and up */}
      <main className="flex-1 bg-black px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* <Pagess /> */}

        <Task />
        {/* <New /> */}
      </main>
    </div>
  );
};

export default Dashboard;
