"use client"


import axios from 'axios';
import { Store } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function StorySection() {
   
    const[stories,setStories]=useState([]);
    const fetchPosts=async()=>{
        try {
            const receivedStories=await axios.get("http://localhost:4000/users");
            console.log(receivedStories.data);
            setStories(receivedStories.data);
        } catch (error) {
            console.log("Something went wromg",error)
            
        }
    };

    console.log(stories,"its story")

    useEffect(()=>{
        fetchPosts();
    },[]);
   
   
   
   
   
   
   
   
   
   
   
   
   
    // const stories = [
    //     {
    //         username: "sam",
    //         src: "https://images.unsplash.com/photo-1611262588024-d12430b98920?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcnklMjBpbnN0YWdyYW18ZW58MHx8MHx8fDA%3D",
    //     },
    //     {
    //         username: "nilkesh",
    //         src: "https://images.unsplash.com/photo-1611262588024-d12430b98920?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcnklMjBpbnN0YWdyYW18ZW58MHx8MHx8fDA%3D",
    //     },
    //     {
    //         username: "bandana",
    //         src: "https://images.unsplash.com/photo-1611262588024-d12430b98920?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcnklMjBpbnN0YWdyYW18ZW58MHx8MHx8fDA%3D",
    //     }
    // ]

    return (

        <div className='grid grid-cols-5 gap-5'>

            {
                stories.map((story, index) => (
                    <div key={index} className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                        <Image src={story.profilePicture} alt="image" height={100} width={100}></Image></div>
                ))
            }

        </div>
    )
}
