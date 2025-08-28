import React from 'react'

function Loader() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-16 h-16 border-4 border-gray-700 rounded-full border-t-white animate-spin'></div>
        </div>
    )
}

export default Loader
