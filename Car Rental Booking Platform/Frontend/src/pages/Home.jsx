import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/banner'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'

function Home() {
    return (
        <>
            <Hero />
            <FeaturedSection />
            <Banner />
            <Testimonial />
            <NewsLetter />
        </>
    )
}

export default Home
