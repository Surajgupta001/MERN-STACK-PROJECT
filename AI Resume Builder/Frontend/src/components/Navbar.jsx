import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice';

function Navbar() {

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    
    const logoutUser = () => {
        navigate('/');
        dispatch(logout());
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
