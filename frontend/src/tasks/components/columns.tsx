// @ts-nocheck

import { useState, useEffect } from "react";
import axios from "axios";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import AddTask from "../Addtask";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define your User type
export type User = {
  id: string;
  description: string;
  priority: string;
  weight: number;
  assignedUser: string;
};
type Task = {
  id: string;
  // Add other fields that a task may have
  description: string;
  status: string;
  priority: string;
};

// Define your columns
export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description/Tasks",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("priority")}</div>
    ),
  },
  {
    accessorKey: "weight",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Weight
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("weight")}</div>
    ),
  },
  {
    accessorKey: "assignedUser",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assign To
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const assignedUser = row.getValue("assignedUser");
      return <div className="lowercase">{assignedUser}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const getitem = localStorage.getItem("users"); // Assuming 'users' is the key

      const users = getitem ? JSON.parse(getitem) : null;

      if (!users || !users.token) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
          try {
            await axios.delete(`/api/tasks/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${users.token}`,
              },
            });
            window.location.reload();

            // Remove the deleted task from the state
            setData((prevData: Task[]) =>
              prevData.filter((task) => task.id !== id)
            );

            toast.success("Task deleted successfully");
          } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
          }
        }
      };

      // const handleUpdate = async (id: string) => {
      //   // if (window.confirm("Are you sure you want to update this task?")) {
      //   //   setOpen(true);
      //   // }
      //   try {
      //     const response = await axios.get(`/api/tasks/${id}`, {
      //       headers: {
      //         Authorization: `Bearer ${users.token}`,
      //       },
      //     });
      //     setTask(response.data.data.Task);
      //     setOpen(true);
      //   } catch (error) {
      //     console.error("Error fetching task:", error);
      //   }
      // };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy Task ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
              Delete Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdate(user.id)}>
              Update Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Define the main component
export function DataTableDemo() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  // const [task, setTask] = useState<Task>({});

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setData(response.data.data.Task);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task deletion

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex bg-background">
      <main className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="w-full">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Task Manager
              </h2>
              <p className="text-muted-foreground">Manage your tasks here.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 ">
            <div className="flex items-center py-2">
              <Input
                placeholder="Filter Tasks..."
                value={
                  (table.getColumn("priority")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("priority")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
            <div className="flex flex-row-reverse items-center py-2">
              <AddTask />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No tasks found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DataTableDemo;
