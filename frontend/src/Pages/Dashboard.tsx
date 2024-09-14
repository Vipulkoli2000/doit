import React from "react";
import TaskManager from "@/Pages/TaskManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/Dashboard/Sidebar";
// import Pagess from "@/tasks/pagess";
import Task from "@/Pages/TaskManager/Task";

const Dashboard = () => {
  return (
    <div className="flex bg-background ">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden bg-black px-4 ">
        {/* <Pagess /> */}
        <Task />
      </main>
    </div>
  );
};

export default Dashboard;
