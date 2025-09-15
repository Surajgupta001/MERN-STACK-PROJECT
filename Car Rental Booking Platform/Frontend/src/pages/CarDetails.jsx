import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets';
import Loader from '../components/Loader';

function CarDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;

    const [car, setCar] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    useEffect(() => {
        setCar(dummyCarData.find((car) => car._id === id));
    }, [id]);

    return car ? (
        <div className='px-6 mt-16 md:px-16 lg:px-24 xl:px-32'>
            <button className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer' onClick={() => navigate(-1)}>
                <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
                Back to all cars
            </button>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12'>
                {/* Left: cars image & Details */}
                <div className='lg:col-span-2'>
                    <img src={car.image} alt="" className='object-cover w-full h-auto mb-6 shadow-md rounded-xl md:max-h-100' />
                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold'>{car.name} {car.model}</h1>
                            <p className='text-lg text-gray-500'>{car.category} • {car.year}</p>
                        </div>
                        <hr className='my-6 border-borderColor' />
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                            {[
                                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                                { icon: assets.fuel_icon, text: car.fuel_type },
                                { icon: assets.car_icon, text: car.transmission },
                                { icon: assets.location_icon, text: car.location }
                            ].map(({ icon, text }) => (
                                <div key={text} className='flex flex-col items-center p-4 rounded-lg bg-light'>
                                    <img src={icon} alt="" className='h-5 mb-2' />
                                    {text}
                                </div>
                            ))}
                        </div>
                        {/* Descriptions */}
                        <div>
                            <h1 className='mb-3 text-xl font-medium'>Description</h1>
                            <p className='text-gray-500'>{car.description}</p>
                        </div>
                        {/* Features */}
                        <div>
                            <h1 className='mb-3 text-xl font-medium'>Features</h1>
                            <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                                {
                                    ['360 Camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear view Mirror'].map((item) => (
                                        <li key={item} className='flex items-center text-gray-500'>
                                            <img src={assets.check_icon} alt="" className='h-5 mr-2' />
                                            {item}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Right: Booking Forms */}
                <form onSubmit={handleSubmit} className='sticky p-6 space-y-6 text-gray-500 shadow-lg h-max top-18 rounded-xl'>
                    <p className='flex items-center justify-between text-2xl font-semibold text-gray-800'>{currency}{car.pricePerDay}<span className='text-base font-normal text-gray-400'> per day</span></p>
                    <hr className='my-6 border-borderColor' />
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="pickup-date">Pickup Date</label>
                        <input type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='px-3 py-2 border rounded-lg border-borderColor' required />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="return-date">Return Date</label>
                        <input type="date" id="return-date" className='px-3 py-2 border rounded-lg border-borderColor' required />
                    </div>
                    <button className='w-full py-3 font-medium text-white transition-all cursor-pointer bg-primary hover:bg-primary-dull rounded-xl'>Book Now</button>
                    <p className='text-sm text-center'>No, credit card required to reserved</p>
                </form>
            </div>
        </div>
    ) : (
        <Loader />
    );
}

export default CarDetails
