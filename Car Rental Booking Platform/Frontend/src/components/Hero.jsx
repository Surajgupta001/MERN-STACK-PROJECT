import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

function Hero() {

    const [pickupLocation, setPickupLocation] = useState('');
    
    const { pickupdate, setPickupDate, returndate, setReturnDate, navigate } = useAppContext();

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality here
        navigate(`/cars?location=${pickupLocation}&pickupDate=${pickupdate}&returnDate=${returndate}`);
    };

    return (
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='flex flex-col items-center justify-center h-screen text-center gap-14 bg-light'>
            <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-4xl font-semibold md:text-sxl'>Luxury cars on Rent</motion.h1>
            <motion.form 
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSearch} className='flex flex-col items-start justify-between w-full p-6 bg-white rounded-md shadow-[0px_8px_20px_rgba(0,0,0,0.1)] md:flex-row md:items-center md:rounded-md max-w-80 md:max-w-200'>
                <div className='flex flex-col items-start gap-10 md:items-center md:flex-row min-md:ml-8'>
                    <div className='flex flex-col items-start gap-2'>
                        <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                            <option value="">Pickup Location</option>
                            {cityList.map((city) =>
                                <option key={city} value={city}>{city}</option>
                            )}
                        </select>
                        <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation : 'Please select location'}</p>
                    </div>
                    <div className='flex flex-col items-start gap-2'>
                        <label htmlFor="pickup-date">Pick-up Date</label>
                        <input onChange={(e) => setPickupDate(e.target.value)} value={pickupdate} type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' />
                    </div>
                    <div className='flex flex-col items-start gap-2'>
                        <label htmlFor="return-date">Return Date</label>
                        <input onChange={(e) => setReturnDate(e.target.value)} value={returndate} type="date" id="return-date" min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' />
                    </div>
                </div>
                <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center justify-center gap-1 py-3 text-white rounded-md cursor-pointer px-9 max:sm-mt-4 bg-primary hover:bg-primary-dull'>
                    <img src={assets.search_icon} alt="search" className='brightness-300' />
                    Search
                </motion.button>
            </motion.form>
            <motion.img 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            src={assets.main_car} alt="car" className='max-h-74' />
        </motion.div>
    )
}

export default Hero
