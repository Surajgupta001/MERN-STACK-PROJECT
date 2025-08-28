import React, { useState } from 'react'
import { blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import Blogcard from './Blogcard';
import { useAppContext } from '../context/AppContext';

function BlogList() {

    const [menu, setMenu] = useState('All');
    
    const { blogs, input } = useAppContext();

    const filteredBlogs = () => {
        if(input === '') return blogs;
        return blogs.filter((blogs) => blogs.title.toLowerCase().includes(input.toLowerCase()) || blogs.category.toLowerCase().includes(input.toLowerCase()));
    };

    return (
        <div>
            <div className='relative flex justify-center gap-4 my-10 sm:gap-8'>
                {blogCategories.map((item) => (
                    <div key={item} className='relative'>
                        <button onClick={() => setMenu(item)} className={`text-gray-500 cursor-pointer ${menu === item && 'text-white px-4 pt-0.5'}`}>
                            {item}
                            {menu === item && (<motion.div layoutId='underline' transition={{ type: "spring", stiffness: 500, damping: 30 }} className='absolute top-0 left-0 right-0 rounded-md h-7 -z-1 bg-primary'></motion.div>)}
                        </button>
                    </div>
                ))}
            </div>
            <div className='grid grid-cols-1 gap-8 mx-8 mb-24 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:mx-16 xl:mx-40'>
                {/* Blog Cards */}
                {
                    filteredBlogs().filter((blog) => menu === 'All' ? true : blog.category === menu)
                    .map((blog) => (
                        <Blogcard key={blog._id} blog={blog} />
                    ))}
            </div>
        </div>
    )
}

export default BlogList
