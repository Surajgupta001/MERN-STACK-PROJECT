import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';

function Layout() {

    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(false);
    const { user } = useUser();

    return user ? (
        <div className='flex flex-col items-start justify-start h-screen'>
            <nav className='flex items-center justify-between w-full px-8 border-b border-gray-200 min-h-14'>
                <img onClick={() => navigate('/')} src={assets.logo} alt="" className='w-32 cursor-pointer sm:w-44'/>
                {
                    sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
                        : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
                }
            </nav>
            <div className='flex flex-1 w-full h-[calc(100vh-64px)]'>
                <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
                <div className='flex-1 bg-[#f4f7fb]'>
                    <Outlet />
                </div>
            </div>
        </div>
    ) : (
        <div className='flex items-center justify-center h-screen'>
            <SignIn />
        </div>
    )
}

export default Layout
