import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function Login() {

    const { axios, setToken } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/admin/login', { email, password });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['Authorization'] = `${data.token}`;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-full max-w-sm p-6 border rounded-md shadow-xl max-md:m-6 border-primary/30 shadow-primary/15'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='w-full py-6 text-center'>
                        <h1 className='text-3xl font-bold'><span className='text-primary'>Admin</span> Login</h1>
                        <p className='font-light'>Please enter your credentials to access the admin panel</p>
                    </div>
                    <form onSubmit={handleSubmit} className='w-full mt-6 text-gray-600 sm:max-w-md'>
                        <div className='flex flex-col'>
                            <label>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='p-2 mb-6 border-b-2 border-gray-300 outline-none' type="email" placeholder='Enter your email' required />
                        </div>
                        <div className='flex flex-col'>
                            <label>Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='p-2 mb-6 border-b-2 border-gray-300 outline-none' type="password" placeholder='Enter your password' required />
                        </div>
                        <button type='submit' className='w-full py-3 font-medium text-white transition-all rounded cursor-pointer bg-primary hover:bg-primary/90'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
