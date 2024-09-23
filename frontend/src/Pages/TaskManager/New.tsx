"use client";

import * as React from "react";
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
import UpdateTask from "./Updatetask";
import { DataTablePagination } from "../../tasks/components/data-table-pagination";

import { Checkbox } from "@/components/ui/checkbox";
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

export type Payment = {
  id: string;
  description: string;
  priority: string;
  weight: number;
  assign_to: string;
};

export const columns: ColumnDef<Payment>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "description",
    header: "Description/Tasks",
    cell: ({ row }) => (
      <div
        className="truncate max-w-xs sm:max-w-full capitalize"
        title={row.getValue("description")}
      >
        {row.getValue("description")}
      </div>
    ),
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Task ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
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
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h1> Task Manager</h1>
          <p>Manage your tasks here.</p>
        </div>
        <div className="ml-auto">
          <Logout />
        </div>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Tasks..."
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <div className="">
            <FilterPriority setPriorityFilter={setPriorityFilter} />
          </div>
        </div>
        <div className="ml-auto">
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
  );
}
export default DataTableDemo;
