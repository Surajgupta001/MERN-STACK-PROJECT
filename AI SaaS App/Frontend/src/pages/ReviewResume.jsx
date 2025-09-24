import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

function ReviewResume() {

    const [input, setInput] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='flex flex-wrap items-start h-full gap-4 p-6 overflow-y-scroll text-slate-700'>
            {/* Left Column */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#00da83]' />
                    <h1 className='text-xl font-semibold'>Resume Review</h1>
                </div>
                <p className='mt-6 text-sm font-medium'>Upload Resume</p>
                <input onChange={(e) => setInput(e.target.files[0])} accept='application/pdf' type='file' placeholder='The Future of artificial intelligence is ...' className='w-full p-2 px-3 mt-2 text-sm text-gray-600 border border-gray-300 rounded-md outline-none' required />
                <p className='mt-1 text-xs font-light text-gray-500'>Support PDF and other document formats</p>
                <button className='flex items-center justify-center w-full gap-2 bg-gradient-to-r from-[#00da83] to-[#009bb3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                    <FileText className='w-5' />
                    Review Resume
                </button>
            </form>
            {/* Right Column */}
            <div className='flex flex-col w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg min-h-96 max-h-[600px]'>
                <div className='flex items-center gap-3'>
                    <FileText className='w-5 h-5 text-[#00da83]' />
                    <h1 className='text-xl font-semibold'>Analysis Results</h1>
                </div>
                <div className='flex items-center justify-center flex-1'>
                    <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                        <FileText className='w-9 h-9' />
                        <p>Upload a resume and click "Review Resume" to get started.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewResume
