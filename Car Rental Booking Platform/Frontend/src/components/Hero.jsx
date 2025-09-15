import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'

function Hero() {

    const [pickupLocation, setPickupLocation] = useState('');

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center gap-14 bg-light'>
            <h1 className='text-4xl font-semibold md:text-sxl'>Luxury cars on Rent</h1>
            <form className='flex flex-col items-start justify-between w-full p-6 bg-white rounded-md shadow-[0px_8px_20px_rgba(0,0,0,0.1)] md:flex-row md:items-center md:rounded-md max-w-80 md:max-w-200'>
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
                        <input type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' />
                    </div>
                    <div className='flex flex-col items-start gap-2'>
                        <label htmlFor="return-date">Return Date</label>
                        <input type="date" id="return-date" className='text-sm text-gray-500' />
                    </div>
                </div>
                <button className='flex items-center justify-center gap-1 py-3 text-white rounded-md cursor-pointer px-9 max:sm-mt-4 bg-primary hover:bg-primary-dull'>
                    <img src={assets.search_icon} alt="search" className='brightness-300' />
                    Search
                </button>
            </form>
            <img src={assets.main_car} alt="car" className='max-h-74' />
        </div>
    )
}

export default Hero
