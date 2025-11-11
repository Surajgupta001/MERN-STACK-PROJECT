import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {

    const user = {
        name: "John Doe",
    }
    const navigate = useNavigate();

    const logoutUser = () => {
        navigate('/');
    }
    
    return (
        <div className='bg-white shadow'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
                <Link to='/'>
                <img src='/logo.svg' alt="logo" className='w-auto h-11'/>
                </Link>
                <div className='flex items-center gap-4'>
                    <p className='text-sm'>Hi, {user?.name}</p>
                    <button onClick={logoutUser} className='bg-white border border-gray-300 hover:bg-slate-50 px-4 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
