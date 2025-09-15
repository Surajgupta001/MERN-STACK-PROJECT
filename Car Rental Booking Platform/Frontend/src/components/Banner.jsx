import React from 'react'
import { assets } from '../assets/assets';

function Banner() {
    return (
        <div className='flex flex-col items-center justify-between px-8 pt-10 md:flex-row md:items-start min-md:pl-14 bg-gradient-to-r from-[#0558fe] to-[#a9cfff] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>
            <div className='text-white'>
                <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>
                <p className='mt-2'>Monetize your vehicle effortlessly by listing it on our CarRental.</p>
                <p className='max-w-130'>We take care of insurance, driver verification and secure payments - so can you earn passive income, stress-free. </p>
                <button className='px-6 py-2 mt-4 text-sm transition-all bg-white rounded-lg cursor-pointer hover:bg-slate-100 text-primary'>List your car</button>
            </div>
            <img src={assets.banner_car_image} alt="" className='mt-10 max-h-45' />
        </div>
    )
}

export default Banner;
