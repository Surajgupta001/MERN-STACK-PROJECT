import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

function WriteArticle() {

    const articleLength = [
        { length: 800, text: 'Short (500-800 words)' },
        { length: 1500, text: 'Medium (1000-1500 words)' },
        { length: 2500, text: 'Long (2000-2500 words)' },
    ];

    const [selectedLength, setSelectedLength] = useState(articleLength[0]);
    const [input, setInput] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();  
    };

    return (
        <div className='flex flex-wrap items-start h-full gap-4 p-6 overflow-y-scroll text-slate-700'>
            {/* Left Column */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#4a7aff]' />
                    <h1 className='text-xl font-semibold'>Articles Configuration</h1>
                </div>
                <p className='mt-6 text-sm font-medium'>Article Topic</p>
                <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='The Future of artificial intelligence is ...' className='w-full p-2 px-3 mt-2 text-sm border border-gray-300 rounded-md outline-none' required />
                <p className='mt-4 text-sm font-medium'>Article Length</p>
                <div className='flex flex-wrap gap-3 mt-3 sm:max-w-9/11'>
                    {articleLength.map((item, index) => (
                        <span onClick={() => setSelectedLength(item)} key={index} className={`px-4 py-1 text-xs border rounded-full cursor-pointer hover:bg-gray-100 ${selectedLength.text === item.text ? 'bg-b;ue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`}>{item.text}</span>
                    ))}
                </div>
                <br />
                <button className='flex items-center justify-center w-full gap-2 bg-gradient-to-r from-[#226bff] to-[#65adff] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                    <Edit className='w-5' />
                    Generate articles
                </button>
            </form>
            {/* Right Column */}
            <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
                <div className='flex items-center gap-3'>
                    <Edit className='w-5 h-5 text-[#4a7aff]'/>
                    <h1 className='text-xl font-semibold'>Generated articles</h1>
                </div>
                <div className='flex items-center justify-center flex-1'>
                    <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                        <Edit className='w-9 h-9' />
                        <p>Enter a topic and click "Generate articles" to get started.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WriteArticle
