import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

function Hero() {
    return (
        <div className='flex flex-col items-center justify-center w-full pt-20 text-center md:pt-36 px-7 md:px-0 space-y-7 bg-gradient-to-b from-cyan-100/70'>
            <h1 className='relative max-w-3xl mx-auto font-bold leading-tight text-gray-800 md:text-home-heading-large text-home-heading-small'>Empower your future with the courses designed to <span className='text-blue-600'>fit your choice.</span><img src={assets.sketch} alt="sketch" className='absolute right-0 hidden md:block -bottom-7' /></h1>
            <p className='hidden max-w-2xl mx-auto text-gray-500 md:block'>We bring together world-class instructors, interative content, and a supportive community to help ypu achive your personal and professional goals.</p>
            <p className='max-w-sm mx-auto text-gray-500 md:hidden'>We bring together world-class instructors, to help ypu achieve your personal and professional goals.</p>
            <SearchBar />
        </div>
    )
}

export default Hero
