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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
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

const priorities = ["Low", "Medium", "High"];
const statuses = ["Not Started", "In Progress"];
const weights = ["0", "0.25", "0.50", "0.75", "1.00"];

const AddTask = () => {
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("");
  // const [title, setTitle] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [status, setStatus] = React.useState("");
  // const [assignedUser, setAssignedUser] = React.useState("");
  const [assign_to, setAssign_to] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  React.useEffect(() => {
    axios
      .get("/api/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log("Fetched users:", response.data.data);
        setUsers(response.data.data.Users);
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
          // title,
          description,
          priority,
          weight,
          assign_to,
          status,
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

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Task</Button>
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
              {/* <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div> */}
              <div>
                <Textarea
                  id="description"
                  placeholder="Description/Task"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="flex w-full sm:w-60 md:w-80 gap-2"
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
                  <Label
                    htmlFor="status"
                    className="block md-2 justify-items-center"
                  >
                    Status
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="" variant="outline">
                        {status || "Select Status"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      {statuses.map((item) => (
                        <DropdownMenuItem
                          key={item}
                          onClick={() => setStatus(item)}
                        >
                          {item}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <Label
                    htmlFor="priority"
                    className="block md-2 justify-items-center"
                  >
                    Priority
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
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
                    {users?.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => setAssign_to(user.id)}
                      >
                        {user.id}
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
