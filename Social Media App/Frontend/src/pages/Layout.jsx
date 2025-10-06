import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import { dummyUserData } from '../assets/assets';
import Loading from '../components/Loading';

function Layout() {

    const user = dummyUserData;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return user ? (
        <div className='flex w-full h-screen'>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='flex-1 bg-slate-50'>
                <Outlet />
            </div>
            {
                sidebarOpen ? 
                <X onClick={() => setSidebarOpen(false)} className='absolute w-10 h-10 p-2 text-gray-600 bg-white rounded-md shadow top-3 right-3 z-100 sm:hidden' />
                :
                <Menu onClick={() => setSidebarOpen(true)} className='absolute w-10 h-10 p-2 text-gray-600 bg-white rounded-md shadow top-3 right-3 z-100 sm:hidden' />
            }
        </div>
    ) : (
        <div>
            <Loading />
        </div>
    )
}

export default Layout
