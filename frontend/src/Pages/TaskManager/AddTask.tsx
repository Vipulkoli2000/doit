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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
// import { ArrowUpDown } from "lucide-react";

const priorities = ["Low", "Medium", "High"];
// const statuses = ["Not Started", "In Progress"];
const weights = ["0.25", "0.50", "0.75", "1.00"];

const AddTask = () => {
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [weight, setWeight] = React.useState("");
  // const [status, setStatus] = React.useState("");
  const [assign_to, setAssign_to] = React.useState("");
  const [assignToName, setAssignToName] = React.useState("");
  const [project_id, setProject_id] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState("");

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const getItem = localStorage.getItem("user");
        const user = JSON.parse(getItem);

        if (user && user.token) {
          const response = await axios.get("/api/users", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setUsers(response.data.data.Users);
        } else {
          console.error("User token not found.");
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const getItem = localStorage.getItem("user");
        const user = JSON.parse(getItem);

        if (user && user.token) {
          const response = await axios.get("/api/projects", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          setProjects(response.data.data.Projects);
        } else {
          console.error("User token not found.");
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  const register = () => {
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return;
    }
    const getitem = localStorage.getItem("user");
    const user = JSON.parse(getitem);

    if (user && user.token) {
      axios
        .post(
          "/api/tasks",
          {
            description,
            priority,
            weight,
            assign_to,
            start_date: "11/11/1111",
            end_date: "11/11/1111",
            project_id,
            status: "In Progress",
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
          window.location.reload(); // Refresh the page
        })
        .catch((error) => {
          toast.error("Failed to create task.");
          console.error(error);
        });
    } else {
      toast.error("User token not found. Please log in.");
    }
  };

  const projectMap = new Map(
    projects.map((project) => [project.id, project.name])
  );
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      register(); // Trigger form submission
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[390px]">
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
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (descriptionError) setDescriptionError(""); // Clear error if user starts typing
                  }}
                  onKeyDown={handleKeyDown}
                />
                {descriptionError && (
                  <p className="text-red-500 text-sm mt-1">
                    {descriptionError}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="weight">Weight (hrs)</Label>
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
                <Label
                  htmlFor="priority"
                  className="block md-4 justify-items-center"
                >
                  Priority
                </Label>
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
                      {assignToName || "Select User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                    {users?.map((user) => (
                      <DropdownMenuItem
                        className="w-full"
                        key={user.id}
                        onClick={() => {
                          setAssign_to(user.id);
                          setAssignToName(user.name);
                        }}
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
