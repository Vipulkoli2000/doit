import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const AddUsers = ({ setSelectedUsers, setDisplayUsers, displayUsers }) => {
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const [AddUser, setAddUser] = useState(false);
  const [open, setOpen] = useState(false);

  const getUserData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/users`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    setUsers(response?.data?.data?.users || []);
    return response.data.data.users;
  };

  const {
    data: UsersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    onSuccess: (data) => {
      console.log("Fetched users data successfully", data);
    },
    onError: (error) => {
      console.error("Error fetching users data", error);
    },
  });

  useEffect(() => {
    const selectedIds = displayUsers.map((user) => user.id);
    setSelectedUsers(selectedIds);
  }, [displayUsers]);

  const handleCheckboxChange = (id, fullName) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(id)
        ? prevSelectedUsers.filter((userId) => userId !== id)
        : [...prevSelectedUsers, id]
    );

    setDisplayUsers((prevDisplayUsers) =>
      prevDisplayUsers.some((user) => user.id === id)
        ? prevDisplayUsers.filter((user) => user.id !== id)
        : [...prevDisplayUsers, { id, fullName }]
    );
  };

  const handleSubmit = () => {
    setSelectedUsers(selectedUsers);
    console.log(selectedUsers);
  };

  // Fetch users again after adding a new one
  const handleUserAdded = () => {
    queryClient.invalidateQueries(["userData"]);
  };

  return (
    <div>
      <Sheet
        open={open}
        onOpenChange={(e) => {
          setOpen(e);
        }}
      >
        <SheetTrigger asChild>
          <div className="cursor-pointer flex border border-input bg-background p-4 justify-between pl-2 pr-2 items-center rounded-lg">
            <h1 className="ml-2 font-bold">Add User</h1>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
            >
              Add User
            </SheetTitle>
            <SheetDescription>
              <p>Select users to add to your system</p>
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="w-full h-[76vh] rounded-md">
            <div className="grid gap-4 py-4">
              <h2 className="font-bold">Users</h2>
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
                >
                  <Label htmlFor={`user-${user.id}`}>{user.fullName}</Label>
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() =>
                      handleCheckboxChange(user.id, user.fullName)
                    }
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter>
            <Button
              onClick={() => {
                handleUserAdded();
              }}
            >
              Add New User
            </Button>
            <SheetClose asChild>
              <Button onClick={handleSubmit} type="submit">
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddUsers;
