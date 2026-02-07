import React, { useState } from 'react'
import { appPlans } from '../assets/assets';
import Footer from '../components/Footer';

interface Plan {
    id: string;
    name: string;
    price: string;
    credits: number;
    description: string;
    features: string[];
};

function Pricing() {

    const [plans] = useState<Plan[]>(appPlans);

    const handlePurchase = async (planId: string) => {

    }

    return (
        <>
            <div className='z-20 w-full max-w-5xl mx-auto max-md:px-4 min-h-[80vh]'>
                <div className='mt-16 text-center'>
                    <h2 className='text-3xl font-medium text-gray-100'>Choose Your Plan</h2>
                    <p className='max-w-md mx-auto mt-2 text-sm text-gray-400'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
                </div>
                <div className='px-4 py-4 pt-14 '>
                    <div className='grid flex-wrap grid-cols-1 gap-4 md:grid-cols-3'>
                        {plans.map((plan, idx) => (
                            <div key={idx} className="w-full max-w-sm p-6 mx-auto text-white transition-all rounded-lg shadow-lg bg-black/20 ring ring-indigo-950 hover:ring-indigo-500 duration-400">
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <div className="my-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-300"> / {plan.credits} credits</span>
                                </div>

                                <p className="mb-6 text-gray-300">{plan.description}</p>

                                <ul className="space-y-1.5 mb-6 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-400">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePurchase(plan.id)} className="w-full px-4 py-2 text-sm transition-all bg-indigo-500 rounded-md hover:bg-indigo-600 active:scale-95">
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='max-w-md mx-auto mt-10 text-sm font-light text-center text-white/60'>
                    Project <span className='text-white'>Creation / Revision</span> consume <span className='text-white'>5 Credits</span>. You can purchase more credits to create more projects.
                </p>
            </div>
            <Footer />
        </>
    )
}

export default Pricing
