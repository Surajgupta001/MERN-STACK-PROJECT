import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

function LoginPage() {

    const [currState, setCurrState] = useState('Sign up')
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const { login } = useContext(AuthContext);

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (currState === 'Sign up' && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }

        const endpoint = currState === 'Sign up' ? 'signup' : 'login';
        const payload = endpoint === 'signup'
            ? { fullName, email, password, bio }
            : { email, password };
        login(endpoint, payload);
    };

    return (
        <div className='flex items-center justify-center min-h-screen gap-8 bg-center bg-cover sm:justify-evenly max-sm:flex-ol backdrop-blur-2xl'>
            {/* Left Side */}
            <img src={assets.logo} alt="" className='w-[min(30vw, 250px)]' />
            {/* Right Side */}
            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 p-6 text-white border-2 border-gray-500 rounded-lg shadow-lg'>
                <h2 className='flex items-center justify-between mb-2 text-2xl font-medium'>
                    {currState}
                    {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
                </h2>
                {currState === 'Sign up' && !isDataSubmitted && (
                    <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" placeholder='Full Name' className='p-3 text-white placeholder-gray-400 bg-transparent border border-gray-500 rounded-md focus:outline-none' required />
                )}

                {!isDataSubmitted && (
                    <>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' className='p-3 text-white placeholder-gray-400 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required />
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='p-3 text-white placeholder-gray-400 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required />
                    </>
                )}

                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='p-3 text-white placeholder-gray-400 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Give a short bio...' required></textarea>
                )}
                <button type='submit' className='py-3 mt-2 text-white transition-all rounded-md cursor-pointer bg-gradient-to-r from-purple-400 to-violet-600 hover:from-purple-500 hover:to-violet-700'>
                    {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
                </button>
                <div className='flex items-center gap-2 text-sm text-gray-400'>
                    <input type="checkbox" className='accent-purple-500' />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>
                <div className='flex flex-col gap-2'>
                    {currState === 'Sign up' ? (
                        <p className='text-sm text-gray-600'>Already have an account? <span className='font-medium text-purple-500 cursor-pointer' onClick={() => { setCurrState('Login'); setIsDataSubmitted(false); }}>Login</span></p>
                    ) : (
                        <p className='text-sm text-gray-600'>Create an account <span className='font-medium text-purple-500 cursor-pointer' onClick={() => setCurrState('Sign up')}>Click here</span></p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage
