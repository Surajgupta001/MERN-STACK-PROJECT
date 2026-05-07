import React from 'react'

function LoginLeftSide() {
    return (
        <div className='relative hidden w-1/2 overflow-hidden border-r md:flex bg-indigo-950'>
            <div className='absolute rounded-full -top-30 -left-30 w-72 h-72 bg-indigo-500/20 blur-3xl'></div>
            <div className='relative z-10 flex flex-col items-start justify-center w-full h-full p-12 lg:p-20'>
                <h1 className='mb-6 text-4xl font-medium leading-tight text-white lg:text-5xl'>Employee <br /> Management System</h1>
                <p className='text-lg leading-relaxed text-slate-400'>Streamline Your workforce operations, track attendance, manage payroll, and empower your team your team securely.</p>
            </div>
        </div>
    )
}

export default LoginLeftSide