import React from 'react'
import { platformIcons } from '../assets/assets';
import { BadgeCheck, LineChart, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ListingCard({listing}) {

    const currency = import.meta.env.VITE_CURRENCY || '$';

    const navigate = useNavigate();
    
    return (
        <div className='relative overflow-hidden transition bg-white border border-gray-100 shadow rounded-2xl-sm hover:shadow-md'>
            {/* Featured Banner */}
            {listing.featured && (
                <>
                <p className='py-1' />
                <div className='absolute top-0 left-0 w-full py-1 text-xs font-semibold tracking-wide text-center text-white uppercase bg-linear-to-r from-pink-500 to-purple-500'>Featured</div>
                </>
            )}
            <div className='p-5 pt-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-3'>
                   {platformIcons[listing.platform]}
                   <div className='flex flex-col'>
                    <h2>{listing.title}</h2>
                    <p>@{listing.username} - <span className='capitalize'>{listing.platform}</span></p>
                   </div>
                   {listing.verified && <BadgeCheck className='w-5 h-5 ml-auto text-green-500' />}
                </div>
                {/* Stats */}
                <div className='flex flex-wrap items-center justify-between max-w-lg gap-3 my-5'>
                    <div className='flex items-center text-sm text-gray-600'>
                        <User className='mr-1 text-gray-400 size-6' />
                        <span className='text-lg font-medium text-slate-800 mr-1.5'>{listing.followers_count.toLocaleString()}</span> followers
                    </div>
                    {listing.engagement_rate && (
                        <div className='flex items-center text-sm text-gray-600'>
                            <LineChart className='mr-1 text-gray-400 size-6' />
                            <span className='text-lg font-medium text-slate-800 mr-1.5'>{listing.engagement_rate}</span>% engagement
                        </div>
                    )}
                </div>
                {/* Tags & Locations */}
                <div className='flex items-center gap-3 mb-3'>
                    <span className='px-3 py-1 text-xs font-medium text-pink-600 capitalize bg-pink-100 rounded-full'>{listing.niche}</span>
                    {listing.location && (
                        <div className='flex items-center text-sm text-gray-500'>
                            <MapPin className='mr-1 text-gray-400 size-6' />
                            <span>{listing.location}</span>
                        </div>
                    )}
                </div>
                {/* Descriptions */}
                <p className='mb-4 text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                <hr className='my-5 border-gray-200' />
                {/* Footer */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-baseline'>
                        <span className='text-2xl font-medium text-slate-800'>
                            {currency}
                            {listing.price.toLocaleString()}
                        </span>
                    </div>
                    <button onClick={() => {navigate(`/listing/${listing.id}`); scrollTo(0, 0);}} className='py-3 text-sm text-white transition bg-indigo-600 rounded-lg px-7 hover:bg-indigo-700'>More Details</button>
                </div>
            </div>
        </div>
    )
}

export default ListingCard
