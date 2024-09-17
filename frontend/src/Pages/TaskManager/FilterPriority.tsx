import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const priorities = ["Low", "Medium", "High"];


const FilterPriority = ({ setPriorityFilter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter Priority</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priorities.map((priority) => (
          <DropdownMenuItem
            key={priority}
            onClick={() => setPriorityFilter(priority)}
          >
            {priority}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterPriority;
