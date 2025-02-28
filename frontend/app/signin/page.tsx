"use client"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Facebook } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";


export default function Signin() {
   const[email,setEmail]=useState("");
   const[password,setPassword]=useState("");
   const router = useRouter();
   
   const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:4000/users/signin", { email, password });
        console.log(response.data);
        router.push("/instapage");
    } catch (error) {
        console.error("Login failed", error);
        alert("Invalid email or password. Please try again.");
    }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Left side - Phone mockup (hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-[380px] h-[580px]">
            <Image 
              src="https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe239b7c9f.png"
              alt="Instagram app screenshot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
          {/* Login card */}
          <div className="bg-white p-8 border border-gray-300 rounded-sm">
            <div className="flex justify-center mb-8">
              <Image 
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                alt="Instagram"
                width={175}
                height={51}
                priority
              />
            </div>
            
            <form className="flex flex-col gap-3" onSubmit={loginUser}>
              <Input 
                type="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Phone number, username, or email"
                className="bg-gray-50 border border-gray-200 text-sm h-10"
              />
              <Input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-sm h-10"
              />
              <Button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                Log in
              </Button>
            </form>
            
            <div className="flex items-center my-4">
              <Separator className="flex-grow" />
              <span className="px-4 text-gray-500 text-sm font-semibold">OR</span>
              <Separator className="flex-grow" />
            </div>
            
            <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-blue-900 font-semibold">
              <Facebook size={18} className="text-blue-900" />
              Log in with Facebook
            </Button>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-blue-900 text-xs">Forgot password?</a>
            </div>
          </div>
          
          {/* Sign up card */}
          <div className="bg-white p-5 border border-gray-300 rounded-sm text-center">
            <p className="text-sm">
              Don&apos;t have an account? <a href="#" className="text-blue-500 font-semibold">Sign up</a>
            </p>
          </div>
          
          {/* App download */}
          <div className="text-center mt-4">
            <p className="text-sm mb-4">Get the app.</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="block">
                <Image 
                  src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png"
                  alt="Download on the App Store"
                  width={136}
                  height={40}
                />
              </a>
              <a href="#" className="block">
                <Image 
                  src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png"
                  alt="Get it on Google Play"
                  width={136}
                  height={40}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-16 text-xs text-gray-500 max-w-4xl w-full">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <a href="#" className="hover:underline">Meta</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Top Accounts</a>
          <a href="#" className="hover:underline">Locations</a>
          <a href="#" className="hover:underline">Instagram Lite</a>
          <a href="#" className="hover:underline">Threads</a>
          <a href="#" className="hover:underline">Contact Uploading & Non-Users</a>
          <a href="#" className="hover:underline">Meta Verified</a>
        </div>
        <div className="flex justify-center gap-4">
          <select className="bg-transparent text-xs text-gray-500 border-none">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
          </select>
          <span>© 2025 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
}