// @ts-nocheck
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const priorities = ["Low", "Medium", "High"];

const FilterPriority = ({ setPriorityFilter }) => {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const handlePrioritySelect = (priority: string) => {
    setSelectedPriority(priority);
    setPriorityFilter(priority);
  };

  const handleReset = () => {
    setSelectedPriority(null);
    setPriorityFilter(null); // Or set to a default value if necessary
    window.location.reload(); // Reload the window
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-dashed">Filter Priority</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priorities.map((priority) => (
          <DropdownMenuItem
            key={priority}
            onClick={() => handlePrioritySelect(priority)}
          >
            {priority}
          </DropdownMenuItem>
        ))}
        {/* Reset Button */}
        <DropdownMenuItem onClick={handleReset}>Reset Filter</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterPriority;
