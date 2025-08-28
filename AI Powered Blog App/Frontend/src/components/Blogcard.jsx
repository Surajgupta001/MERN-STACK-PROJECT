import React from 'react'
import { useNavigate } from 'react-router-dom';

function Blogcard({ blog }) {

    const { title, description, image, _id, category } = blog;

    const navigate = useNavigate();


    return (
        <div onClick={() => navigate(`/blog/${_id}`)} className='w-full overflow-hidden duration-300 rounded-lg shadow cursor-pointer hover:scale-102 hover:shadow-primary/25'>
            <img className='aspect-video' src={image} alt='' />
            <span className='inline-block px-3 py-1 mt-4 ml-5 text-xs rounded-md bg-primary/20 text-primary'>{category}</span>
            <div className='p-5'>
                <h5 className='mb-2 font-medium text-gray-900'>{title}</h5>
                <p className='mb-3 text-xs text-gray-600' dangerouslySetInnerHTML={{ __html: description.slice(0, 100) }}></p>
            </div>
        </div>
    )
}

export default Blogcard
