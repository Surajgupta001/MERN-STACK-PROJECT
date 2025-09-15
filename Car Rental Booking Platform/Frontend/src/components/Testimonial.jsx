import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';

function Testimonial() {

    const testimonials = [{
        name: "Emma Rodriguez",
        location: "Barcelona, Spain",
        image: assets.testimonial_image_1,
        testimonial: 'The car rental service was exceptional! The vehicle was in pristine condition, and the staff were incredibly helpful and friendly. Highly recommend for anyone looking for a hassle-free rental experience.'
    }, {
        name: "Liam Johnson",
        location: "New York, USA",
        image: assets.testimonial_image_2,
        testimonial: 'I had a fantastic experience with this car rental service. The process was smooth, and the car was exactly as described. Will definitely rent again!'
    }, {
        name: "Sophia Lee",
        location: "Seoul, South Korea",
        image: assets.testimonial_image_1,
        testimonial: 'The car rental service exceeded my expectations. The vehicle was clean and well-maintained, and the staff went above and beyond to ensure a great experience.'
    }
    ];

    return (
        <div className='px-6 py-28 md:px-16 lg:px-24 xl:px-44'>
            <Title title='What Our Customers Say' subtitle='Discover why discerning travelers choose stayVenture for their luxury accommodations around the world.' />
            <div className="grid grid-cols-1 gap-8 mt-18 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-6 bg-white shadow-lg rounded-xl hover:-translate-y-1">
                        <div className="flex items-center gap-3 transition-all duration-500">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img src={assets.star_icon} alt="star-icon" key={index} />
                            ))}
                        </div>
                        <p className="mt-4 font-light text-gray-500 max-w-90">{testimonial.testimonial}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial
