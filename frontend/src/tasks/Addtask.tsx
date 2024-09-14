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
import { CirclePlus } from "lucide-react";

const AddUser = () => {
  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const register = () => {
    axios
      .post(
        "/api/tasks",
        {
          title: title,
          description: "description",
          priority: priority,
          weight: "1",
          status: "todo",
          start_date: "2023-01-01",
          end_date: "2023-01-01",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Task created successfully.");
        setOpen(false);
      })
      .catch((error) => {
        toast.error("Failed to create Task.");
        console.log(error);
      });
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
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
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              You can add new task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="title"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                type="priority"
                id="priority"
                placeholder="Priority will be High, Medium, Low..."
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                type="status"
                id="status"
                placeholder="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={register} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUser;
