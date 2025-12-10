import { PricingTable } from '@clerk/clerk-react'
import React from 'react'

function Plans() {
    return (
        <div className='z-20 max-w-2xl mx-auto my-30 max-md:px-4'>
            <div className='text-center'>
                <h2 className='text-4xl font-semibold text-gray-700'>Choose Your Plan</h2>
                <p className='max-w-md mx-auto text-sm text-gray-500'>Start for free and scale up is as you grow. Find the perfect plan for your content creation needs.</p>
            </div>
            <div className='mt-14'>
                {/* Plans will go here */}
                <PricingTable />
            </div>
        </div>
    )
}

export default Plans
