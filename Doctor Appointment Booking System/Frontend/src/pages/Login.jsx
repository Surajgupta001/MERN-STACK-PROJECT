import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {

    const { backendUrl, token, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/user/register', {
                    name,
                    email,
                    password
                });

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                } else {
                    console.error("Registration failed:", data.message);
                    toast.error("Registration failed");
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/login', {
                    email,
                    password
                });

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                } else {
                    console.error("Login failed:", data.message);
                    toast.error("Login failed");
                }
            }
            
        } catch (error) {
            console.error("Error occurred:", error);
            toast.error("An error occurred");
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
                <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
                {state === 'Sign Up'
                    ? <div className='w-full '>
                        <p>Full Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full p-2 mt-1 border rounded border-zinc-300' type="text" required />
                    </div>
                    : null
                }
                <div className='w-full '>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full p-2 mt-1 border rounded border-zinc-300' type="email" required />
                </div>
                <div className='w-full '>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full p-2 mt-1 border rounded border-zinc-300' type="password" required />
                </div>
                <button type='submit' className='w-full py-2 my-2 text-base text-white rounded-md bg-primary'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
                {state === 'Sign Up'
                    ? <p>Already have an account? <span onClick={() => setState('Login')} className='underline cursor-pointer text-primary'>Login here</span></p>
                    : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='underline cursor-pointer text-primary'>Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login
