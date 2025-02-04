import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import { title } from "process";
import { useState } from "react";

export function CreatePostDialog() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  console.log(loading);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if(!image){
        return;
    }
    setLoading(true);

    const formData=new FormData();

    formData.append("title",title);
    formData.append("image",image);

    try {
      const res = await axios.post("http://localhost:4000/posts",formData);
      setLoading(false);
      setTitle("");
      setImage("");
      toast({
        title: "Post creation success",
      });
    } catch (error) {
      console.log("Post creation failed", error);
      toast({
        title: "Post creation failed",
      });
        setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className=" bg-blue-500"
          size={"sm"}>
          Create New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post   {loading ===true && <Loader className=" animate-spin" /> }     </DialogTitle>
          <DialogDescription>Fill the form below to create a new post</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            onSubmit={handleCreatePost}
            className=" space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                required={true}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Image</Label>
              <Input
                required
                type="file"
              
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Create Post</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}