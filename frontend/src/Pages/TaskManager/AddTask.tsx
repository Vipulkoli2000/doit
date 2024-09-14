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
const statuses = ["Not Started", "In Progress", "Completed"];

const AddTask = () => {
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const register = () => {
    axios
      .post(
        "/api/tasks",
        {
          // title,
          description,
          priority,
          weight,
          assign_to: "member",
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  placeholder="Weight"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {/* <Label htmlFor="status">Status</Label> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
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
                  {/* <Label htmlFor="priority">Priority</Label> */}
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
