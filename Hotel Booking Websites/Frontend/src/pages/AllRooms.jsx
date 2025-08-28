import React, { useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating';

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex items-center gap-3 mt-2 text-sm cursor-pointer'>
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
};

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex items-center gap-3 mt-2 text-sm cursor-pointer'>
            <input type="radio" name='sortOption' checked={selected} onChange={() => onChange(label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
};

function AllRooms() {

    const navigate = useNavigate();
    const [openFilters, setOpenFilters] = useState(false);

    const roomTypes = [
        'Single Bed',
        'Double Bed',
        'Luxury Room',
        'Family Suite'
    ];

    const priceRange = [
        '0 to 500',
        '500 to 1000',
        '1000 to 2000',
        '2000 to 3000',
    ];

    const sortOptions = [
        'Price Low to High',
        'Price High to Low',
        'Newest First'
    ];

    return (
        <div className='flex flex-col-reverse items-start justify-between px-4 lg:flex-row pt-28 md:pt-35 md:px-16 xl:px-32 lg:px-24'>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                    <p className='mt-2 text-sm md:text-base text-gray-500/90 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                </div>
                {roomsDummyData.map((room) => (
                    <div key={room._id} className='flex flex-col items-start gap-6 py-10 border-b border-gray-300 md:flex-row last:pb-30 last:border-0'>
                        <img onClick={() => { navigate(`/room/${room._id}`); scrollTo(0, 0) }} src={room.images[0]} alt="hotel-img" title='View Room Details' className='object-cover shadow-lg cursor-pointer max-h-65 md:w-1/2 rounded-xl' />
                        <div className='flex flex-col gap-2 md:w-1/2'>
                            <p className='text-gray-500'>{room.hotel.city}</p>
                            <p onClick={() => { navigate(`/room/${room._id}`); scrollTo(0, 0) }} className='text-3xl text-gray-800 cursor-pointer font-playfair'>{room.hotel.name}</p>
                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2'>200+ reviews</p>
                            </div>
                            <div className='flex items-center gap-1 mt-2 text-sm text-gray-500'>
                                <img src={assets.locationFilledIcon} alt="location-icon" />
                                <span>{room.hotel.address}</span>
                            </div>
                            {/* Room Amenities */}
                            <div className='flex flex-wrap items-center gap-4 mt-3 mb-6'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5f5ff]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Room Price per night */}
                            <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} /night</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Filters */}
            <div className='text-gray-600 bg-white border border-gray-300 w-80 max-lg:mb-8 min-lg:mt-16'>
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
                    <p className='text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>{openFilters ? 'HIDE' : 'SHOW'}</span>
                        <span className='hidden lg:block'>CLEAR</span>
                    </div>
                </div>
                <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='pb-2 font-medium text-gray-800'>Popular Filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>
                        <p className='pb-2 font-medium text-gray-800'>Price Range</p>
                        {priceRange.map((range, index) => (
                            <CheckBox key={index} label={`${range}`} />
                        ))}
                    </div>
                    <div className='px-5 pt-5 pb-7'>
                        <p className='pb-2 font-medium text-gray-800'>Price Range</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms
