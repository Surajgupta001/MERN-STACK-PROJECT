import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

function Navbar() {

    const { navigate, token } = useAppContext();

    return (
        <div className='flex items-center justify-between py-5 mx-8 xl:mx-32 sm:mx-20'>
            <img onClick={() => navigate('/')} className='w-32 cursor-pointer sm:w-44' src={assets.logo} alt="logo" />
            <button onClick={() => navigate('/admin')} className='flex items-center gap-2 text-sm text-white rounded-md cursor-pointer bg-primary px-10 py-2.5'>
                {token ? 'Dashboard' : 'Login'}
                <img className='w-3' src={assets.arrow} alt="arrow" />
            </button>
        </div>
    )
}

export default Navbar
