import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

function Navbar() {

    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        <div className='fixed flex items-center justify-between w-full px-4 py-3 cursor-pointer z-5 backdroup-blur-2xl sm:px-20 xl:px-32'>
            <img onClick={() => navigate('/')} className='w-32 cursor-pointer sm:w-44' src={assets.logo} alt="logo" />
            {user ? <UserButton /> : (<button onClick={openSignIn} className='flex items-center gap-2 text-sm text-white rounded-md cursor-pointer bg-primary px-10 py-2.5'>Get Started <ArrowRight className='w-4 h-4' /></button>)}
        </div>
    )
}

export default Navbar
