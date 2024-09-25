// @ts-nocheck
"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logout from "./Logouttask";
import FilterPriority from "./FilterPriority";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import AddTask from "./AddTask";
import Comments from "./Comments";
import UpdateTask from "./Updatetask";
import { DataTablePagination } from "../../tasks/components/data-table-pagination";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../../Dashboard/togglesidebar";
import Sidebar from "@/Dashboard/Sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardNav } from "../../Dashboard/Dashboard-nav";
import { navItems } from "@/Config/data";
import Dialog from "./useDialog";
import { MessageSquareText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

import { Label } from "@/components/ui/label";
export type Payment = {
  id: string;
  title: string;
  description: string;
  priority: "Medium";
  weight: number;
  assign_to: string;
  start_date: string;
  project: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description");
      const truncatedDescription =
        description.length > 30 ? `${description.slice(0, 30)}...` : description;
  
      return (
        <div
          className="flex items-center space-x-2 capitalize hover:cursor-pointer"
          title={description} // Full description as a tooltip
          onClick={() => openDialog(description)} // Pass the full description to the dialog
        >
          <div>
            <Dialog />
          </div>
          {truncatedDescription}
        </div>
      );
    },
  },
  

  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    id: "comments",
    cell: ({ row }) => {
      return (
        <div
          className=" flex items-center space-x-2 capitalize hover:cursor-pointer"
          title={row.getValue("description")}
          onClick={() => row.getValue("comments")}
        >
          <div>
            <Comments />
          </div>
          {row.getValue("comments")}
        </div>
      );
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <div className="border-b " />

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

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getitem = localStorage.getItem("user");
  const [priorityFilter, setPriorityFilter] = React.useState("");
  const user = JSON.parse(getitem);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    if (priorityFilter) {
      table.getColumn("priority")?.setFilterValue(priorityFilter);
    }
  }, [priorityFilter]);

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
  const [description, setDescription] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState("");

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
          priority: "Medium",
          status: "In Progress",
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

  return (
    <div className="flex bg-background">
      <Sidebar />

      <div className="w-full py-4 px-4">
        <Sheet>
          <SheetTrigger className="block sm:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription>
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <div className="mt-3 space-y-1">
                      <DashboardNav items={navItems} />
                    </div>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
          </div>
          <div>
            {/* Logout component */}
            <Logout />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
          <Input
            placeholder="Filter Tasks..."
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-full sm:w-auto"
          />
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <div>
              <FilterPriority setPriorityFilter={setPriorityFilter} />
            </div>
            <div className="ml-auto">
              <AddTask />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Input
            placeholder="Type here  ..."
            autoFocus
            onPaste={handlePaste}
            className="mb-2 w-full outline-none border-0 text-sm"
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
        </div>
        <div className="rounded -md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
export default DataTableDemo;
