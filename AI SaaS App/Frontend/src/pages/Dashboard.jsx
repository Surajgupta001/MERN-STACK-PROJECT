import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import CreationItems from '../components/CreationItems';

function Dashboard() {

    const [creation, setCreation] = useState([]);

    const getDashboardData = async () => {
        setCreation(dummyCreationData);
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    return (
        <div className='w-full p-6 overflow-y-scroll'>
            <div className='flex flex-wrap justify-start gap-4'>
                {/* Total Creations Card */}
                <div className='flex items-center justify-between p-4 px-6 bg-white border border-gray-200 w-72 rounded-xl'>
                    <div className='text-slate-600'>
                        <p className='text-sm'>Total Creations</p>
                        <h2 className='text-xl font-semibold'>{creation.length}</h2>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] text-white flex justify-center items-center'>
                        <Sparkles className='w-5 text-white' />
                    </div>
                </div>
                {/* Active Plan Card */}
                <div className='flex items-center justify-between p-4 px-6 bg-white border border-gray-200 w-72 rounded-xl'>
                    <div className='text-slate-600'>
                        <p className='text-sm'>Active Plan</p>
                        <h2 className='text-xl font-semibold'>
                            <Protect plan="premium" fallback="Free">Premium Plan</Protect>
                        </h2>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] text-white flex justify-center items-center'>
                        <Gem className='w-5 text-white' />
                    </div>
                </div>
            </div>
            <div className='space-y-3'>
                <p className='mt-6 mb-4'>Recent Creations</p>
                {creation.map((item) => <CreationItems key={item.id} item={item} />)}
            </div>
        </div>
    )
}

export default Dashboard
