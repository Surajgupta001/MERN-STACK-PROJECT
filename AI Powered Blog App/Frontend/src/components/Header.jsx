import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

function Header() {

    const { input, setInput } = useAppContext();
    const inputRef = useRef();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setInput(inputRef.current.value);
    };

    const onClear = () => {
        setInput('');
        inputRef.current.value = '';
    };

    return (
        <div className='relative mx-8 sm:mx-16 xl:mx-24'>
            <div className='mt-20 mb-8 text-center'>
                <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
                    <p>New AI Featured integrated</p>
                    <img src={assets.star_icon} className='w-2.5' alt="" />
                </div>
                <h1 className='text-3xl font-semibold text-gray-700 sm:text-6xl sm:leading-16'>Your own <span className='text-primary'>blogging</span> <br /> platform with AI.</h1>
                <p className='max-w-2xl m-auto my-6 sm:my-8 max-sm:text-xs'>This is your space to think out loud, to share what matters, and to write without filters. Whether it’s one word or a thousand, your story starts right here.</p>
                <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg mx-auto overflow-hidden bg-white border border-gray-300 rounded max-sm:scale-75'>
                    <input ref={inputRef} className='w-full pl-4 outline-none' type="text" placeholder='Search for blogs...' required />
                    <button className='px-8 py-2 text-white bg-primary m-1.5 rounded hover:scale-105 transition-all cursor-pointer' type='submit'>Search</button>
                </form>
            </div>
            <div className='text-center'>
                {input && <button onClick={onClear} className='px-3 py-1 text-xs font-light border rounded-md cursor-pointer shadow-custom-sm'>Clear Search</button>}
            </div>
            <img className='absolute opacity-50 -top-50 -z-1' src={assets.gradientBackground} alt="" />
        </div>
    )
}

export default Header
