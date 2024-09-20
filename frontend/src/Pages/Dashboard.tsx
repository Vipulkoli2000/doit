import React from "react";
import TaskManager from "@/Pages/TaskManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/Dashboard/Sidebar";
import Pagess from "@/tasks/pagess";
import Task from "@/Pages/TaskManager/Task";

const Dashboard = () => {
  return (
    <div className="flex bg-background ">
      <Sidebar />
      <main className="w-full flex-1 bg-black px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* <Pagess /> */}
        <Task />
      </main>
    </div>
  );
};

export default Dashboard;
