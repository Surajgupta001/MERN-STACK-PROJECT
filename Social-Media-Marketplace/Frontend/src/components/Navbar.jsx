import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { BoxIcon, GripIcon, ListIcon, MenuIcon, MessageCircleMoreIcon, User, XIcon } from 'lucide-react';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';

function Navbar() {

    const { user } = useUser();
    const { openSignIn } = useClerk();

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <nav className='h-20'>
            <div className='fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 transition-all bg-white border-b border-gray-300 z-100 md:px-16 lg:px-24 xl:px-32'>
                <img onClick={() => { navigate('/'); scrollTo(0, 0) }} src={assets.logo} alt="logo" className='h-10 cursor-pointer' />
                {/* Desktop Menu */}
                <div className='items-center hidden gap-4 text-gray-800 sm:flex md:gap-8 max-md:text-sm'>
                    <Link to='/' onClick={() => scrollTo(0, 0)}> Home </Link>
                    <Link to='/marketplace' onClick={() => scrollTo(0, 0)}> Marketplace </Link>
                    <Link to={user ? '/messages' : '#'} onClick={() => user ? scrollTo(0, 0) : openSignIn()}> Messages </Link>
                    <Link to={user ? '/my-listings' : '#'} onClick={() => user ? scrollTo(0, 0) : openSignIn()}> My Listings </Link>
                </div>

                {
                    !user ? (
                        <div>
                            <button onClick={openSignIn} className='px-8 py-2 text-white transition bg-indigo-500 rounded-md cursor-pointer max-sm:hidden hover:bg-indigo-600'>Login</button>
                            <MenuIcon onClick={() => setMenuOpen(true)} className='sm:hidden'/>
                        </div>
                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/marketplace')} label='Marketplace' labelIcon={<GripIcon size={16} />}/>
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/messages')} label='Messages' labelIcon={<MessageCircleMoreIcon size={16} />}/>
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/my-listings')} label='My Listings' labelIcon={<ListIcon size={16} />}/>
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/my-orders')} label='My Orders' labelIcon={<BoxIcon size={16} />}/>
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }

            </div>
            {/* Mobile Menu */}
            <div className={`sm:hidden fixed inset-0 ${menuOpen ? 'w-full' : 'w-0'} overflow-hidden bg-white backdrop-blur shadow-xl rounded-lg z-200 text-sm transition-all`}>
                <div className='flex flex-col items-center justify-center h-full gap-6 p-4 text-xl font-semibold'>
                    <Link to='/marketplace' onClick={() => setMenuOpen(false)}> Marketplace </Link>
                    <Link onClick={openSignIn}> Messages </Link>
                    <Link onClick={openSignIn}> My Listings </Link>
                    <button onClick={() => openSignIn()} className='px-8 py-2 text-white transition bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-600'>Login</button>
                    <XIcon onClick={() => setMenuOpen(false)} className='absolute text-gray-500 cursor-pointer size-8 right-6 top-6 hover:text-gray-700' />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
