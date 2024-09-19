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
import { Label } from "@/components/ui/label";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import DatePicker from "react-datepicker";

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
      <div
        className="truncate max-w-xs capitalize"
        title={row.getValue("description")}
      >
        {row.getValue("description")}
      </div>
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
            {/* <DropdownMenuItem
              className="justify-center"
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy Task ID
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="text-sm px-2 py-1"
                onClick={() => handleDelete(user.id)}
              >
                Delete Task
              </Button>
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

  const handlePaste = async (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text");
    const sentences = pastedText
      .split("\n")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    for (const sentence of sentences) {
      try {
        await axios.post(
          "/api/tasks",
          { description: sentence },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        toast.success(`Task added: ${sentence}`);
        window.location.reload();
      } catch (error) {
        toast.error(`Failed to add task: ${sentence}`);
        console.error("Error adding task:", error);
      }
    }
    await fetchTasks();
  };
  const weights = ["0.25", "0.50", "0.75", "1.00"];

  const [description, setDescription] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [assignToName, setAssignToName] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [assign_to, setAssign_to] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [project_id, setProject_id] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      register(); // Trigger form submission
    }
  };
  const register = () => {
    if (!description.trim()) {
      toast.error("Task description is required.");
      return;
    }
    axios
      .post(
        "/api/tasks",
        {
          description,
          weight,
          assign_to,
          project_id,
          start_date: startDate?.toISOString(), // Send start date in ISO format
          end_date: endDate?.toISOString(), // Send end date in ISO format
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      .then(() => {
        localStorage.setItem("toastMessage", "Task created successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      })
      .catch((error) => {
        localStorage.setItem("toastMessage", "Failed to create task.");
        console.error(error);
      });
  };
  useEffect(() => {
    const message = localStorage.getItem("toastMessage");
    if (message) {
      toast(message);
      localStorage.removeItem("toastMessage");
    }
  }, []);
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const getItem = localStorage.getItem("user");
        const user = JSON.parse(getItem);

        if (user && user.token) {
          const response = await axios.get("/api/users", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setUsers(response.data.data.Users);
        } else {
          console.error("User token not found.");
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const getItem = localStorage.getItem("user");
        const user = JSON.parse(getItem);

        if (user && user.token) {
          const response = await axios.get("/api/projects", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          setProjects(response.data.data.Projects);
        } else {
          console.error("User token not found.");
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex bg-background">
      <Toaster position="top-center" richColors></Toaster>
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
          <div className="grid grid-cols-3 items-center py-2 gap-4]">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 ">
            <Input
              placeholder="Type here  ..."
              autoFocus
              onPaste={handlePaste}
              className="mb-2 w-full sm:w-3/4 md:w-2/3 lg:w-3/4 border-0 text-sm"
              style={{}}
              id="description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                if (descriptionError) setDescriptionError(""); // Clear error if user starts typing
              }}
              onKeyDown={handleKeyDown}
            />
            {descriptionError && (
              <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
            )}
            <div className="grid grid-cols-5 gap-0 justify-items-center">
              <div>
                {/* <Label htmlFor="weight">Weight (hrs)</Label> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="border-dashed " variant="ghost">
                      {weight || "Weight(hrs)"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Weight</DropdownMenuLabel>
                    {weights.map((item) => (
                      <DropdownMenuItem
                        key={item}
                        onClick={() => setWeight(item)}
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                {/* <Label htmlFor="assign_to">Assign To</Label> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="border-dashed " variant="ghost">
                      {assignToName || "Users"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                    {users?.map((user) => (
                      <DropdownMenuItem
                        className="w-full"
                        key={user.id}
                        onClick={() => {
                          setAssign_to(user.id);
                          setAssignToName(user.name);
                        }}
                      >
                        {user.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                {/* <Label htmlFor="project_id">Project</Label> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="" variant="ghost">
                      {projectName || "Project"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Project</DropdownMenuLabel>
                    {projects?.map((project) => (
                      <DropdownMenuItem
                        className="w-full"
                        key={project.id}
                        onClick={() => {
                          setProject_id(project.id);
                          setProjectName(project.name);
                        }}
                      >
                        {project.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                {/* <Label htmlFor="start_date">Start Date</Label> */}
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-full  rounded bg-transparent p-2"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start Date"
                />
              </div>
              <div>
                {/* <Label htmlFor="end_date">End Date</Label> */}
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="  w-full rounded bg-transparent p-2"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  minDate={startDate}
                />
              </div>
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
