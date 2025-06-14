import React, { useState, useSyncExternalStore } from 'react';
import { Link,useNavigate } from 'react-router';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import MessageAlerter from './MessageAlerter';
import api from '../axiosconfig'
import { getFirstErrorMessage } from '../utils/ErrorExtractor';

const Register = () => {

    const navigate = useNavigate()
    const [showpassword, ToggleShowPassword] = useState(false)
    const [showconfirm, ToggleShowConfirm] = useState(false)
    const [alert, setAlert] = useState({ type: false, message: '' });
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [ferrors, setFieldErrors] = useState({
        'username': '',
        'email': '',
        'password': '',
        'confirm': ''
    })

    // for creating alers --
    const showAlert = (type, message) => {
        setAlert({ type, message });
    };


    // handling username field
    const handleUsername = (e) => {
        const value = e.target.value;
        setUsername(value);

        // If empty, clear the error
        if (value.trim() === '') {
            setFieldErrors({ ...ferrors, username: '' });
            return;
        }
        // Validation logic

        if (!/^[A-Za-z]/.test(value)) {
            setFieldErrors({ ...ferrors, username: 'Username must start with a letter' });
        } else if (value.length < 3) {
            setFieldErrors({ ...ferrors, username: 'Username must be at least 3 characters long' });
        } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            setFieldErrors({ ...ferrors, username: 'Only letters, numbers, and underscores are allowed' });
        } else {
            setFieldErrors({ ...ferrors, username: '' });
        }
    };

    // handling email field
    const handleEmail = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value.trim() === '') {
            setFieldErrors({ ...ferrors, email: '' });
            return;
        }
        if (/^[0-9]/.test(value)) {
            setFieldErrors({ ...ferrors, email: 'Email cannot start with a number' });
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
            setFieldErrors({ ...ferrors, email: 'Invalid email format' });
        } else {
            setFieldErrors({ ...ferrors, email: '' });
        }
    };

    // handling password field 
    const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (value.trim() === '') {
            setFieldErrors({ ...ferrors, password: '' });
            return;
        }

        const lengthCheck = value.length >= 8;
        const uppercaseCheck = /[A-Z]/.test(value);
        const lowercaseCheck = /[a-z]/.test(value);
        const digitCheck = /\d/.test(value);
        const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!lengthCheck || !uppercaseCheck || !lowercaseCheck || !digitCheck || !symbolCheck) {
            setFieldErrors({
                ...ferrors,
                password: 'Password is not strong enough. Use at least 8 characters with letters, numbers, and symbols',
            });
        } else {
            setFieldErrors({ ...ferrors, password: '' });
        }
    };

    const handleConfirmPassword = (e) => {
        const value = e.target.value;
        setConfirm(value);

        if (value.trim() === '') {
            setFieldErrors({ ...ferrors, confirm: '' });
            return;
        }

        if (value !== password) {
            setFieldErrors({ ...ferrors, confirm: 'Passwords do not match' });
        } else {
            setFieldErrors({ ...ferrors, confirm: '' });
        }
    };



    const handleSubmit =async (e) => {
        e.preventDefault();

        // Check if there are any validation errors
        const hasErrors = Object.values(ferrors).some(error => error);
        if (hasErrors) {
            showAlert(false, "Please fix the errors before submitting.");
            return;
        }

        // 2. Check for empty fields
        if (!username || !email || !password || !confirm) {
            showAlert(false, "Please fill in all the required fields.");
            return;
        }

        // 3. Prepare the data object
        const formData = {
            username: username.trim(),
            email: email.trim(),
            password: password,
            password2: confirm
        };

        try{
            const response = await api.post('/register/',formData)
            const message = response.data?.message
            navigate('/',{ state: { successMessage: message } })
        }catch(error){
            const firstError = getFirstErrorMessage(error.response?.data)
            showAlert(false, firstError);
        }

    };


    return (
        <>
            {/* component for alert messages */}
            <MessageAlerter
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ type: false, message: '' })}
            />

            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Sign Up to Get Started</h2>

                    <form className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => handleUsername(e)}

                            />
                            {ferrors.username && <p className='text-red-600 lg:text-[14px] md:text-[13px] text-[12px]'>{ferrors.username}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Email</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => handleEmail(e)}
                            />
                            {ferrors.email && <p className='text-red-600 lg:text-[14px] md:text-[13px] text-[12px]'>{ferrors.email}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Password</label>
                            <div className='flex items-center relative'>
                                <input
                                    type={showpassword ? 'text' : 'password'}
                                    className="w-full pr-9 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => handlePassword(e)}
                                />

                                {showpassword ?
                                    <FaRegEyeSlash className='cursor-pointer absolute right-2' size={20} onClick={() => ToggleShowPassword(!showpassword)} />
                                    :
                                    <FaRegEye className='cursor-pointer absolute right-2' size={20} onClick={() => ToggleShowPassword(!showpassword)} />}
                            </div>
                            {ferrors.password && <p className='text-red-600 lg:text-[14px] md:text-[13px] text-[12px]'>{ferrors.password}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Confirm</label>
                            <div className='flex items-center relative'>
                                <input
                                    type={showconfirm ? 'text' : 'password'}
                                    className="w-full pr-9 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your password"
                                    value={confirm}
                                    onChange={e => handleConfirmPassword(e)}
                                />
                                {showconfirm ?
                                    <FaRegEyeSlash className='cursor-pointer absolute right-2' size={20} onClick={() => ToggleShowConfirm(!showconfirm)} />
                                    :
                                    <FaRegEye className='cursor-pointer absolute right-2' size={20} onClick={() => ToggleShowConfirm(!showconfirm)} />}
                            </div>
                            {ferrors.confirm && <p className='text-red-600 lg:text-[14px] md:text-[13px] text-[12px]'>{ferrors.confirm}</p>}
                        </div>

                        <button
                            type="button"
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                            onClick={handleSubmit}
                        >
                            Sign up
                        </button>
                    </form>

                    <p className="text-center mt-4 text-sm text-gray-600">
                        <Link to={'/'} className="text-indigo-600 font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Register;
