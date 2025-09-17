import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Login() {

    const { setShowLogin, axios, setToken, navigate } = useAppContext();

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.post(`/api/users/${state}`, {
                name,
                email,
                password
            });
            
            if(data.success){
                navigate('/');
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Login/Register Error:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 flex items-center text-sm text-gray-600 z-100 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={e => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="m-auto text-2xl font-medium">
                    <span className="text-primary">User</span>
                    {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="cursor-pointer text-primary">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="cursor-pointer text-primary">click here</span>
                    </p>
                )}
                <button className="w-full py-2 text-white transition-all rounded-md cursor-pointer bg-primary hover:bg-blue-800">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    )
}

export default Login
