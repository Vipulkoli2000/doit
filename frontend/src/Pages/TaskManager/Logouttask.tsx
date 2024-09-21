// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Logouttask = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const navigate = useNavigate();

  // Logout function that triggers when the "Continue" button is clicked
  const handleSignOut = () => {
    setIsLoggingOut(true);
  };

  useEffect(() => {
    if (isLoggingOut) {
      axios
        .get("/api/logout", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          console.log("Logged out:", response.data);
          localStorage.removeItem("user"); // Optionally clear the user data from local storage
          navigate("/");
        })
        .catch((error) => {
          console.error("Logout error:", error);
          setIsLoggingOut(false); // Reset if logout fails
        });
    }
  }, [isLoggingOut, user.token]);

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="relative group">
            <Button variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>

            <span
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              SignOut
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to sign out of your account. Any unsaved changes
              will be lost. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Logouttask;
