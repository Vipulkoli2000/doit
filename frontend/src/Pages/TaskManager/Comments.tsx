// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "@/Dashboard/Sidebar";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const HandleSave = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const getitem = localStorage.getItem("user");
  const user = getitem ? JSON.parse(getitem) : null;
  const hasFetched = useRef(false);
  const { taskId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      if (user && !hasFetched.current) {
        hasFetched.current = true;
        try {
          const response = await axios.get(`/api/comments/${taskId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const fetchedComments = response.data?.data?.TaskSubmissions || [];
          setComments(fetchedComments);
        } catch (error) {
          console.error("Failed to fetch comments", error);
        }
      }
    };

    fetchComments();
  }, [user]);

  const handleSave = () => {
    axios
      .post(
        `/api/comments`,
        {
          task_id: taskId,
          comments: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        window.location.reload();
        toast.success("Comment created successfully!");
        setComments((prevComments) => [...prevComments, { comments: comment }]);
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
        toast.error("Failed to submit comment.");
      });
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleDelete = (commentId) => {
    axios
      .delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(() => {
        toast.success("Comment deleted successfully!");
        // Filter out the deleted comment from the state
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentId)
        );
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment.");
      });
  };

  return (
    <div className="flex space-y-4">
      <Sidebar className="min-h-screen" />
      <div className="flex p-5 flex-col  w-full space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
        <div className="flex-1 flex flex-col space-y-2 text-center overflow-y-auto">
          <ScrollArea className="max-h-[400px] overflow-y-auto scroll-smooth">
            {" "}
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Card key={index} className="relative mb-2">
                  <CardHeader>
                    <h3 className="underline font-semibold text-lg">
                      Comment {index + 1}
                    </h3>
                  </CardHeader>

                  <Button
                    variant="ghost"
                    className="absolute top-2 right-2 p-0"
                    onClick={() => handleDelete(comment.id)} // Add delete functionality
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <CardContent>
                    <p className="max-h-40 overflow-y-auto">
                      {" "}
                      {comment && comment.comments}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </ScrollArea>
        </div>

        {/* Input and Button at the bottom */}
        <div className="flex w-full items-center space-x-2 mt-auto">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment..."
            className="flex-1 mb-2"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleSave} className="mb-2">
            Save Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HandleSave;
