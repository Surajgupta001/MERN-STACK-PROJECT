import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard';

function Car() {

    const [input, setInput] = useState('');

    return (
        <div>
            <div className='flex flex-col items-center py-20 bg-light max-md:px-24'>
                <Title title='Available Cars' subtitle='Browse our selection of cars available for rent' />
                <div className='flex items-center w-full h-12 px-4 mt-6 bg-white rounded-full shadow max-w-140'>
                    <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
                    <input onClick={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by make, or features' className='w-full h-full text-gray-500 outline-none' />
                    <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
                </div>
            </div>
            <div className='px-6 mt-10 md:px-16 lg:px-24 xl:px-32'>
                <p>Showing {dummyCarData.length} Cars</p>
                <div className='grid grid-cols-1 gap-8 mx-auto mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:px-20 max-w-7xl'>
                    {dummyCarData.map((car, index) => (
                        <div key={index}>
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Car
