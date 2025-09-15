import React from 'react'

function Title({ title, subtitle, align}) {
    return (
        <div className={`flex flex-col justify-center items-center text-center ${align === 'left' && 'md:items-start'}`}>
            <h1 className='text-4xl font-semibold md:text-[40px]'>{title}</h1>
            <p className='mt-2 text-sm md:text-base text-gray-500/90 max-w-156'>{subtitle}</p>
        </div>
    )
}

export default Title
