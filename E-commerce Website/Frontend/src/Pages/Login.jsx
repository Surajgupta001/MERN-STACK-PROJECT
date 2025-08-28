import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../Context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login')
  const { token, setToken, backendUrl } = useContext(shopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onSubmithandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === 'Sign up') {
        const response = await axios.post(backendUrl + '/api/users/register', { name, email, password });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else {
          toast.error(response.data.message || 'Login failed');
        }
      }
      else {
        const response = await axios.post(backendUrl + '/api/users/login', { email, password });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else {
          toast.error(response.data.message || 'Login failed');
        }
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate])

  return (
    <form onSubmit={onSubmithandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-3 py-2 border border-gray-800' type='text' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-3 py-2 border border-gray-800' type='email' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-3 py-2 border border-gray-800' type='password' placeholder='Password' required />
      <div className='w-full flex justify-between text-sm mt[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {currentState === 'Login'
          ? <p onClick={() => setCurrentState('Sign up')} className='cursor-pointer'>Create account</p>
          : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>}
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login