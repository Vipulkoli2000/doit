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
  const [assign_to, setAssign_to] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const register = () => {
    axios
      .post(
        "/api/tasks",
        {
          id: "111",
          title: title,
          project_id: "111",
          description: "description",
          priority: priority,
          weight: "1",
          status: "todo",
          start_date: "2023-01-01",
          end_date: "2023-01-01",
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
          assign_to: "yash",
        },
        { headers: { "Content-Type": "application/json" } }
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
              <Label htmlFor="assign_to">Assign to</Label>
              <Input
                type="assign_to"
                id="assign_to"
                placeholder="Assign Task "
                value={assign_to}
                onChange={(event) => setAssign_to(event.target.value)}
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
