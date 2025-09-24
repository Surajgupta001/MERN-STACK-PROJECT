import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

function BlogTitles() {

    const blogCategories = ['General', 'Technology', 'Bussiness', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'];

    const [selectedcategory, setSelectedCategory] = useState('General');
    const [input, setInput] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='flex flex-wrap items-start h-full gap-4 p-6 overflow-y-scroll text-slate-700'>
            {/* Left Column */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#8e37eb]' />
                    <h1 className='text-xl font-semibold'>AI Title Generator</h1>
                </div>
                <p className='mt-6 text-sm font-medium'>Keyword</p>
                <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='The Future of artificial intelligence is ...' className='w-full p-2 px-3 mt-2 text-sm border border-gray-300 rounded-md outline-none' required />
                <p className='mt-4 text-sm font-medium'>Category</p>
                <div className='flex flex-wrap gap-3 mt-3 sm:max-w-9/11'>
                    {blogCategories.map((item) => (
                        <span onClick={() => setSelectedCategory(item)} key={item} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedcategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`}>{item}</span>
                    ))}
                </div>
                <br />
                <button className='flex items-center justify-center w-full gap-2 bg-gradient-to-r from-[#c341f6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                    <Hash className='w-5' />
                    Generate title
                </button>
            </form>
            {/* Right Column */}
            <div className='flex flex-col w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg min-h-96'>
                <div className='flex items-center gap-3'>
                    <Hash className='w-5 h-5 text-[#8e37eb]' />
                    <h1 className='text-xl font-semibold'>Generated titles</h1>
                </div>
                <div className='flex items-center justify-center flex-1'>
                    <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                        <Hash className='w-9 h-9' />
                        <p>Enter a topic and click "Generate titles" to get started.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogTitles
