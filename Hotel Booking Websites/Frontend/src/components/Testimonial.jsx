import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'

function Testimonial() {
    return (
        <div className='flex flex-col items-center px-6 pt-20 md:px-16 lg:px-24 bg-slate-50 pb-30'>
            <Title title='What Our Guests Say' subtitle='Discover why discerning travelers choose QuickStay for their luxury accommodations around the world.' />
            <div className="flex flex-wrap items-center gap-6 mt-20">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-6 bg-white shadow rounded-xl">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl font-playfair">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            <StarRating />
                        </div>
                        <p className="mt-4 text-gray-500 max-w-90">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial
