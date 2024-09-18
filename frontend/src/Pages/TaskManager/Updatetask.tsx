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
const weights = ["0", "0.25", "0.50", "0.75", "1.00"];

const UpdateTask = ({ taskId, initialTaskData }) => {
  const [description, setDescription] = React.useState(
    initialTaskData.description || ""
  );
  const [priority, setPriority] = React.useState(
    initialTaskData.priority || ""
  );
  const [weight, setWeight] = React.useState(initialTaskData.weight || "");
  const [assign_to, setassign_to] = React.useState();
  const [project_id, setProject_id] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  // Fetch Users
  React.useEffect(() => {
    axios
      .get("/api/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.data.Users);
      })
      .catch((error) => {
        console.error("Failed to fetch users", error);
      });
  }, [user.token]);

  // Fetch Projects
  React.useEffect(() => {
    axios
      .get("/api/projects", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setProjects(response.data.data.Projects); // Update based on your API response structure
      })
      .catch((error) => {
        console.error("Failed to fetch projects", error);
      });
  }, [user.token]);

  const updateTask = () => {
    axios
      .put(
        `/api/tasks/${taskId}`,
        {
          description,
          priority,
          weight,
          assign_to,
          status: "In Progress",
          start_date: "1111/11/11",
          end_date: "1111/11/11",
          project_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        toast.success("Task updated successfully.");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Failed to update task.");
        console.error(error);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      updateTask(); // Trigger form submission
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            className="  border-transparent justify-center"
          >
            Update Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <ScrollArea>
            <DialogHeader>
              <DialogTitle>Update Task</DialogTitle>
              <DialogDescription>
                You can update tasks here. Click save when you're done.
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
                    <Button className="w-full" variant="outline">
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
              <div>
                <Label htmlFor="priority_id">Priority</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
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
              <div>
                <Label htmlFor="assign_to">Assign To</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
                      {assign_to || "Select User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                    {users?.map((user) => (
                      <DropdownMenuItem
                        key={user.name}
                        onClick={() => setassign_to(user.id)}
                      >
                        {user.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <Label htmlFor="project_id">Project</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
                      {projectName || "Select Project"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Project</DropdownMenuLabel>
                    {projects?.map((project) => (
                      <DropdownMenuItem
                        className="w-full"
                        key={project.id}
                        onClick={() => {
                          setProject_id(project.id);
                          setProjectName(project.name);
                        }}
                      >
                        {project.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateTask} type="button">
                Save changes
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateTask;
