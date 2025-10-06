import React from 'react'

function Loading({height = '100vh'}) {
    return (
        <div style={{height}} className='flex items-center justify-center h-screen'>
            <div className='w-10 h-10 border-purple-500 rounded-full border-3 border-t-transparent animate-spin'>
                <div className='w-full h-full border-purple-500 rounded-full border-3 border-t-transparent animate-spin'></div>
            </div>
        </div>
    )
}

export default Loading
