import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "@/Dashboard/Sidebar";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";

const HandleSave = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const getitem = localStorage.getItem("user");
  const user = getitem ? JSON.parse(getitem) : null;
  const hasFetched = useRef(false);
  const { taskId } = useParams();
  useEffect(() => {
    const fetchComments = async () => {
      if (user && !hasFetched.current) {
        hasFetched.current = true;
        try {
          const response = await axios.get("/api/comments", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const fetchedComments = response.data?.data?.comments || [];
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
        toast.success("Comment created successfully!");
        setComments((prevComments) => [...prevComments, comment]);
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
        toast.error("Failed to submit comment.");
      });
  };

  return (
    <div className="flex  space-y-4">
      <Sidebar />
      <div className="flex p-5 flex-col w-full h-full space-y-4">
        {/* Comments List */}
        <h1>Comments</h1>
        <div className="flex-1 flex flex-col space-y-2 text-center overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Card key={index} className="relative mb-2">
                <CardHeader>
                  <h3 className="font-semibold text-lg">Comment {index + 1}</h3>
                </CardHeader>
                <Button variant="ghost" className="absolute top-2 right-2 p-0">
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

        {/* Container for Input and Button at the bottom */}
        <div className="flex w-full items-center space-x-2 mt-auto">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment..."
            className="flex-1 mb-2"
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
