import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'

function ExclusiveOffers() {
    return (
        <div className='flex flex-col items-center px-6 pt-20 md:px-16 lg:px-24 xl:px-32 pb-30'>
            <div className='flex flex-col items-center justify-between w-full left md:flex-row'>
                <Title align='left' title='Exclusive Offers' subtitle='Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.' />
                <button className='flex items-center gap-2 font-medium cursor-pointer group max-md:mt-12'>
                    View All offers
                    <img className='transition-all group-hover:translate-x-1' src={assets.arrowIcon} alt="arrow-icon" />
                </button>
            </div>
            <div className='grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3'>
                {exclusiveOffers.map((item) => (
                    <div key={item._id} className='relative flex flex-col items-start justify-between gap-1 px-4 pt-12 text-white bg-center bg-no-repeat bg-cover rounded-md group md:pt-18' style={{ backgroundImage: `url(${item.image})` }}>
                        <p className='absolute px-3 py-1 text-xs font-medium text-gray-800 bg-white rounded-md top-4 left-4'>{item.priceOff}% OFF</p>
                        <div>
                            <p className='text-2xl font-medium font-playfair'>{item.title}</p>
                            <p className=''>{item.description}</p>
                            <p className='mt-3 text-xs text-white/70'>Expire {item.expiryDate}</p>
                        </div>
                        <button className='flex items-center gap-2 mt-4 mb-5 font-medium cursor-pointer'>
                            View Offers
                            <img className='transition-all invert group-hover:translate-x-1' src={assets.arrowIcon} alt="arrow-icon" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExclusiveOffers
