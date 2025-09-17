import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

function Navbar() {

    const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
    
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const changeRole = async () => {
        try {
            const { data } = await axios.post('/api/owners/change-role');
            if(data.success){
                setIsOwner(true);
                toast.success(data.message);
            }
        } catch (error) {
            console.error("Error changing role:", error);
            toast.error("Failed to change role.");
        }
    };

    return (
        <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && 'bg-light'}`}>
            <Link to='/'>
                <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className='h-8' />
            </Link>
            <div className={`max-sm:fixed max-sm:h-screen max:sm:w-full max-sm:top-16 max-sm:border-t border-borderColor left-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? 'bg-light' : 'bg-white'} ${open ? 'max-sm:translate-x-0' : 'max-sm:-translate-x-full'}`}>
                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path}>
                        {link.name}
                    </Link>
                ))}
                <div className='items-center hidden gap-2 px-3 text-sm border rounded-md border-borderColor lg:flex max-w-56'>
                    <input type="text" placeholder='Search Products' className='w-full py-1 placeholder-gray-500 bg-transparent outline-none' />
                    <img src={assets.search_icon} alt="search" />
                </div>
                <div className='flex items-start gap-6 max-sm:flex-col sm:items-center'>
                    <button onClick={() => isOwner ? navigate('/owner') : changeRole()} className='cursor-pointer'>{isOwner ? 'Dashboard' : 'List cars'}</button>
                    <button onClick={() => {user ? logout() : setShowLogin(true)}} className='px-8 py-2 text-white transition-all rounded-md cursor-pointer bg-primary hover:bg-primary-dull'>{user ? 'Logout' : 'Login'}</button>
                </div>
            </div>
            <button onClick={() => setOpen(!open)} className='cursor-pointer sm:hidden' aria-label='Menu'>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>
        </motion.div>
    )
}

export default Navbar