import React from 'react'

function CallToAction() {
    return (
        <div id='cta' className='w-full max-w-5xl px-10 mx-auto border-dashed border-y border-slate-200 sm:px-16 mt-28'>
            <div className="flex flex-col items-center justify-between w-full gap-8 px-3 py-16 -mt-10 -mb-10 text-center border-dashed md:flex-row md:text-left md:px-10 border-x border-slate-200 sm:py-20">
                <p className="max-w-md text-xl font-medium text-slate-800">Build a Professional Resume That Helps You Stand Out and Get Hired</p>
                    <a href="https://prebuiltui.com" className="flex items-center gap-2 px-8 py-3 text-white transition bg-green-600 rounded-full hover:bg-green-700">
                    <span>Get Started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    )
}

export default CallToAction
