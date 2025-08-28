import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

function Login() {

    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setAToken, backendUrl } = useContext(AdminContext);

    const { setDToken } = useContext(DoctorContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            
            if (state === 'Admin') {
                
                const { data } = await axios.post(backendUrl + '/api/admin/login', {
                    email,
                    password
                });
                
                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                    toast.success("Admin Login successful");
                } else {
                    console.error("Login failed:", data.message);
                    toast.error(data.message);
                }
            } else {
                
                const { data } = await axios.post(backendUrl + '/api/doctor/login', {
                    email,
                    password
                });

                if (data.success) {
                    localStorage.setItem('dToken', data.token);
                    setDToken(data.token);
                    console.log(data.token);
                    toast.success("Doctor Login successful");
                } else {
                    console.error("Login failed:", data.message);
                    toast.error(data.message);
                }
            }
            
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Admin Login failed");
        }
        
    };

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='m-auto text-2xl font-semibold'><span className='text-primary'>{state}</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" placeholder='Enter your email' required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" placeholder='Enter your password' required />
                </div>
                <button className='w-full py-2 text-base text-white rounded-md bg-primary' type="submit">Login</button>
                {
                    state === 'Admin'
                        ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='underline cursor-pointer text-primary'>Click here</span></p>
                        : <p>Admin Login? <span onClick={() => setState('Admin')} className='underline cursor-pointer text-primary'>Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login
