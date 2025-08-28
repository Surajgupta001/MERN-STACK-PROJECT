import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets';
import StarRating from '../components/StarRating';

function RoomDetails() {

    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        const room = roomsDummyData.find(room => room._id === id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    }, [id])

    return room && (
        <div className='px-4 py-28 md:py-35 md:px-16 lg:px-24 xl:px-32'>
            {/* Room Details */}
            <div className='flex flex-col items-start gap-2 md:flex-row md:items-center'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}<span className='text-sm font-inter'>({room.roomType})</span></h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>
            {/* Room rating */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ Reviews</p>
            </div>
            {/* Room Address */}
            <div className='flex items-center gap-1 mt-2 text-gray-500'>
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
            </div>
            {/* Room Images */}
            <div className='flex flex-col gap-6 mt-6 lg:flex-row'>
                <div className='w-full lg:w-1/2'>
                    <img src={mainImage} alt="Room Image" className='object-cover w-full shadow-lg rounded-xl' />
                </div>
                <div className='grid w-full grid-cols-2 gap-4 lg:w-1/2'>
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <img onClick={() => setMainImage(image)} key={index} src={image} alt={'Room Image'} className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`} />
                    ))}
                </div>
            </div>
            {/* Room Highlights */}
            <div className='flex flex-col mt-10 md:flex-row md:justify-between'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                    <div className='flex flex-wrap items-center gap-4 mt-3 mb-6'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Room Price */}
                <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
            </div>
            {/* CheckIn CheckOut Form */}
            <form className='flex flex-col items-start justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] md:flex-row md:items-center p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap items-start gap-4 text-gray-500 md:flex-row md:items-center md:gap-10'>
                    {/* Check-In */}
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                        <input type="text" id='checkInDate' placeholder='Check-in' className='w-full px-3 py-2 mt-1.5 border border-gray-300 rounded outline-none' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    {/* Check-Out */}
                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                        <input type="date" id='checkOutDate' className='w-full px-3 py-2 mt-1.5 border border-gray-300 rounded outline-none' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    {/* Guests */}
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input type="number" id='guests' placeholder='0' className='border border-gray-300 rounded max-w-20 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                </div>
                <button type='submit' className='py-3 text-base text-white transition-all rounded-md cursor-pointer bg-primary hover:bg-primary-dull active:scale-95 max-md:w-full max-md:mt-6 md:px-25 md:py-4'>Check Availability</button>
            </form>
            {/* Common specifications */}
            <div className='space-y-4 mt-25'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='max-w-3xl py-10 text-gray-500 border-gray-300 border-y my-15'>
                <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
            </div>
            {/* Hosted by */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    <img src={room.hotel.owner.image} alt="Host" className='rounded-full h-14 w-14 md:h-18 md:w-18' />
                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>200+ Reviews</p>
                        </div>
                    </div>
                </div>
                <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>
            </div>
        </div>
    )
}

export default RoomDetails
