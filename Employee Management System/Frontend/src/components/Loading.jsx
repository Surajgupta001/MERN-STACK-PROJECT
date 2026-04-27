import React from 'react'

function Loading() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='border-2 border-indigo-600 rounded-full animate-spin size-8 border-t-transparent' />
        </div>
    )
}

export default Loading