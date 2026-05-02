import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { dummyProfileData } from '../assets/assets';
import { CalendarIcon, ChevronRightIcon, DollarSignIcon, FileTextIcon, LayoutGridIcon, LogOutIcon, MenuIcon, Settings, UserIcon, XIcon } from 'lucide-react';

function Sidebar() {

    const { pathname } = useLocation();
    const [userName, setUserName] = useState();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setUserName(dummyProfileData.firstName + " " + dummyProfileData.lastName);
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const role = '' || 'EMPLOYEE'; // Replace with actual role from auth context

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutGridIcon },
        role === 'ADMIN' ?
            { name: 'Employees', path: '/employees', icon: UserIcon } :
            { name: 'Attendance', path: '/attendance', icon: CalendarIcon },
        { name: 'Leave', path: '/leave', icon: FileTextIcon },
        { name: 'Payslips', path: '/payslips', icon: DollarSignIcon },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        window.location.href = '/login';
    }

    const sidebarContent = (
        <>
            {/* Brand Header */}
            <div className='px-5 pt-6 pb-5 border-b border-white/6'>
                <div className='flex items-center justify-center'>
                    <div className='flex items-center gap-3'>
                        <UserIcon className='text-white size-7' />
                        <div>
                            <p className='font-semibold text-[13px] text-white tracking-wide'>Employee MS</p>
                            <p className='text-[11px] text-slate-500 font-medium'>Management System</p>
                        </div>
                    </div>
                    {/* Close menu on mobile */}
                    <button onClick={() => setMobileOpen(false)} className='p-1 lg:hidden text-slate-400 hover:text-white'>
                        <XIcon size={20} />
                    </button>
                </div>
            </div>
            {/* User profile */}
            {userName && (
                <div className='p-3 mx-3 mt-4 mb-1 border rounded-lg border-white/4 bg-white/3'>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center justify-center rounded-lg w-9 h-9 bg-slate-800 ring-1 ring-white/10 shrink-0'>
                            <span className='text-xs font-semibold text-slate-400'>
                                {userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className='min-w-0'>
                            <p className='text-[13px] font-medium text-slate-200 truncate'>{userName}</p>
                            <p className='text-[11px] text-slate-500 truncate'>{role == 'ADMIN' ? 'Administrator' : 'Employee'}</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Section label */}
            <div className='px-5 pt-5 pb-2'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Navigation</p>
            </div>
            {/* Navigation List */}
            <div className='flex-1 px-3 space-y-0.5 overflow-y-auto'>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link key={item.name} to={item.path} className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${isActive ? 'bg-indigo-500/12 text-indigo-300' : 'text-slate-300 hover:text-white hover:bg-white/4'}`}>
                            {isActive && <div className='absolute left-0 -translate-y-1/2 top-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500' />}
                            <item.icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'}`} />
                            <span className='flex-1'>{item.name}</span>
                            {isActive && <ChevronRightIcon className='w-3 h-3 text-indigo-500/50' />}
                        </Link>
                    )
                })}
            </div>
            {/* Lagout */}
            <div className='p-3 border-t border-white/6'>
                <button onClick={handleLogout} className='flex items-center w-full gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150 cursor-pointer'>
                    <LogOutIcon className='w-[17px] h-[17px]' />
                    <span>Log out</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger menu */}
            <button onClick={() => setMobileOpen(true)} className='fixed z-50 p-2 text-white border rounded-lg shadow-lg lg:hidden top-4 left-4 bg-slate-900 border-white/10'>
                <MenuIcon size={20} />
            </button>
            {/* Mobile overlay */}
            {mobileOpen && <div onClick={() => setMobileOpen(false)} className='fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm' />}

            {/* Sidebar - desktop */}
            <aside className='hidden lg:flex flex-col h-full w-[260px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4'>
                {sidebarContent}
            </aside>

            {/* Sidebar - mobile */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </aside>
        </>
    )
}

export default Sidebar