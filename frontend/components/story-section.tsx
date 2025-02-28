"use client"

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Story {
    username: string;
    profilePicture: string;
}

export default function StorySection() {
    const [stories, setStories] = useState<Story[]>([]);

    const fetchPosts = async () => {
        try {
            const receivedStories = await axios.get<Story[]>("http://localhost:4000/users");
            console.log(receivedStories.data);
            setStories(receivedStories.data);
        } catch (error) {
            console.log("Something went wrong", error);
        }
    };

    console.log(stories, "its story");

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='grid grid-cols-5 gap-5'>
            {stories.map((story, index) => (
                <div key={index} className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                    <Image src={story.profilePicture} alt="Profile Picture" height={100} width={100} />
                </div>
            ))}
        </div>
    );
}
