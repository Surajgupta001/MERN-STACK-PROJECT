import React from 'react'
import Title from './Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'

function FeaturedSection() {

    const navigate = useNavigate();
    
    return (
        <div className='flex flex-col items-center px-6 py-24 md:px-16 lg:px-24 xl:px-32'>
            <div>
                <Title title='Featured Vehicles' subtitle='Explore our selection of premium vehicles available for your next adventure' />
            </div>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-18'>
                {dummyCarData.slice(0, 6).map((car) => (
                    <div key={car._id}>
                        <CarCard car={car} />
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/cars')} className='flex items-center justify-center gap-2 px-6 py-2 border rounded-md cursor-pointer mt-18 border-borderColor hover:bg-gray-50'>
                Explore all Vehicles
                <img src={assets.arrow_icon} alt="" />
            </button>
        </div>
    )
}

export default FeaturedSection
