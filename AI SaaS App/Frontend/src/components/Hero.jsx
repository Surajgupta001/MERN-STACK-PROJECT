import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';

function Hero() {

    const navigate = useNavigate();

    return (
        <div className='relative inline-flex flex-col justify-center w-full px-4 sm:px-20 xl:px-32 bg-[url("/gradientBackground.png")] bg-cover bg-no-repeat min-h-screen'>
            <div className='mb-6 text-center'>
                <h1 className='mx-auto text-3xl font-semibold sm:text-5xl md:text-6xl 2xl:text-7xl leading-[1.2]'>Create amazing content <br /> with <span className='text-primary'>AI tools</span></h1>
                <p className='max-w-xs m-auto mt-4 sm:max-w-lg 2xl:max-w-xl'>Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.</p>
            </div>
            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button onClick={() => navigate('/ai')} className='px-10 py-3 text-white transition rounded-lg cursor-pointer bg-primary hover:scale-102 active:scale-95'>Start creating now</button>
                <button className='px-10 py-3 transition bg-white border border-gray-300 rounded-lg cursor-pointer hover:scale-102 active:scale-95'>Watch demo</button>
            </div>
            <div className='flex items-center gap-4 mx-auto mt-8 text-gray-600'>
                <img src={assets.user_group} alt="" className='h-8' />
                Trusted by 10k+ people
            </div>
        </div>
    )
}

export default Hero
