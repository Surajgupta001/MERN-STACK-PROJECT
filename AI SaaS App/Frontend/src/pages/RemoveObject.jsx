import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

function RemoveObject() {
    const [input, setInput] = useState('');
    const [object, setObject] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='flex flex-wrap items-start h-full gap-4 p-6 overflow-y-scroll text-slate-700'>
            {/* Left Column */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#4a7aff]' />
                    <h1 className='text-xl font-semibold'>Object Removal</h1>
                </div>
                <p className='mt-6 text-sm font-medium'>Upload Image</p>
                <input onChange={(e) => setInput(e.target.files[0])} accept='image/*' type='file' placeholder='The Future of artificial intelligence is ...' className='w-full p-2 px-3 mt-2 text-sm text-gray-600 border border-gray-300 rounded-md outline-none' required />
                <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
                <textarea onChange={(e) => setObject(e.target.value)} value={object} rows={4} placeholder='e.g. watch or spoon, Only single object name' className='w-full p-2 px-3 mt-2 text-sm border border-gray-300 rounded-md outline-none' required />
                <button className='flex items-center justify-center w-full gap-2 bg-gradient-to-r from-[#417df6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                    <Scissors className='w-5' />
                    Remove Object
                </button>
            </form>
            {/* Right Column */}
            <div className='flex flex-col w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg min-h-96'>
                <div className='flex items-center gap-3'>
                    <Scissors className='w-5 h-5 text-[#4a7aff]' />
                    <h1 className='text-xl font-semibold'>Processed Image</h1>
                </div>
                <div className='flex items-center justify-center flex-1'>
                    <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                        <Scissors className='w-9 h-9' />
                        <p>Upload an image and click "Remove Object" to get started.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RemoveObject
