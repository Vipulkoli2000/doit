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

const AddTask = () => {
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [status, setStatus] = React.useState("");
  // const [assignTo, setAssignTo] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const register = () => {
    axios
      .post(
        "/api/tasks",
        {
          title: title,
          description: description,
          priority: priority,
          weight: weight,
          assign_to: "member",
          status: status,
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
      .then((response) => {
        toast.success("User created successfully.");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Failed to create user.");
        console.log(error);
      });
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              You can add new users here. Click save when you're done.
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
              <Label htmlFor="description">Description</Label>
              <Input
                type="Description"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                type="priority"
                id="priority"
                placeholder="Priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                type="weight"
                id="weight"
                placeholder="Weight"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
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

export default AddTask;
