// @ts-nocheck
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const priorities = ["In Progress", "Done", "Incomplete", "All"];

const FilterStatus = ({ setStatusFilter }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setStatusFilter(status === "All" ? "" : status); // Set filter to empty string for "All"

    // Reload the page if "All" is selected
    if (status === "All") {
      window.location.reload();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-dashed">
          Filter Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priorities.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusSelect(status)}
          >
            {status || "All"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterStatus;
