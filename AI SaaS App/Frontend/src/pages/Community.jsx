import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets';
import { Heart } from 'lucide-react';

function Community() {

    const [creations, setCreations] = useState([]);
    const { user } = useUser();

    const fetchCreations = async () => {
        setCreations(dummyPublishedCreationData);
    };

    useEffect(() => {
        if (user) {
            fetchCreations();
        }
    }, [user]);

    return (
        <div className='flex flex-col flex-1 h-full gap-4 p-6'>
            Creations
            <div className='w-full h-full overflow-scroll bg-white rounded-xl'>
                {creations.map((creation, index) => (
                    <div key={index} className='relative inline-block w-full pt-3 pl-3 group sm:mac-w-1/2 lg:max-w-1/3'>
                        <img src={creation.content} alt="" className='object-cover w-full h-full rounded-lg' />
                        <div className='absolute top-0 bottom-0 right-0 flex items-end justify-end gap-2 p-3 text-white rounded-lg left-3 group-hover:justify-between group-hover:bg-gradient-to-b from-transparent to-black/80'>
                            <p className='hidden text-sm group-hover:block'>{creation.prompt}</p>
                            <div className='flex items-center gap-1'>
                                <p>{creation.likes.length}</p>
                                <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'text-red-500 fill-red-600' : 'text-white'}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Community
