"use client";
import { Eye, FilePen, Heart, MessageCircleMore, Share, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface IComment {
  commentMessage: string;
}

interface IPost {
  _id: string;
  image: string;
  title: string;
  likeCount: number;
  comments: IComment[];
}

export default function FeedSection() {
  const { toast } = useToast();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [currentCommentWalaId, setCurrentCommentWalaId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get<IPost[]>("http://localhost:4000/posts");
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:4000/posts/${_id}`);
      fetchPosts();
      toast({ title: "Post Deleted" });
    } catch (error) {
      console.log("Delete Failed", error);
      toast({ title: "Post deletion failed" });
    }
  };

  const handleLikePost = async (_id: string) => {
    try {
      await axios.patch(`http://localhost:4000/posts/${_id}`, { $inc: { likeCount: 1 } });
      fetchPosts();
    } catch (error) {
      console.log("Like Failed", error);
      toast({ title: "Like Failed" });
    }
  };

  const handlePostAComment = async (e: React.FormEvent<HTMLFormElement>, _id: string) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:4000/posts/${_id}`, { $push: { comments: { commentMessage: commentText } } });
      fetchPosts();
      setCommentText("");
    } catch (error) {
      console.log("Comment Failed", error);
      toast({ title: "Comment Failed" });
    }
  };

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div key={post._id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-10 w-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1611262588024-d12430b98920?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcnklMjBpbnN0YWdyYW18ZW58MHx8MHx8fDA%3D" alt="img" height={500} width={500} />
              <p>Loki Chaulagain</p>
            </div>
            <Link href={`/posts/view/${post._id}`}><Eye /></Link>
            <Link href={`/posts/${post._id}`}><FilePen /></Link>
            <Trash onClick={() => handleDeletePost(post._id)} />
          </div>

          <Image className="object-cover" src={post.image} alt="img" height={500} width={500} />
          <div className="flex items-center gap-4">
            <Heart onClick={() => handleLikePost(post._id)} /> {post.likeCount}
            <MessageCircleMore onClick={() => { setShowComment(!showComment);
               setCurrentCommentWalaId(post._id); }} />
                {post.comments.length}
            <Share />
          </div>
          <p>{post.title}</p>
          <form onSubmit={(e) => handlePostAComment(e, post._id)} className="flex items-center gap-4">
            <Input value={commentText} required onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" />
            <Button type="submit">Comment</Button>
          </form>
          {showComment && currentCommentWalaId === post._id && (
            <div className="bg-gray-200 p-4 rounded-lg border border-sky-200">
              {post.comments.map((comment, index) => (
                <p key={index}>{comment.commentMessage}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
