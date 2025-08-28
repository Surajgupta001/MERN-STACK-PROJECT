import React from 'react'
import { assets, cities } from '../assets/assets'

function HotelReg() {
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-100 bg-black/70'>
            <form className='flex max-w-4xl bg-white rounded-xl max-md:max-2'>
                <img src={assets.regImage} alt="reg-image" className='hidden w-1/2 rounded-xl md:block' />
                <div className='relative flex flex-col items-center md:w-1/2 md:p-10'>
                    <img src={assets.closeIcon} alt="close-icon" className='absolute w-4 h-4 cursor-pointer top-4 right-4' />
                    <p className='mt-6 text-2xl font-semibold'>Register Your Hotel</p>
                    {/* Hotel Name */}
                    <div className='w-full mt-4'>
                        <label htmlFor="name" className='font-medium text-gray-500'>Hotel Name</label>
                        <input type="text" id="name" placeholder='Enter Hotel Name' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* Phone */}
                    <div className='w-full mt-4'>
                        <label htmlFor="contact" className='font-medium text-gray-500'>Contact Number</label>
                        <input type="text" id="contact" placeholder='Enter Contact Number' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* Address */}
                    <div className='w-full mt-4'>
                        <label htmlFor="address" className='font-medium text-gray-500'>Address</label>
                        <input type="text" id="address" placeholder='Enter Address' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* Select City Drop Down */}
                    <div className='w-full mt-4 mr-auto max-w-60'>
                        <label htmlFor="city" className='font-medium text-gray-500'>City</label>
                        <select id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    {/* Submit Button */}
                    <button className='px-6 py-2 mt-6 mr-auto text-white transition-all bg-indigo-500 rounded cursor-pointer hover:bg-indigo-600'>Register</button>
                </div>
            </form>
        </div>
    )
}

export default HotelReg
