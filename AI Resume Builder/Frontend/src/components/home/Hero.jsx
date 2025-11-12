import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Hero() {

    const { user } = useSelector(state => state.auth);

    const [menuOpen, setMenuOpen] = useState(false);

    const logos = [
        'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
    ]

    return (
        <>
            <div className="min-h-screen pb-20">
                {/* Navbar */}
                <nav className="z-50 flex items-center justify-between w-full px-6 py-4 text-sm md:px-16 lg:px-24 xl:px-40">
                    <a href="https://prebuiltui.com">
                        <img src="/logo.svg" alt="logo" className='w-auto h-11' />
                    </a>

                    <div className="items-center hidden gap-8 transition duration-500 md:flex text-slate-800">
                        <a href="#" className="transition hover:text-green-600">Home</a>
                        <a href="#features" className="transition hover:text-green-600">Features</a>
                        <a href="#testimonials" className="transition hover:text-green-600">Testimonials</a>
                        <a href="#cta" className="transition hover:text-green-600">Contact</a>
                    </div>

                    <div className="flex gap-2">
                        <Link to='/app?state=register' className="hidden px-6 py-2 text-white transition-all bg-green-500 rounded-full md:block hover:bg-green-700 active:scale-95" hidden={user}>
                            Get started
                        </Link>
                        <Link to='/app?state=login' className="hidden px-6 py-2 transition-all border rounded-full md:block active:scale-95 hover:bg-slate-50 text-slate-700 hover:text-slate-900" hidden={user}>
                            Login
                        </Link>
                        <Link to='/app' className='hidden px-8 py-2 text-white transition bg-green-500 rounded-full md:block hover:bg-green-700 active:scale-95' hidden={!user}>Dashboard</Link>
                    </div>

                    <button onClick={() => setMenuOpen(true)} className="transition md:hidden active:scale-90" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div className={`fixed inset-0 z-100 bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                    <a href="#" className="text-white">Home</a>
                    <a href="#features" className="text-white">Features</a>
                    <a href="#testimonials" className="text-white">Testimonials</a>
                    <a href="#contact" className="text-white">Contact</a>
                    <button onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-10 h-10 p-1 text-white transition bg-green-600 rounded-md active:ring-3 active:ring-white aspect-square hover:bg-green-700" > X </button>
                </div>

                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center px-4 text-sm text-black md:px-16 lg:px-24 xl:px-40">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 w-72 h-72 sm:w-96 sm:h-96 xl:w-120 xl:h-120 2xl:w-132 2xl:h-132 bg-green-300 blur-[100px] opacity-30"></div>

                    {/* Avatars + Stars */}
                    <div className="flex items-center mt-24">
                        <div className="flex pr-3 -space-x-3">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="w-8 h-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-1" />
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="w-8 h-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="w-8 h-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-3" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="w-8 h-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-4" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="w-8 h-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-5" />
                        </div>

                        <div>
                            <div className="flex ">
                                {Array(5).fill(0).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-transparent lucide lucide-star fill-green-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                ))}
                            </div>
                            <p className="text-sm text-gray-700">
                                Used by 10,000+ users
                            </p>
                        </div>
                    </div>

                    {/* Headline + CTA */}
                    <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
                        Land your dream job with <span className="text-transparent bg-linear-to-r from-green-700 to-green-600 bg-clip-text text-nowrap">AI-powered </span> resumes.
                    </h1>

                    <p className="max-w-md text-base text-center my-7">Create, edit and download professional resumes with AI-Powered assistance</p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 ">
                        <Link to='/app' className="flex items-center h-12 m-1 text-white transition-colors bg-green-500 rounded-full hover:bg-green-600 px-9 ring-offset-2 ring-1 ring-green-400">
                            Get started
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-1 lucide lucide-arrow-right" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </Link>
                        <button className="flex items-center h-12 gap-2 transition border rounded-full border-slate-400 hover:bg-green-50 px-7 text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lucide lucide-video" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                            <span>Try demo</span>
                        </button>
                    </div>

                    <p className="py-6 text-slate-600 mt-14">Trusting by leading brands, including</p>

                    <div className="flex flex-wrap justify-between w-full max-w-3xl gap-6 py-4 mx-auto max-sm:justify-center" id="logo-container">
                        {logos.map((logo, index) => <img key={index} src={logo} alt="logo" className="w-auto h-6 max-w-xs" />)}
                    </div>
                </div>
            </div>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                    * {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
            </style>
        </>
    )
}

export default Hero
