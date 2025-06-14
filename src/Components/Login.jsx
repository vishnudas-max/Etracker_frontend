import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import MessageAlerter from './MessageAlerter';
import { FaRegEye,FaRegEyeSlash } from 'react-icons/fa6';
import api from '../axiosconfig'

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ type: false, message: '' });
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showpassword,ToggleShowPassword] = useState(false)


    useEffect(() => {
        if (location.state?.successMessage) {
            showAlert(true, location.state.successMessage); //getting message from url state

            // Clear state after showing the message
            const timeout = setTimeout(() => {
                navigate(location.pathname, { replace: true, state: {} });
            }, 100); // slight delay ensures the message is rendered

            return () => clearTimeout(timeout);
        }
    }, [location, navigate]);

    const showAlert = (type, message) => {
        setAlert({ type, message });
    };


    const handleLogin=async (e)=>{  
        e.preventDefault()
        const formData = {
            username:username,
            password:password
        }
        try{
            const response=await api.post('/login/',formData)
            showAlert(true,response.data.message)
            navigate('dashboard/')
            console.log(response.data)
        }catch(error){
            const errors = error.response?.data?.message
            if(errors){
                showAlert(false,errors)
            }else{
                showAlert(false,'something went wrong!')
            }
            
        }

    }

    return (
        <>
            <MessageAlerter
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ type: false, message: '' })}
            />
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Welcome Back</h2>

                    <form className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Password</label>
                            <div className='flex items-center relative'>
                                <input
                                    type={showpassword ? 'text' : 'password'}
                                    className="w-full pr-9 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />

                                {showpassword ?
                                    <FaRegEyeSlash className='cursor-pointer absolute right-2' size={20} onClick={() => ToggleShowPassword(!showpassword)} />
                                    :
                                    <FaRegEye className='cursor-pointer absolute right-2' size={20} onClick={() => ToggleShowPassword(!showpassword)} />}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                            onClick={e=>handleLogin(e)}
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-center mt-4 text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link to={'register/'} className="text-indigo-600 font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
