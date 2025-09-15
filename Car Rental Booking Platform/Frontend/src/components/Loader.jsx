import React from 'react'

function Loader() {
    return (
        <div className='flex items-center justify-center h-[80vh]'>
            <div className='border-4 border-gray-300 rounded-full w-14 animate-spin h-14 border-t-primary'></div>
        </div>
    )
}

export default Loader
