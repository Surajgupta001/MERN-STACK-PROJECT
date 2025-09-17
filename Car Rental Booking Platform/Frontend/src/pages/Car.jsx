import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

function Car() {

    // Getting Search params from url
    const [searchParams] = useSearchParams();
    const pickupLocation = searchParams.get('pickupLocation');
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');

    const { cars, axios } = useAppContext();

    const [input, setInput] = useState('');

    const isSearchData = pickupLocation && pickupDate && returnDate;

    // If search data is present, filter the cars based on location
    const [filterCars, setFilterCars] = useState([]);

    const applyFilter = async () => {
        if (input === '') {
            setFilterCars(cars);
            return null;
        }

        const filtered = cars.slice().filter((car) => {
            return car.brand.toLowerCase().includes(input.toLowerCase()) ||
                car.model.toLowerCase().includes(input.toLowerCase()) ||
                car.fuel_type.toLowerCase().includes(input.toLowerCase()) ||
                car.transmission.toLowerCase().includes(input.toLowerCase()) ||
                car.category.toLowerCase().includes(input.toLowerCase()) ||
                car.location.toLowerCase().includes(input.toLowerCase()) ||
                car.seating_capacity.toString().toLowerCase().includes(input.toLowerCase());
        });
        setFilterCars(filtered);
    };

    const searchCarAvailability = async () => {
        const { data } = await axios.post('/api/bookings/check-availability', {
            location: pickupLocation,
            pickupDate,
            returnDate
        });

        if (data.success) {
            setFilterCars(data.availableCars);
            if (data.availableCars.length === 0) {
                toast.error('No cars available');
            }
            return null;
        }
    };

    useEffect(() => {
        isSearchData && searchCarAvailability();
    }, []);

    useEffect(() => {
        cars.length > 0 && !isSearchData && applyFilter();
    }, [input, cars])

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className='flex flex-col items-center py-20 bg-light max-md:px-24'>
                <Title title='Available Cars' subtitle='Browse our selection of cars available for rent' />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='flex items-center w-full h-12 px-4 mt-6 bg-white rounded-full shadow max-w-140'>
                    <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
                    <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by make, or features' className='w-full h-full text-gray-500 outline-none' />
                    <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className='px-6 mt-10 md:px-16 lg:px-24 xl:px-32'>
                <p>Showing {filterCars.length} Cars</p>
                <div className='grid grid-cols-1 gap-8 mx-auto mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:px-20 max-w-7xl'>
                    {filterCars.map((car, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            key={index}>
                            <CarCard car={car} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default Car
