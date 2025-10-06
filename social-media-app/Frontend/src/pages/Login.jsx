import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

function Login() {
    return (
        <div className='flex flex-col min-h-screen md:flex-row '>
            {/* Background Image */}
            <img src={assets.bgImage} alt="" className='absolute top-0 left-0 object-cover w-full h-full -z-1'/>
            {/* Left Side : Branding */}
            <div className='flex flex-col items-start justify-between flex-1 p-6 md:p-10 lg:pl-40'>
                <img src={assets.logo} alt="" className='h-12 object-container'/>
                <div>
                    <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
                        <img src={assets.group_users} alt="" className='h-8 md:h-10'/>
                        <div>
                            <div className='flex'>
                                {Array(5).fill(0).map((_, i) => (<Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500'/>))}
                            </div>
                            <p>Used by 12k+ developers</p>
                        </div>
                    </div>
                    <h1 className='text-3xl font-bold text-transparent md:text-6xl md:pb-2 bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text'>More than just friends truly connected</h1>
                    <p className='text-xl text-indigo-900 md:text-3xl max-w-72 md:max-w-md'>connect with global communities on pingup</p>
                </div>
                <span className='md:h-10'></span>
            </div>
            {/* Right Side : Login Form */}
            <div className='flex items-center justify-center flex-1 p-6 sm:p-10'>
                <SignIn />
            </div>
        </div>
    )
}

export default Login
