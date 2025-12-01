import React from 'react'

function Loading() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-16 border-4 border-t-4 border-gray-300 rounded-full sm:w-20 aspect-square border-t-blue animate-spin'></div>
    </div>
  )
}

export default Loading
