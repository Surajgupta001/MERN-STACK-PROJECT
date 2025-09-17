import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function MyBookings() {

    const { axios, user, currency } = useAppContext();

    const [bookings, setBookings] = useState([]);
    
    const fetchMyBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user');
            if(data.success){
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error(error.message || 'Failed to fetch bookings.');
        }
    };

    useEffect(() => {
        user && fetchMyBookings();
    }, [user]);

    return (
        <div className='mt-16 text-sm x-6 md:px-16 lg:px-24 xl:px-32 2xl:px-38 max-w-7xl'>
            <Title title='My Bookings' subtitle='Manage your car rental bookings' align='left' />
            <div>
                {bookings.map((booking, index) => (
                    <div key={booking._id} className='grid grid-cols-1 gap-6 p-6 mt-5 border rounded-lg md:grid-cols-4 border-borderColor first:mt-12'>
                        {/* Car Image + info */}
                        <div className='md:col-span-1'>
                            <div className='mb-3 overflow-hidden rounded-md'>
                                <img src={booking.car.image} alt="" className='object-cover w-full h-auto aspect-video' />
                            </div>
                            <p className='mt-2 text-lg font-medium'>{booking.car.brand} {booking.car.model}</p>
                            <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
                        </div>
                        {/* Booking Info */}
                        <div className='md:col-span-2'>
                            <div className='flex items-center gap-2'>
                                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
                                <p className={`px-3 py-1 text-xs rounded-full ${booking.status.toLowerCase() === 'confirmed' ? 'text-green-600 bg-green-400/15' : 'text-red-600 bg-red-400/15'}`}>{booking.status}</p>
                            </div>
                            <div className='flex items-start gap-2 mt-3'>
                                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                                <div>
                                    <p className='text-gray-500'>Rental Period</p>
                                    <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-2 mt-3'>
                                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                                <div>
                                    <p className='text-gray-500'>Pick-up Location</p>
                                    <p>{booking.car.location}</p>
                                </div>
                            </div>
                        </div>
                        {/* Price */}
                        <div className='flex flex-col justify-between gap-6 md:col-span-1'>
                            <div className='text-sm text-right text-gray-500'>
                                <p>Total Price</p>
                                <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
                                <p>Booked on {booking.createdAt.split('T')[0]}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings
