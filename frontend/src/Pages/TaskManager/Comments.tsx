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

export default function CommentDialogComponent() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const handleSave = () => {
    if (comment.trim()) {
      setComments([comment, ...comments]);
      setComment("");
    }
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

          {/* Scrollable area for saved comments */}
          <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Card key={index} className="relative mb-2">
                  <CardHeader>
                    <h3 className="font-semibold text-lg">
                      Comment {index + 1}
                    </h3>
                  </CardHeader>

                  {/* Cross icon to delete comment */}
                  <Button
                    variant="ghost"
                    className="absolute top-2 right-2 p-0"
                    onClick={() => handleDelete(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <CardContent>
                    <p>{comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          {/* Input for adding new comments */}
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
}
  