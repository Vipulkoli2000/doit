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

const AddProject = () => {
  const [description, setDescription] = React.useState("");
  //   const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

  const register = () => {
    axios
      .post(
        "/api/projects",
        {
          name: name,
          description: description,
        },
        { headers: { "Content-Type": "application/json" } }
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
