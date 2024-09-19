import React, { useState, useEffect } from "react";
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
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

// Define the props type
type UpdateUserProps = {
  userId?: string; // Optional prop for user ID
  user?: {
    name: string;
    email: string;
    password: string;
    // role: string; // Uncomment if you need role
  };
};

const UpdateUser: React.FC<UpdateUserProps> = ({ userId, user }) => {
  const initialUserData = user;
  const [email, setEmail] = useState<string>(initialUserData?.email || "");
  const [password, setPassword] = useState<string>(
    initialUserData?.password || ""
  );
  const [name, setName] = useState<string>(initialUserData?.name || "");
  // const [role, setRole] = useState<string>(initialUserData?.role || ""); // Uncomment if needed
  const [open, setOpen] = useState<boolean>(false);
  const getitem = localStorage.getItem("user");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const users = JSON.parse(getitem || "{}");

  const handleSubmit = async () => {
    try {
      await axios.put(
        `/api/users/${userId}`,
        {
          name: name,
          email: email,
          password: password,
          // roles: role, // Uncomment if you need to handle roles
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${users.token}`,
          },
        }
      );
      toast.success("User updated successfully.");
      window.location.reload(); // Refresh the page after successful update
      setOpen(false); // Close dialog after success
      // Refresh or update your user list here if needed
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Failed to update user.");
      console.error(error);
    }
  };

 
  return (
    <div>
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogTrigger asChild>
          <Button variant="ghost">Update User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Update the user details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} type="button">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateUser;
