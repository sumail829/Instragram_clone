import { Heart } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

import React from 'react'
import { Button } from './ui/button';
import { RegisterDialog } from './register-dialog';

export default function Navbar() {
  return (
    <div className='flex items-center justify-between'>
        <p>Instagram</p>
      <div className='flex items-center gap-4'>
        <RegisterDialog></RegisterDialog>
      <Heart />
      <MessageCircle />
      </div>
    </div>
)

}