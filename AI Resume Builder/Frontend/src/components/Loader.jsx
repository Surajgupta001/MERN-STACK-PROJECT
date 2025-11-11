import React from 'react'

function Loader() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='border-gray-400 rounded-full size-12 border-3 border-t-transparent animate-spin'></div>
        </div>
    )
}

export default Loader
