import React, { useState } from 'react'
import LoginLeftSide from './LoginLeftSide'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'

function LoginForm({ role, title, subtitle }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className='flex flex-col min-h-screen md:flex-row'>
            <LoginLeftSide />
            <div className='flex items-center justify-center flex-1 p-6 bg-white sm:p-12'>
                <div className='w-full max-w-md animate-fade-in'>
                    <Link to='/login' className='inline-flex items-center gap-2 mb-10 text-sm transition-colors text-slate-400 hover:text-slate-700'>
                        <ArrowLeftIcon /> Back to portal selection
                    </Link>
                    <div className='mb-8'>
                        <h1 className='text-2xl font-medium sm:text-3xl text-zinc-800'>{title}</h1>
                        <p className='mt-2 text-sm text-slate-500 sm:text-base'>{subtitle}</p>
                    </div>
                    {error && (
                        <div className='flex items-start gap-3 p-4 mb-6 text-sm border bg-rose-50 border-rose-20 text-rose-700 rounded-xl'>
                            <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0' />
                            {error}
                        </div>
                    )}
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-slate-700'>Email Address</label>
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-4 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' placeholder='john.doe@example.com' required />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-slate-700'>Password</label>
                            <div className='relative'>
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='pr-11' placeholder='.........' required />
                                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute transition-colors -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600'>
                                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            </div>
                        </div>
                        <button type='submit' disabled={loading} className='w-full py-3 text-sm font-semibold text-white rounded-md shadow-lg bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center cursor-pointer'>
                            {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm