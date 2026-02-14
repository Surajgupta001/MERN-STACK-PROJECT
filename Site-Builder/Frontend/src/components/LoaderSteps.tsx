import React, { useState, useEffect } from 'react'
import { CircleIcon, ScanLineIcon, SquareIcon, TriangleIcon } from 'lucide-react'

const steps = [
    { icon: ScanLineIcon, label: 'Analyzing your request...' },
    { icon: SquareIcon, label: 'Generating layout Structure...' },
    { icon: TriangleIcon, label: 'Assembling UI Components...' },
    { icon: CircleIcon, label: 'Finalizing your Website...' },
];

const STEP_DURATION = 45000;

function LoaderSteps() {

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % steps.length);
        }, STEP_DURATION);
        return () => clearInterval(interval);
    }, []);

    const Icon = steps[current].icon;

    return (
        <div className='relative flex flex-col items-center justify-center w-full h-full overflow-hidden text-white bg-gray-950'>
            <div className='absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl animate-pulse'></div>
            <div className='relative z-10 flex items-center justify-center w-32 h-32'>
                <div className='absolute inset-0 border border-indigo-400 rounded-full animate-ping opacity-30' />
                <div className='absolute inset-0 border border-indigo-400 rounded-full' />
                <Icon className='w-8 h-8 text-white opacity-80 animate-bounce' />
            </div>
            {/* Step label - fade using transition only (no invisible start) */}
            <p key={current} className='mt-8 text-lg font-light tracking-wide transition-all duration-700 ease-in-out opacity-100 text-white/90'>{steps[current].label}</p>
            <p className='mt-2 text-xs text-gray-400 transition-opacity duration-700 opacity-100'></p>
        </div>
    )
}

export default LoaderSteps
