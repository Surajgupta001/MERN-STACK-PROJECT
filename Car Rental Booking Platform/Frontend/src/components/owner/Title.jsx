import React from 'react'

function Title({ title, subtitle }) {
    return (
        <>
            <h1 className='text-3xl font-medium'>{title}</h1>
            <p className='mt-2 text-sm md:text-base text-gray-500/90'>{subtitle}</p>
        </>
    )
}

export default Title
