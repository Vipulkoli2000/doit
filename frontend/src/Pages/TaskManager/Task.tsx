import React, { useState, useEffect } from "react";
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
import AddTask from "./AddTask";
import UpdateTask from "./Updatetask";
import FilterPriority from "./FilterPriority";
import FilterStatus from "./FilterStatus";
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
import { DataTablePagination } from "../../tasks/components/data-table-pagination";
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
  assign_to: string;
  project: string;
  status: string;
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
    cell: ({ row }) => {
      const isChecked = row.getIsSelected();
      const taskId = row.original.id;
      const userToken = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const handleStatusChange = async (checked: boolean) => {
        try {
          await axios.put(
            `/api/tasks/${taskId}`,
            {
              status: checked ? "Done" : "In Progress",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          toast.success("Task status updated successfully.");
        } catch (error) {
          toast.error("Failed to update task status.");
          console.error(error);
        }
      };

      return (
        <Checkbox
          checked={isChecked}
          onCheckedChange={(value) => {
            handleStatusChange(!!value);
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      );
    },
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
      <div className="capitalize">{row.getValue("priority")}</div>
    ),
  },
  {
    accessorKey: "weight",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Weight(hrs)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("weight")}hrs</div>
    ),
  },

  {
    accessorKey: "assign_to",
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
      const assign_to = row.getValue("assign_to");
      return <div className="capitalize">{assign_to}</div>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Project
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const project = row.getValue("project");
      return <div className="capitalize">{project}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <div className="capitalize">{status}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const getitem = localStorage.getItem("user");
      const users = JSON.parse(getitem);

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
            setData((prevData) => prevData.filter((task) => task.id !== id));
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
              className="justify-center"
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy Task ID
            </DropdownMenuItem>
            <DropdownMenuItem
              className="justify-center"
              onClick={() => handleDelete(user.id)}
            >
              Delete Task
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <UpdateTask taskId={user.id} initialTaskData={user} />
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
  const [task, setTask] = useState<Task>({});
  //filter
  const [priorityFilter, setPriorityFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  React.useEffect(() => {
    if (priorityFilter) {
      table.getColumn("priority")?.setFilterValue(priorityFilter);
    }
  }, [priorityFilter]);
  React.useEffect(() => {
    if (statusFilter) {
      table.getColumn("status")?.setFilterValue(statusFilter);
    }
  }, [statusFilter]);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/api/tasks",

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
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
          <div className="grid grid-cols-3 items-center py-2 gap-4">
            <div className="flex items-center">
              <Input
                placeholder="Filter Tasks..."
                value={
                  (table.getColumn("assign_to")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("assign_to")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="">
                <FilterPriority setPriorityFilter={setPriorityFilter} />
              </div>
              <div className="">
                <FilterStatus setStatusFilter={setStatusFilter} />
              </div>
            </div>

            <div className="flex justify-end">
              <AddTask />
            </div>
          </div>

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
        <DataTablePagination table={table} />
      </main>
    </div>
  );
}

export default DataTableDemo;
