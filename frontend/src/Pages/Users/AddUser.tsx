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

const AddUser = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  // const [role, setRole] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const register = () => {
    axios
      .post(
        "/api/users",
        {
          name: name,
          email: email,
          password: password,
          // roles: role,
        },
        {
          headers: {
            "Content-Type": "application/json ",
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
          <Button variant="outline">Add User</Button>
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
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                value={password || ""}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>  
            {/* <div>
              <Label htmlFor="role">Role</Label>
              <Input
                type="roles"
                id="roles"
                placeholder="Define the role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />
            </div> */}
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
