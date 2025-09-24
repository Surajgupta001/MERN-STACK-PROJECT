import React, { useState } from 'react'
import Markdown from 'react-markdown'

function CreationItems({ item }) {

    const [expanded, setExpanded] = useState(false);

    return (
        <div onClick={() => setExpanded(!expanded)} className='max-w-5xl p-4 text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
            <div className='flex items-center justify-between gap-4'>
                <div>
                    <h2>{item.prompt}</h2>
                    <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button className='bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-1 rounded-full'>{item.type}</button>
            </div>
            {
                expanded && (
                    <div>
                        {item.type === 'image' ? (
                            <div>
                                <img src={item.content} alt="image" className='w-full max-w-md mt-3' />
                            </div>
                        ) : (
                            <div className='h-full mt-3 overflow-y-scroll text-sm text-slate-700'>
                                <div className='reset-tw'>
                                    <Markdown>{item.content}</Markdown>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default CreationItems
