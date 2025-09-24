import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

function Plan() {
    return (
        <div className='z-20 max-w-2xl mx-auto my-30'>
            <div className='text-center'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
                <p className='max-w-lg mx-auto text-gray-500'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
            </div>
            <div className='mt-14 max-sm:mx-8'>
                <PricingTable />
            </div>
        </div>
    )
}

export default Plan
