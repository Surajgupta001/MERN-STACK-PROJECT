import { Mail, User2Icon, Lock } from 'lucide-react'
import React, { useState } from 'react'
import api from '../configs/api';
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice';
import toast from 'react-hot-toast';

function Login() {

    const dispatch = useDispatch();
    
    const query = new URLSearchParams(window.location.search);
    const urlState = query.get('state');
    const [state, setState] = useState( urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post(`/api/v1/users/${state}`, formData);
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="mt-10 text-3xl font-medium text-gray-900">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="mt-2 text-sm text-gray-500">Please {state} to continue</p>
                {state !== "login" && (
                    <div className="flex items-center w-full h-12 gap-2 pl-6 mt-6 overflow-hidden bg-white border rounded-full border-gray-300/80">
                        <User2Icon size={16} color='#6b7280' />
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full h-12 gap-2 pl-6 mt-4 overflow-hidden bg-white border rounded-full border-gray-300/80">
                    <Mail size={13} color='#6b7280' />
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center w-full h-12 gap-2 pl-6 mt-4 overflow-hidden bg-white border rounded-full border-gray-300/80">
                    <Lock size={13} color='#6b7280' />
                    <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mt-4 text-left text-green-500">
                    <button className="text-sm" type="reset">Forget password?</button>
                </div>
                <button type="submit" className="w-full mt-2 text-white transition-opacity bg-green-500 rounded-full h-11 hover:opacity-90">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="mt-3 text-sm text-gray-500 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p>
            </form>
        </div>
    )
}

export default Login
