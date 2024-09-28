// @ts-nocheck
import React, { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const priorities = ["Low", "Medium", "High"];
const weights = ["0", "0.25", "0.50", "0.75", "1.00"];

const UpdateTask = ({ taskId, initialTaskData }) => {
  const [title, setTitle] = React.useState(initialTaskData.title || "");
  const [description, setDescription] = React.useState(
    initialTaskData.description || ""
  );
  // const [comments, setComments] = React.useState(
  //   initialTaskData.comments || ""
  // );
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
  const [project, setproject] = React.useState(initialTaskData.project || "");
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
  const [open, setOpen] = React.useState(false);
  // const [end_date, setEndDate] = React.useState(
  //   initialTaskData.end_date || null
  // );

  useEffect(() => {
    console.log(...initialTaskData.assign_to);
    setTitle(initialTaskData.title);
    setDescription(initialTaskData.description);
    setPriority(initialTaskData.priority);
    setWeight(initialTaskData.weight);
    setAssignTo(...initialTaskData.assign_to);
    setAssignToName(initialTaskData.assignToName);
    setProjectName(initialTaskData.projectName);
  }, [initialTaskData]);

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

  // Fetch project
  React.useEffect(() => {
    axios
      .get("/api/project", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setproject(response.data.data.project);
      })
      .catch((error) => {
        console.error("Failed to fetch project", error);
      });
    console.log(project);
  }, [user.token]);

  const updateTask = () => {
    axios
      .put(
        `/api/tasks/${taskId}`,
        {
          title,
          description,
          comments: priority,
          weight,
          assign_to,
          start_date: formattedStartDate, // Use formatted start date
          project,
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>
              You can update tasks here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] overflow-y-auto  ">
            <div className="grid gap-4 py-2">
              <Separator />
              {/* Left side: Task name, description, and comment */}
              <div className="flex flex-col lg:flex-row">
                <div className="flex-grow overflow-y-auto lg:w-1/2">
                  <div className="p-3  space-y-4">
                    <div>
                      <Input
                        id="title"
                        placeholder="Task Name"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-none"
                      />
                    </div>
                    <div>
                      <Textarea
                        id="description"
                        placeholder="Description/Task"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="resize-none "
                      />
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <Textarea
                        placeholder="Comment"
                        className="flex-grow bg-background border-none text-gray-100 resize-none placeholder-gray-500"
                        value={comments}
                        onChange={(event) => setComments(event.target.value)}
                      />
                    </div> */}
                  </div>
                </div>

                <div className="p-3 bg-background space-y-2 lg:w-1/2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="weight">Weight</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full" variant="ghost">
                          {weight || "Select Weight"}
                          {weight && (
                            <button
                              onClick={() => setWeight(null)} // Reset weight when clicked
                              className="px-2 py-1 ml-auto bg-transparent   text-gray-700 "
                            >
                              &times;
                            </button>
                          )}
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

                    {/* Reset (X) button */}
                  </div>

                  {/* Priority dropdown */}

                  <div className="flex items-center space-x-2">
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

                  {/* Assign To dropdown */}
                  <div className="flex items-center space-x-2">
                    <Label className="w-20" htmlFor="assign_to">
                      Assign To
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-" variant="outline">
                          {assign_to || "Select User"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                        {users.map((user) => (
                          <DropdownMenuItem
                            key={user.taskId}
                            onClick={() => {
                              setAssignTo(user.id);
                              setAssignToName(user.name);
                            }}
                          >
                            {user.id}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Project dropdown */}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="project">Project</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full" variant="outline">
                          {projectName || "Select Project"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Project</DropdownMenuLabel>
                        {/* Ensure project is an array and contains valid data */}
                        {Array.isArray(project) && project.length > 0 ? (
                          project.map((proj) =>
                            proj && proj.id && proj.name ? ( // Ensure each project object has id and name
                              <DropdownMenuItem
                                key={proj.id}
                                onClick={() => {
                                  setproject(proj.id);
                                  setProjectName(proj.name);
                                }}
                              >
                                {proj.name}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem key={Math.random()} disabled>
                                Invalid project data
                              </DropdownMenuItem>
                            )
                          )
                        ) : (
                          <DropdownMenuItem disabled>
                            No projects available
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Start Date Picker */}

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <DatePicker
                      selected={start_date}
                      onChange={(date) => setStartDate(date)}
                      className="w-full border rounded bg-transparent p-2"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select Start Date"
                    />
                  </div>
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
