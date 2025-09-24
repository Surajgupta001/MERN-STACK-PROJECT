import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';

function AiTools() {

    const navigate = useNavigate();
    const { user } = useUser();

    return (
        <div className='px-4 my-24 sm:px-20 xl:px-32'>
            <div className='text-center'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI Tools</h2>
                <p className='max-w-lg mx-auto text-gray-500'>Everythings you need to creating, enhance, and optimisze your content with cutting-edge AI technology.</p>
            </div>
            <div className='flex flex-wrap justify-center mt-10'>
                {AiToolsData.map((tool, index) => (
                    <div onClick={() => user && navigate(tool.path)} key={index} className='max-w-xs p-8 m-4 rounded-lg bg-[#fdfdfd] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
                        <div className='w-12 h-12 p-3 rounded-xl' style={{ background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})` }}>
                            <tool.Icon className='w-full h-full text-white' />
                        </div>
                        <h3 className='mt-6 mb-6 text-lg font-semibold'>{tool.title}</h3>
                        <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AiTools
