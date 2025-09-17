import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

function CarDetails() {

    const { id } = useParams();
    const { cars, axios, pickupdate, setPickupDate, returndate, setReturnDate, navigate, currency } = useAppContext();

    const [car, setCar] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pickupdate || !returndate) {
            toast.error('Please select pickup and return dates.');
            return;
        }
        const pick = new Date(pickupdate);
        const ret = new Date(returndate);
        if (isNaN(pick) || isNaN(ret) || ret <= pick) {
            toast.error('Return date must be after pickup date.');
            return;
        }
        try {
            const { data } = await axios.post('/api/bookings/create', {
                car: id,
                pickupDate: pickupdate,
                returnDate: returndate
            });
            if (data.success) {
                toast.success(data.message);
                navigate('/my-bookings');
            } else {
                toast.error(data.message || 'Failed to create booking.');
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            toast.error(error?.response?.data?.message || "Failed to create booking.");
        }
    };

    useEffect(() => {
        setCar(cars.find((car) => car._id === id));
    }, [cars, id]);

    return car ? (
        <div className='px-6 mt-16 md:px-16 lg:px-24 xl:px-32'>
            <button className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer' onClick={() => navigate(-1)}>
                <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
                Back to all cars
            </button>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12'>
                {/* Left: cars image & Details */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='lg:col-span-2'>
                    <motion.img
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={car.image} alt="" className='object-cover w-full h-auto mb-6 shadow-md rounded-xl md:max-h-100' />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='space-y-6'>
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
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    key={text} className='flex flex-col items-center p-4 rounded-lg bg-light'>
                                    <img src={icon} alt="" className='h-5 mb-2' />
                                    {text}
                                </motion.div>
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
                    </motion.div>
                </motion.div>
                {/* Right: Booking Forms */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    onSubmit={handleSubmit} className='sticky p-6 space-y-6 text-gray-500 shadow-lg h-max top-18 rounded-xl'>
                    <p className='flex items-center justify-between text-2xl font-semibold text-gray-800'>{currency}{car.pricePerDay}<span className='text-base font-normal text-gray-400'> per day</span></p>
                    <hr className='my-6 border-borderColor' />
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="pickup-date">Pickup Date</label>
                        <input onChange={(e) => setPickupDate(e.target.value)} value={pickupdate} type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='px-3 py-2 border rounded-lg border-borderColor' required />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="return-date">Return Date</label>
                        <input onChange={(e) => setReturnDate(e.target.value)} value={returndate} type="date" id="return-date" min={pickupdate} className='px-3 py-2 border rounded-lg border-borderColor' required />
                    </div>
                    <button className='w-full py-3 font-medium text-white transition-all cursor-pointer bg-primary hover:bg-primary-dull rounded-xl'>Book Now</button>
                    <p className='text-sm text-center'>No, credit card required to reserved</p>
                </motion.form>
            </div>
        </div>
    ) : (
        <Loader />
    );
}

export default CarDetails
