"use client";

import { toast } from '@/hooks/use-toast';
import axios from 'axios'
import { DeleteIcon, Eye, FilePen, Heart, MessageCircleMore, MoreHorizontal, Share, Trash } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

interface IPost {
    _id: string;
    image: string;
    title: string;
    likeCount: number;
    comments: [
      {
        commentMessage: string;
      }
    ];
  }


export default function FeedSection() {
    const { toast } = useToast()
  const[posts,setPosts]=useState([]);
    const fetchPosts=async()=>{
        try {
            const receivedPosts=await axios.get("http://localhost:4000/posts");
            console.log(receivedPosts.data);
            setPosts(receivedPosts.data);
        } catch (error) {
            console.log("Something went wromg",error)
            
        }
    }

    useEffect(()=>{
        fetchPosts();
    },[]);

     const handleDeletePost=async(_id: string)=>{
        try {
            const response=await axios.delete(`http://localhost:4000/posts/${_id}`);

            console.log(response)
            fetchPosts();
            toast({
                title: "Post Deleted",
                description: "Friday, February 10, 2023 at 5:57 PM",
              })
            
        } catch (error) {
            console.log("something wet wrong",error)
            toast({
                title: "Post Deleted failed",
                description: "Friday, February 10, 2023 at 5:57 PM",
              })
            
        }
        
     }





    return (
        <div className='space-y-8 mt-5'>
            {posts.map((post:IPost, index:number) => (
                <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Image
                                src={"data:image/jpeg;base64,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"}
                                alt={"feed"}
                                height={25}
                                width={25}
                                className='rounded-full w-8 h-8'>

                            </Image>
                            <p>Samir panjiyar</p>

                        </div>
                        <Link href={`/posts/${post._id}`}> <FilePen></FilePen></Link>
                        <Link href={`/posts/view/${post._id}`}><Eye></Eye></Link>
                       <Trash onClick={()=>{handleDeletePost(post._id)}} ></Trash>
                    </div>
                    <Image 
                    src={post.image}
                    alt={"image"}
                    className='object-cover'
                    height={500}
                    width={500}>

                    </Image>

                    <div className=" flex items-center gap-4">
            <Heart />
            <MessageCircleMore />
            <Share />
          </div>
                </div>
            ))}
        </div>
    )
}
