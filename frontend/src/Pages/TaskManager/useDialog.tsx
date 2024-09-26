import { useEffect, useState } from "react"; // Import useEffect and useState
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios"; // Import axios
import { ChevronDown, ChevronUp, X, Plus, Paperclip } from "lucide-react";

export function DialogDemo() {
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  // Step 1: Set up state to store the fetched data
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    assign_to: "",
    priority: "",
    weight: "",
    status: "",
    project: "",
    comments: "",
  });

  // Step 2: Use useEffect to fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("User Token:", user.token); // Debugging log
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("Fetched Data:", response.data); // Debugging log
        setFormData(response.data); // Assuming response.data contains the fields
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <Dialog>
      <DialogTrigger asChild>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[]">
        <DialogHeader>
          <DialogTitle>Inbox</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Custom TaskDialog-like content here */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700"></div>
          <div className="flex-grow overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Task Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-xl font-semibold bg-gray-800 border-none shadow-none text-gray-100 placeholder-gray-500"
                />
              </div>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-gray-800 border-none resize-none text-gray-100 placeholder-gray-500"
              />

              <div className="flex items-center space-x-2">
                
                <Input
                  placeholder="Comment"
                  className="flex-grow bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-100"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-900 space-y-2 rounded-b-lg">
            <div className="flex justify-between items-center">
              <Label className="text-gray-400">Project</Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Inbox</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-gray-400">Due date</Label>
              <div className="flex items-center space-x-2">
                <span className="text-red-400">16 Sep</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-gray-400">Priority</Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">P4</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogDemo;
