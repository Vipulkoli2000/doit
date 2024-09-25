import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquareText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

export function TooltipDemo({ taskId }) {
  // Accept taskId as a prop
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comments, setComments] = useState("");
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setComments(""); // Clear the textarea on close
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line on Enter
      try {
        // Send the comment to the API with the task_id
        await axios.post(
          "/api/taskSubmissions",
          {
            comments,
            task_id: taskId, // Include task_id in the request body
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        toast.success("Comment submitted successfully!");
        handleDialogClose();
        fetchComments();
      } catch (error) {
        console.error("Error submitting comment:", error);
        toast.error("Failed to submit comment.");
      }
    }
  };

  // Function to fetch comments from the API
  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/taskSubmissions", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setComments(response.data); // Assuming the response data is an array of comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // useEffect to fetch comments when the component mounts
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div onClick={handleDialogOpen}>
            <MessageSquareText />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Comments</p>
        </TooltipContent>
      </Tooltip>
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              <Textarea
                id="comments"
                placeholder="Description/Task"
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={3} // Set initial number of rows
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

export default TooltipDemo;
