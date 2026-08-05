import React, { useState } from 'react'
import LoginLeft from '../components/LoginLeft';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';

function AuthPage({ mode }) {

    const isLogin = mode === 'login';

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='flex min-h-screen font-sans bg-white text-zinc-900'>
            {/* Left Panel - Branding */}
            <LoginLeft />
            {/* Right Panel - Form */}
            <div className='flex items-center justify-center flex-1 p-8'>
                <div className='w-full max-w-sm'>
                    <div className='mb-10'>
                        <h1 className='text-3xl font-medium tracking-tight text-zinc-900 mb-1.5 font-sans'>{isLogin ? 'Sign In' : 'Create Account'}</h1>
                        <p className='text-sm text-zinc-400'>
                            {isLogin
                                ? "Enter your credentials to access your website builder account."
                                : "Get started by entering your registration details."
                            }
                        </p>
                    </div>
                    {error && (
                        <div className='p-3 mb-6 text-xs text-red-700 border border-red-200 rounded bg-red-50'>
                            {error}
                        </div>
                    )}
                    <form className='space-y-4'>
                        {isLogin && (
                            <div>
                                <label className='block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2'>Full Name</label>
                                <input type="text" placeholder='John Doe...' value={name} onChange={(e) => setName(e.target.value)} required className='w-full py-2 pl-2 text-sm transition-colors bg-transparent border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-zinc-900 placeholder-zinc-300' />
                            </div>
                        )}
                        <div>
                            <label className='block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2'>Email Address</label>
                            <input type="email" placeholder='john.doe@example.com' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full py-2 pl-2 text-sm transition-colors bg-transparent border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-zinc-900 placeholder-zinc-300' />
                        </div>
                        <div>
                            <label className='block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2'>Password</label>
                            <div className='relative'>
                                <input type={showPassword ? "text" : "password"} placeholder='••••••••' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full py-2 pl-2 text-sm transition-colors bg-transparent border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-zinc-900 placeholder-zinc-300' />
                                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute flex items-center justify-center transition-colors -translate-y-1/2 cursor-pointer right-2 top-1/2 text-zinc-300 hover:text-zinc-600'>
                                    {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                                </button>
                            </div>
                        </div>
                        <button type='submit' disabled={loading} className='w-full py-2.5 bg-linear-to-br from-red-600 to-amber-600 text-white font-semibold hover:scale-102 disabled:opacity-40 flex items-center justify-center mt-2 rounded-lg transition-all'>
                            {loading && <Loader2Icon className='w-3.5 h-3.5 mr-2 animate-spin' />}
                            {isLogin ? 'Sign In' : 'Sign up'}
                        </button>
                    </form>
                    <p className='pt-6 mt-8 font-sans text-sm border-t text-zinc-400 border-zinc-100'>
                        {isLogin ? (
                            <>
                                New to BuilderAI?{" "}
                                <Link to='/register' className='text-zinc-900 hover:underline'>
                                    Create an account
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link to='/login' className='font-medium text-zinc-900 hover:underline'>
                                    Sign in here
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AuthPage