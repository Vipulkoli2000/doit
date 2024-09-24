// @ts-nocheck
import React from "react";
import { format } from "date-fns";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import DatePicker from "react-datepicker";
import axios from "axios";

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
  const [assign_to, setAssignTo] = React.useState(
    initialTaskData.assign_to || ""
  );
  const [assignToName, setAssignToName] = React.useState(
    initialTaskData.assignToName || "" // Keep this for display purposes
  );
  const [project_id, setProject_id] = React.useState(
    initialTaskData.project_id || ""
  );
  const [projectName, setProjectName] = React.useState(
    initialTaskData.projectName || ""
  );
  const [start_date, setStartDate] = React.useState(
    initialTaskData.start_date || null // Use null as the initial value
  );
  const [end_date, setEndDate] = React.useState(initialTaskData.end_date || "");
  const formattedStartDate = start_date
    ? format(start_date, "yyyy/MM/dd")
    : null;
  const formattedEndDate = end_date ? format(end_date, "yyyy/MM/dd") : null;

  const [users, setUsers] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  // const [end_date, setEndDate] = React.useState(
  //   initialTaskData.end_date || null
  // );

  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  React.useEffect(() => {
    if (assign_to) {
      const selectedUser = users.find((user) => user.id === assign_to);
      if (selectedUser) {
        setAssignToName(selectedUser.name);
      }
    }
  }, [assign_to, users]);

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
        setProjects(response.data.data.Projects);
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
          start_date: formattedStartDate, // Use formatted start date
          end_date: formattedEndDate, // Use formatted end date
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
        toast.success("Task updated successfully.");
        setOpen(false);
        window.location.reload(); // Refresh the page
      })
      .catch((error) => {
        toast.error("Failed to update task.");
        console.error(error);
      });
  };

  const handleKeyDown = (e) => {
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
            className="h-8 w-full border-transparent justify-center"
          >
            Update Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[390px] xl:max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>
              You can update tasks here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] overflow-y-auto  ">
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
                <Label htmlFor="priority">Priority</Label>
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
              {/* <div>
                <Label htmlFor="assign_to">Assign To</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
                      {assign_to || "Select User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                    {users.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => setAssignTo(user.id)}
                      >
                        {user.id}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}
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
                    {users.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => {
                          setAssignTo(user.id); // Set the ID
                          setAssignToName(user.name); // Set the name for display
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
                    {projects.map((project) => (
                      <DropdownMenuItem
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <DatePicker
                    selected={start_date} // Use start_date here
                    onChange={(date) => setStartDate(date)}
                    className="w-full border rounded bg-transparent p-2"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Start Date"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <DatePicker
                    selected={end_date} // Use end_date here
                    onChange={(date) => setEndDate(date)}
                    className="w-full border rounded bg-transparent p-2"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select End Date"
                    minDate={start_date} // Ensure this uses start_date
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={updateTask} type="button">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateTask;
