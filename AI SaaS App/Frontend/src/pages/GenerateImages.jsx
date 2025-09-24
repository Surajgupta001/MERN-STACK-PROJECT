import { Sparkles, Image } from 'lucide-react';
import React, { useState } from 'react'

function GenerateImages() {

    const ImageStyle = ['Realistic', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', 'Realistic style', '3D Style', 'Portrait Style'];

    const [selectedStyle, setSelectedStyle] = useState('Realistic');
    const [input, setInput] = useState('');
    const [publish, setPublish] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='flex flex-wrap items-start h-full gap-4 p-6 overflow-y-scroll text-slate-700'>
            {/* Left Column */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#00ad25]' />
                    <h1 className='text-xl font-semibold'>AI Image Generator</h1>
                </div>
                <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
                <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={4} placeholder='Describe what you want to see in the image...' className='w-full p-2 px-3 mt-2 text-sm border border-gray-300 rounded-md outline-none' required />
                <p className='mt-4 text-sm font-medium'>Style</p>
                <div className='flex flex-wrap gap-3 mt-3 sm:max-w-9/11'>
                    {ImageStyle.map((item) => (
                        <span onClick={() => setSelectedStyle(item)} key={item} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`}>{item}</span>
                    ))}
                </div>
                <div className='flex items-center gap-2 my-6'>
                    <label className='relative cursor-pointer'>
                        <input type='checkbox' onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer' />
                        <div className='h-5 transition rounded-full w-9 bg-slate-300 peer-checked:bg-green-500'></div>
                        <span className='absolute w-3 h-3 transition bg-white rounded-full left-1 top-1 peer-checked:translate-x-4'></span>
                    </label>
                    <p className='text-sm'>Make this image Public</p>
                </div>
                <button className='flex items-center justify-center w-full gap-2 bg-gradient-to-r from-[#00ad25] to-[#04ff50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                    <Image className='w-5' />
                    Generate Image
                </button>
            </form>
            {/* Right Column */}
            <div className='flex flex-col w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg min-h-96'>
                <div className='flex items-center gap-3'>
                    <Image className='w-5 h-5 text-[#00ad25]' />
                    <h1 className='text-xl font-semibold'>Generated Images</h1>
                </div>
                <div className='flex items-center justify-center flex-1'>
                    <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                        <Image className='w-9 h-9' />
                        <p>Enter a topic and click "Generate Images" to get started.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GenerateImages
