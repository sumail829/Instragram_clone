'use client';

import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Post {
    id: string;
    title: string;
    image: string;
    likeCount: number;
}

interface PageProps {
    params: { id: string };
}

export default function Page({ params }: PageProps) {
    const { toast } = useToast();
    const postId = params.id;
    console.log(postId);

    const [singlePost, setSinglePost] = useState<Post | null>(null);
    console.log('this is single post', singlePost);

    const fetchSinglePost = async () => {
        try {
            const response = await axios.get<Post>(`http://localhost:4000/posts/${postId}`);
            console.log(response.data);
            setSinglePost(response.data);
        } catch (error) {
            console.log('Something went wrong', error);
            toast({
                title: 'Something went wrong while fetching single post',
            });
        }
    };

    useEffect(() => {
        fetchSinglePost();
    }, []); // Added dependency array to prevent infinite re-renders

    return (
        <div>
            {singlePost && (
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-3xl">
                    <div className="md:flex">
                        <div className="md:shrink-0">
                            <Image
                                className="h-48 w-full object-cover md:h-full md:w-48"
                                src={singlePost.image}
                                alt={"Post image"}
                                width={500}
                                height={500}
                            />
                        </div>
                        <div className="p-8 w-full">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                Post Details
                            </div>
                            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
                                {singlePost.title}
                            </h1>
                            <div className="mt-4 flex items-center">
                                <Heart className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-gray-500">{singlePost.likeCount} likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}