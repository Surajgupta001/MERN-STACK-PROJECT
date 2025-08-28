import React from 'react'
import { assets, plans } from '../assets/assets'

function BuyCredit() {
    return (
        <div className='min-h-[80vh] text-center pt-14 mb-10'>
            <button className='px-10 py-2 mb-6 border border-gray-400 rounded-full'>Our Plans</button>
            <h1 className='mt-4 mb-6 text-2xl font-semibold text-center text-transparent md:text-3xl lg:text-4xl bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text sm:mb-10'>Choose the plan that's right for you</h1>
            <div className='flex flex-wrap justify-center gap-6 text-left'>
                {plans.map((item, index) => (
                    <div className='px-8 py-12 text-gray-700 transition-transform duration-500 bg-white border rounded-lg drop-shadow-sm hover:scale-105' key={index}>
                        <img width={40} src={assets.logo_icon} alt="" />
                        <p className='mt-3 font-semibold'>{item.id}</p>
                        <p className='text-sm'>{item.desc}</p>
                        <p className='mt-6'>
                            <span className='text-3xl font-medium'>${item.price}</span>/ {item.credits} credits
                        </p>
                        <button className='w-full mt-8 text-sm text-white bg-gray-800 rounded-md py-2.5 min-w-52'>Purchase</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BuyCredit
