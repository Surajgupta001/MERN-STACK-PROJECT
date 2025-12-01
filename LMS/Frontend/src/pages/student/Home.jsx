import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/callToAction'
import Footer from '../../components/student/Footer'

function Home() {
    return (
        <div className='flex flex-col items-center text-center space-y-7'>
            <Hero />
            <Companies />
            <CoursesSection />
            <TestimonialsSection />
            <CallToAction />
            <Footer />
        </div>
    )
}

export default Home
