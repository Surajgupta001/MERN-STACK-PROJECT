import React from 'react'
import { assets, footer_data } from '../assets/assets'

function Footer() {
    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>
            <div className='flex flex-col items-start justify-between gap-10 py-10 text-gray-500 border-b md:flex-row border-gray-500/30'>
                <div>
                    <img src={assets.logo} alt="logo" />
                    <p className='max-w-[410px] mt-6'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?</p>
                </div>
                <div className='flex flex-wrap justify-between w-full md:w-[45%] gap-5'>
                    {footer_data.map((section, index) => (
                        <div key={index}>
                            <h3 className='mb-2 text-base font-semibold text-gray-900 md:mb-5'>{section.title}</h3>
                            <ul className='space-y-1 text-sm'>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                       <a href="#" className='transition hover:underline'>{link}</a> 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className='py-4 text-sm text-center text-gray-500/80 md:text-base'>Copyright 2025 © QuickBlog All Right Reserved.</p>
        </div>
    )
}

export default Footer
