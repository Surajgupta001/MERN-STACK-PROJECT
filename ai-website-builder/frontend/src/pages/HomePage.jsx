import React from 'react'
import { useAppContext } from '../context/AppContext'
import PromptInput from '../components/PromptInput';

function HomePage() {

    const { user } = useAppContext();

    return (
        <div className="h-screen overflow-y-scroll font-sans text-white bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">
            {/* Nav */}
            <nav className='sticky top-0 z-10 flex items-center justify-between px-6 py-4'>
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Logo" className='size-6' />
                    <span className='text-xl font-semibold tracking-tight'>builderAI</span>
                </div>
                <div className='flex items-center gap-4 text-sm font-medium text-zinc-300'>
                    <span>{user?.name}</span>
                    <button className='py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 text-xs rounded-md cursor-pointer bg-transparent'>Sign Out</button>
                </div>
            </nav>
            {/* Hero */}
            <div className='flex flex-col items-center justify-center flex-1 px-6 pb-20 mt-8 xl:mt-20'>
                {/* Promo Badge */}
                <div className='flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[13px] text-white/90'>
                    <span className='px-3 py-1 text-[11px] bg-red-700 rounded-full font-medium tracking-wider'>PROMO</span>
                    <span>Create your first project for free</span>
                </div>
                {/* Title */}
                <h1 className='max-w-2xl mt-4 text-4xl font-medium text-center text-white ml:text-6xl'>Build your presence on the web</h1>
                {/* Subtitle */}
                <p className='max-w-xl mt-4 text-sm leading-relaxed text-center md:text-base text-white/65'>Describe what you need, preview instantly, and customize your site in real-time. React with clean JSX, verified layouts, and instant code exports.</p>
                {/* Prompt input with glassmorphic variant */}
                <div className='w-full mt-6'>
                    <PromptInput
                        onSubmit={() => { }}
                        loading={false}
                        placeholder='Create a portfolio website...'
                        variant='glass'
                        autoFocus
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePage