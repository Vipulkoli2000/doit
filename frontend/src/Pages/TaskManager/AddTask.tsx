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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BadgePlus } from "lucide-react";
import { Input } from "@/components/ui/input";

const priorities = ["Low", "Medium", "High"];
const weights = [
  "0",
  "0.25",
  "0.50",
  "0.75",
  "1.00",
  "1.25",
  "1.50",
  "1.75",
  "2.00",
  "2.25",
  "2.50",
  "2.75",
  "3.00",
  "3.25",
  "3.50",
  "3.75",
  "4.00",
  "4.25",
  "4.50",
  "4.75",
  "5.00",
  "5.25",
  "5.50",
  "5.75",
  "6.00",
  "6.25",
  "6.50",
  "6.75",
  "7.00",
  "7.25",
  "7.50",
  "7.75",
  "8.00",
];

const AddTask = () => {
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [assign_to, setAssign_to] = React.useState("");
  const [assignToName, setAssignToName] = React.useState("");
  const [project_id, setProject_id] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState("");
  const [titleError, setTitleError] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

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
            title,
            description,
            priority: "Medium",
            weight,
            assign_to,
            start_date: startDate ? startDate.toISOString().slice(0, 10) : null,
            // end_date: endDate ? endDate.toISOString().slice(0, 10) : null,
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
          window.location.reload();
        })
        .catch((error) => {
          toast.error("Failed to create task.");
          console.error(error);
        });
    } else {
      toast.error("User token not found. Please log in.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      register();
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            Add Task <BadgePlus className=" ml-2 " />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] h-[200px] xl:max-h-[100vh]">
          <div className="grid gap-4 py-4">
            <div>
              <Input
                id="title"
                placeholder="Task Name.."
                value={title}
                className="h-7 border-none outline-none"
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (titleError) setTitleError("");
                }}
                onKeyDown={handleKeyDown}
              />
              {titleError && (
                <p className="text-red-500 text-sm mt-1">{titleError}</p>
              )}
            </div>
            <div>
              <Input
                id="description"
                placeholder="Description/Task"
                value={description}
                className="h-7 border-none"
                onChange={(event) => {
                  setDescription(event.target.value);
                  if (descriptionError) setDescriptionError("");
                }}
                onKeyDown={handleKeyDown}
              />
              {descriptionError && (
                <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="px-2 py-1 text-[11px] h-8 w-15 flex items-center justify-between"
                      variant="outline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <span className="mt-1 ml-1">{weight || "Weight"}</span>

                      {/* Show reset icon when weight is selected */}
                      {weight && (
                        <svg
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent dropdown from opening when clicking the cross
                            setWeight(null); // Reset weight
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 ml-1 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="max-h-40 overflow-y-auto">
                    <DropdownMenuLabel>Weight</DropdownMenuLabel>
                    <ScrollArea className="max-h-50">
                      {weights.map((item) => (
                        <DropdownMenuItem
                          key={item}
                          onClick={() => setWeight(item)}
                        >
                          {item}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="px-2 py-1 text-[11px] h-8 w-15 flex items-center justify-between"
                      variant="outline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>

                      <span className="mt-1 ml-1">
                        {assignToName || "User"}
                      </span>
                      {assignToName && (
                        <svg
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent dropdown from opening when clicking the cross
                            setAssign_to(""); // Reset the assigned user
                            setAssignToName(""); // Reset the displayed name
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 ml-1 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
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

              {/* <div className="flex items-center border rounded-[8px] w-23" >
                Clock SVG Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2" // Adjust size and margin
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="px-2 py-1 text-[11px] h-6 w-13 bg-transparent  focus:outline-none text-white"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date"
                />
              </div> */}
            </div>

            <div className="border-b " />
          </div>

          <DialogFooter>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="px-2 py-1 text-[11px] h-6 w-10"
                    variant="outline"
                  >
                    {projectName || "Project"}
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
            <Button type="submit" onClick={register}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTask;
{
  /* <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="px-2 py-1 text-[11px] h-8 w-15 flex items-center justify-between"
                      variant="outline"
                    >
                      {priority || "Priority"}
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
              </div> */
}
{
  /* <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="w-full border rounded bg-transparent p-2"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select End Date"
                    minDate={startDate}
                  />
                </div> */
}
