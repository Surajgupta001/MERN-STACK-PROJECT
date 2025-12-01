import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard';

function CoursesSection() {

    const { allCourses } = useContext(AppContext);

    return (
        <div className='px-8 py-16 text-center md:px-40'>
            <h2 className='font-bold text-gray-800 text-home-heading-small md:text-home-heading-large'>Learn from the best</h2>
            <p className='max-w-3xl mx-auto mt-4 text-gray-500 text-default'>Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.</p>
            <div className='grid grid-cols-1 gap-6 px-0 my-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:my-16'>
                {allCourses.slice(0, 4).map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>
            <Link to="/course-list" onClick={() => scrollTo(0, 0)} className="inline-block px-10 py-3 mt-6 text-gray-600 transition border rounded-md border-gray-500/30 hover:border-gray-500 hover:text-gray-800">Show all courses</Link>
        </div>
    )
}

export default CoursesSection
