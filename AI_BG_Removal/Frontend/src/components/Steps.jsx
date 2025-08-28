import React from 'react'
import { assets } from '../assets/assets'

function Steps() {
    return (
        <div className='py-20 mx-4 lg:mx-44 xl:py-40'>
            <h1 className='mt-4 text-2xl font-semibold text-center text-transparent md:text-3xl lg:text-4xl bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text'>Steps to remove background <br /> image in seconds.</h1>
            <div className='flex flex-wrap items-start justify-center gap-4 mt-16 xl:mt-24'>
                <div className='flex items-start gap-4 pb-10 transition-all duration-500 bg-white border rounded drop-shadow-md p-7 hover:scale-105'>
                    <img className='max-w-9' src={assets.upload_icon} alt="" />
                    <div>
                        <p className='text-xl font-medium'>Upload image</p>
                        <p className='mt-1 text-sm text-neutral-500'>This is a demo text, will replace it later. <br /> This is a demo text.</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 pb-10 transition-all duration-500 bg-white border rounded drop-shadow-md p-7 hover:scale-105'>
                    <img className='max-w-9' src={assets.remove_bg_icon} alt="" />
                    <div>
                        <p className='text-xl font-medium'>Remove background</p>
                        <p className='mt-1 text-sm text-neutral-500'>This is a demo text, will replace it later. <br /> This is a demo text.</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 pb-10 transition-all duration-500 bg-white border rounded drop-shadow-md p-7 hover:scale-105'>
                    <img className='max-w-9' src={assets.download_icon} alt="" />
                    <div>
                        <p className='text-xl font-medium'>Download image</p>
                        <p className='mt-1 text-sm text-neutral-500'>This is a demo text, will replace it later. <br /> This is a demo text.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Steps
