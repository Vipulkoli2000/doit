// @ts-nocheck

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the user structure
interface User {
  id: string;
  name: string;
}

const priorities = ["Low", "Medium", "High"];
// const statuses = ["Not Started", "In Progress"];
const weights = ["0", "0.25", "0.50", "0.75", "1.00"];

const AddTask = () => {
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [assign_to, setassign_to] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]); // Use the User[] type
  const [open, setOpen] = React.useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem || "{}"); // Handle the case where getItem is null

  React.useEffect(() => {
    axios
      .get("/api/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log("Fetched users:", response.data.data);
        setUsers(response.data.data.Users); // Assuming `Users` is the correct structure
      })
      .catch((error) => {
        console.error("Failed to fetch users", error);
      });
  }, [user.token]);

  const register = () => {
    axios
      .post(
        "/api/tasks",
        {
          description,
          priority,
          weight,
          assign_to,
          project_id,
          status: "In Progress",
          start_date: "11/11/1111",
          end_date: "11/11/1111",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        toast.success("Task created successfully.");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Failed to create task.");
        console.error(error);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      register();
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <ScrollArea>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                You can add new tasks here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Textarea
                  id="description"
                  placeholder="Description/Task"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="flex w-full sm:w-60 md:w-80 lg:w-96"
                      variant="outline"
                    >
                      {weight || "Select Weight"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Weight</DropdownMenuLabel>
                    {weights.map((item) => (
                      <DropdownMenuItem
                        key={item}
                        onClick={() => setWeight(item)}
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex w-full sm:w-60 md:w-80"
                        variant="outline"
                      >
                        {priority || "Select Priority"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Priority</DropdownMenuLabel>
                      {priorities.map((item) => (
                        <DropdownMenuItem
                          key={item}
                          onClick={() => setPriority(item)}
                        >
                          {item}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div>
                <Label htmlFor="assign_to">Assign To</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="flex w-full sm:w-60 md:w-80 gap-2"
                      variant="outline"
                    >
                      {assign_to || "Select User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                    {users.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => setassign_to(user.id)}
                      >
                        {user.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={register} type="button">
                Save changes
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTask;
