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
import { toast, Toaster } from "sonner";

const AddProject = () => {
  const [description, setDescription] = React.useState("");
  //   const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const register = () => {
    if (!name || !description) {
      toast.error("Name is required", {
        duration: 1000,
      });
      return;
    }
    axios
      .post(
        "/api/projects",
        {
          name: name,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Project created successfully.");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Failed to create user.");
        console.log(error);
      });
  };
  // Handle form submission on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      register(); // Trigger form submission
    }
  };
  return (
    <div>
      <Toaster position="top-center" richColors />
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              You can add new users here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                type="description"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                onKeyDown={handleKeyDown}
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

export default AddProject;
