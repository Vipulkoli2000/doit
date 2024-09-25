// @ts-nocheck
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const UpdateProject = ({ taskId, initialTaskData }) => {
  console.log(initialTaskData);
  const [description, setDescription] = React.useState(
    initialTaskData.description || ""
  );
  const [name, setName] = React.useState(initialTaskData.name || "");

  const [open, setOpen] = React.useState(false);

  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const Projects_id = initialTaskData.id;
  console.log(initialTaskData.project_id);

  const updateProject = () => {
    axios
      .put(
        `/api/projects/${Projects_id}`,
        {
          description,
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        toast.success("Project updated successfully.");
        setOpen(false);
        window.location.reload(); // Refresh the page after update
      })
      .catch((error) => {
        toast.error("Failed to update Project.");
        console.error(error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      updateProject(); // Trigger the task update
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            className="border-transparent justify-center"
          >
            Update Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[390px] xl:max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>Update Project</DialogTitle>
            <DialogDescription>
              You can update Projects here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input
                id="name"
                placeholder="Project Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <Textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={updateProject}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProject;
