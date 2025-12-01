import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

function SearchBar({ data }) {

    const navigate = useNavigate();
    const [input, setInput] = useState(data ? data : '')

    const onSearchHandler = (e) => {
        e.preventDefault();
        navigate('/course-list/' + input);
    };
    
    return (
        <form onSubmit={onSearchHandler} className='flex items-center w-full h-12 max-w-xl bg-white border rounded md:h-14 border-hgray-500/20'>
            <img src={assets.search_icon} alt="search-icon" className='w-10 px-3 md:w-auto'/>
            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search for courses' className='w-full h-full outline-none text-gray-500/80'/>
            <button type='submit' className='py-2 mx-1 text-white bg-blue-600 rounded md:px-10 px-7 md:py-3'>Search</button>
        </form>
    )
}

export default SearchBar
