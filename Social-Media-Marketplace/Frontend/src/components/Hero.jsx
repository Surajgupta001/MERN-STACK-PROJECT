import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {

    const [input, setInput] = useState('')

    const navigate = useNavigate();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate(`/marketplace?search=${input}`);
    }

    return (
        <>
            <div className="relative flex flex-col items-center justify-center px-4 text-sm text-gray-800 md:px-16 lg:px-24 xl:px-40">

                {/* Avatars + Stars */}
                <div className="flex items-center mt-24 md:mt-36">
                    <div className="flex pr-3 -space-x-3">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-1" />
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-3" />
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-4" />
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-5" />
                    </div>

                    <div>
                        <div className="flex ">
                            {Array(5).fill(0).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-transparent lucide lucide-star fill-indigo-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                            ))}
                        </div>
                        <p className="text-sm text-gray-700"> Used by 10,000+ users </p>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="max-w-lg mt-4 text-4xl font-semibold leading-tight text-center md:text-6xl md:max-w-2xl md:leading-tight">
                    Buy & Sell your <span className="relative bg-linear-to-r from-purple-700 to-[#764de1] bg-clip-text text-transparent">
                        Social
                        <div className="absolute bottom-0 left-0 z-10 w-full scale-160" >
                            <img src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradient_arc.svg' alt="gradient" />
                        </div>
                    </span> <span className='relative bg-linear-to-r from-[#764de1] to-indigo-600 bg-clip-text text-transparent'>Profiles</span> Online.
                </h1>

                <p className="max-w-xl text-base text-center my-7">A secure marketplace to buy and sell Instagram, YouTube, Twitter, Telegram and more - fast, safe and hassle-free.</p>

                {/* Search Box */}
                <form onSubmit={onSubmitHandler} className='flex justify-center w-full group'>
                    <label className='flex items-center w-full max-w-md p-1 border border-gray-400 rounded-md'>
                        <input onChange={e => setInput(e.target.value)} value={input} type="text" placeholder='Instagram account' className='flex-1 pl-2 outline-none' />
                        <button className='p-3 px-6 text-white bg-indigo-600 rounded-md cursor-pointer'> Search </button>
                    </label>
                </form>
            </div>
        </>
    );
}

export default Hero
