import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

function Layout() {


    const { axios, navigate, setToken } = useAppContext();

    const logout = () => {
        localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = null;
        setToken(null);
        navigate('/');
    };
    
    return (
        <>
            <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
                <img onClick={() => navigate('/')} src={assets.logo} alt="" className='w-32 cursor-pointer sm:w-40' />
                <button onClick={logout} className='px-8 py-2 text-sm text-white rounded-md cursor-pointer bg-primary'>Logout</button>
            </div>
            <div className='flex h-[calc(100vh-70px)]'>
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default Layout
