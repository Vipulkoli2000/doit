import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X } from "lucide-react"; // Icon for cross (you can use any icon library you prefer)
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // ShadCN Dialog components
import axios from "axios";
import { toast } from "sonner";

const HandleSave = ({ taskId, initialTaskData }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [task_id, setTask_id] = useState("");
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const handleSave = () => {
    axios
      .post(
        `/api/comments`,
        {
          comments: comment,
          task_id: taskId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Use correct token from localStorage or user state
          },
        }
      )
      .then(() => {
        toast.success("Comment created successfully!");
        setComment(""); // Clear the input after success
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
        toast.error("Failed to submit comment.");
      });
  };

  const handleDelete = (indexToDelete: number) => {
    setComments(comments.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-4">
      {/* Dialog Box for Input */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Add Comment</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new comment</DialogTitle>
          </DialogHeader>

           <div className="max-h-64 overflow-y-auto space-y-2 mb-4"></div>

 
          <Input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment..."
            className="mb-2"
          />

          <DialogFooter>
            <Button onClick={handleSave} variant="primary">
              Save Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default HandleSave;
