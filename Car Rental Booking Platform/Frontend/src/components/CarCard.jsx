import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

function CarCard({ car }) {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/car-details/${car._id}`)} className='overflow-hidden transition-all duration-500 shadow-lg cursor-pointer group rounded-xl hover:-translate-y-1'>
            <div className='relative h-48 overflow-auto'>
                <img src={car.image} alt='Car Image' className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105' />
                {car.isAvailable && <p className='absolute text-xs text-white top-4 left-4 bg-primary/90 px-2.5 py-1 rounded-full'>Available Now</p>}
                <div className='absolute px-3 py-2 text-white rounded-lg bottom-4 right-4 bg-black/80 backdrop-blur-sm'>
                    <span className='font-semibold'>{currency}{car.pricePerDay}</span>
                    <span className='text-white/80 font-sm'> / day</span>
                </div>
            </div>
            <div className='p-4 sm:p-5'>
                <div className='flex items-start justify-between mb-2'>
                    <div>
                        <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                        <p className='text-sm text-muted-foreground'>{car.category} • {car.year}</p>
                    </div>
                </div>
                <div className='grid grid-cols-2 mt-4 text-gray-600 gap-y-2'>
                    <div className='flex items-center text-muted-foreground'>
                        <img src={assets.users_icon} alt="" className='h-4 mr-2' />
                        <span>{car.seating_capacity} Seats</span>
                    </div>
                    <div className='flex items-center text-muted-foreground'>
                        <img src={assets.fuel_icon} alt="" className='h-4 mr-2' />
                        <span>{car.fuel_type}</span>
                    </div>
                    <div className='flex items-center text-muted-foreground'>
                        <img src={assets.car_icon} alt="" className='h-4 mr-2' />
                        <span>{car.transmission}</span>
                    </div>
                    <div className='flex items-center text-muted-foreground'>
                        <img src={assets.location_icon} alt="" className='h-4 mr-2' />
                        <span>{car.location}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarCard
