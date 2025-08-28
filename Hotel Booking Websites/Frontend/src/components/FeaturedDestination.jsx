import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

function FeaturedDestination() {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center px-6 py-20 md:px-16 lg:px-24 bg-slate-50'>
            <Title title="Featured Destinations" subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences" align="center" />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {roomsDummyData.slice(0, 8).map((room, index) => (
                    <HotelCard room={room} index={index} key={room._id} />
                ))}
            </div>
            <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='px-4 py-2 my-16 text-sm font-medium transition-all bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50'>View All Destinations</button>
        </div>
    )
}

export default FeaturedDestination
