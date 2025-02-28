"use client"
import FeedSection from '@/components/feed-section'
import Navbar from '@/components/navbar'
import StorySection from '@/components/story-section'
import React from 'react'

export default function page() {
  const name= "InstaGram";

  return (
    <div className='w-4/12 mx-auto bg-gray-100 min-h-screen p-4 space-y-6'>
       <Navbar heading={name}></Navbar>
       <StorySection></StorySection>
       <FeedSection></FeedSection>
    </div>

)
}
