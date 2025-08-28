import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

function Sidebar() {
    return (
        <div className='flex flex-col min-h-full pt-6 border-r border-gray-200'>
            <NavLink end={true} to='/admin' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer px-3 ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.home_icon} alt="" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Dashboard</p>
            </NavLink>
            <NavLink to='/admin/addBlog' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer px-3 ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.add_icon} alt="" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Add Blogs</p>
            </NavLink>
            <NavLink to='/admin/listBlog' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer px-3 ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.list_icon} alt="" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Blog lists</p>
            </NavLink>
            <NavLink to='/admin/comments' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer px-3 ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.comment_icon} alt="" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Comments</p>
            </NavLink>
        </div>
    )
}

export default Sidebar
