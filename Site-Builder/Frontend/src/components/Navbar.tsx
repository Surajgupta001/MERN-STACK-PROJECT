import { useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { UserButton } from '@daveyplate/better-auth-ui';

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const { data: session, isPending } = authClient.useSession();

    return (
        <>
            <nav className="z-50 flex items-center justify-between w-full px-4 py-4 text-white border-b md:px-16 lg:px-24 xl:px-32 backdrop-blur border-slate-800">
                <Link to="/">
                    <img src={assets.logo} alt="logo" className='h-5 sm:h-7' />
                </Link>

                <div className="items-center hidden gap-8 transition duration-500 md:flex">
                    <Link to="/">Home</Link>
                    <Link to="/projects">My Projects</Link>
                    <Link to="/community">Community</Link>
                    <Link to="/pricing">Pricing</Link>
                </div>

                <div className="flex items-center gap-3">
                    {isPending ? (
                        <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
                    ) : !session ? (
                        <button onClick={() => navigate('/auth/sign-in')} className="px-6 py-1.5 transition bg-indigo-600 rounded-md active:scale-95 hover:bg-indigo-700 max-sm:text-sm">
                            Get started
                        </button>
                    ) : (
                        <UserButton size='icon' />
                    )}
                    <button id="open-menu" className="transition md:hidden active:scale-90" onClick={() => setMenuOpen(true)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
                    </button>
                </div>
            </nav>
            {/* Mobile Menu */}
            {menuOpen && (
                <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 text-lg text-white transition-transform duration-300 z-100 bg-black/60 backdrop-blur md:hidden">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/projects" onClick={() => setMenuOpen(false)}>My Projects</Link>
                    <Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link>
                    <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
                    <button className="flex items-center justify-center p-1 text-black transition rounded-md active:ring-3 active:ring-white aspect-square size-10 bg-slate-100 hover:bg-slate-200" onClick={() => setMenuOpen(false)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>
            )}
            {/* BACKGROUND IMAGE */}
            <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png" className="absolute inset-0 opacity-50 -z-10 size-full" alt="" />
        </>
    )
}

export default Navbar
