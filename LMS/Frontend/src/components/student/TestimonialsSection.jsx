import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

function TestimonialsSection() {
    return (
        <div className='px-8 pb-14 md:px-0'>
            <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
            <p className='mt-3 text-gray-500 md:text-base'>Hear from our learners as they share their journey of transformation, success, and how our <br />platform has made a difference in their lives.</p>
            <div className='grid gap-8 grid-cols-auto mt-14'>
                {dummyTestimonial.map((testimonial, index) => (
                    <div key={index} className='pb-6 text-sm text-left bg-white border rounded-lg border-gray-500/30 shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden'>
                        <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                            <img className='w-12 h-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                                <p className='text-gray-800/80'>{testimonial.role}</p>
                            </div>
                        </div>
                        <div className='p-5 pb-7'>
                            <div className='flex gap-0.5'>
                                {[...Array(5)].map((_, i) => (
                                    <img className='h-5' key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star" />
                                ))}
                            </div>
                            <p className='mt-5 text-gray-500'>{testimonial.feedback}</p>
                        </div>
                        <a href="#" className='px-5 text-blue-500 underline'>Read more</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TestimonialsSection
