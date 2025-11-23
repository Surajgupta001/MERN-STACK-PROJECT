import React from 'react'
import { assets } from '../../assets/assets'

function callToAction() {
    return (
        <div className='flex flex-col items-center gap-4 px-8 pt-10 pb-24 md:px-0'>
            <h1 className='text-xl font-semibold text-center text-gray-800 md:text-4xl'>Learn anything, anytime, anywhere</h1>
            <p className='text-center text-gray-500 sm:text-sm'>Join millions of learners from around the world and start your learning journey today.</p>
            <div className='flex items-center justify-center gap-6 mt-4 font-medium'>
                <button className='px-10 py-3 text-white bg-blue-600 rounded-md'>Get Started</button>
                <button className='flex items-center gap-2'>Learn More<img src={assets.arrow_icon} alt="arrow_icon" /></button>
            </div>
        </div>
    )
}

export default callToAction
