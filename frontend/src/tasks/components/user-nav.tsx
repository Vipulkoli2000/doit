import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

export function UserNav() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("user");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Adjust this line according to your actual API response structure
        setUser(response.data.Users); // Check this path based on actual response
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                user ? `/path/to/user/avatar/${user.name}` : "/avatars/03.png"
              } // Adjust path as needed
              alt={user ? user.name : "User"}
            />
            <AvatarFallback>{user ? user.name[0] : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {loading ? (
              <p className="text-sm font-medium leading-none">Loading...</p>
            ) : error ? (
              <p className="text-sm font-medium leading-none">{error}</p>
            ) : user ? (
              <>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium leading-none">User not found</p>
            )}
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
