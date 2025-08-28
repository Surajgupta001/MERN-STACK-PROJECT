import React from 'react'

function Newsletter() {
    return (
        <div className='flex flex-col items-center justify-center my-32 space-y-2 text-center'>
            <h1 className='text-2xl font-semibold md:text-4xl'>Never Miss a Blog</h1>
            <p className='pb-8 md:text-lg text-gray-500/70'>Subscribe to get the latest blog, new tech, and exclusive news.</p>
            <form className='flex justify-between w-full h-12 max-w-2xl item-center md:h-13'>
                <input className='w-full h-full px-3 text-gray-500 border border-r-0 border-gray-300 rounded-md rounded-r-none outline-none' type="text" placeholder='Enter your email' required />
                <button className='h-full px-8 text-white transition-all rounded-md rounded-l-none cursor-pointer md:px-12 bg-primary/80 hover:bg-primary' type='submit'>Subscribe</button>
            </form>
        </div>
    )
}

export default Newsletter
