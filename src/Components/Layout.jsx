import React from 'react';
import { Outlet, Link } from 'react-router-dom'
import api from '../axiosconfig'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/UserAuthSlice'

const Layout = () => {
    const dispatch = useDispatch()
    const is_auth = useSelector(state => state.user.is_auth)
    const handleLogout = async (e) => {
        try {
            await api.post('logout/', {})
            dispatch(logout())
        } catch (error) {
            console.log(error.response?.data)
        }
    }

    return (
        <>
            <div className='flex flex-col max-h-screen'>
                <div className='flex w-full bg-gradient-to-r from-blue-600 to-indigo-700 h-20 items-center'>
                    <div className='basis-1/2 pl-5'>
                        <h1 className='text-white font-extrabold font-mono tracking-wide md:text-2xl text-xl lg:text-3xl'>
                            Expense Tracker
                        </h1>
                    </div>
                    {is_auth &&
                        <div className='flex basis-1/2 justify-end pr-7'>
                            <button className='text-white w-fit font-semibold lg:text-xl' onClick={e => handleLogout(e)}>Log out</button>
                        </div>}
                </div>
                <main style={{ height: 'calc(100vh - 40px)' }}>
                    <Outlet />
                </main>
            </div>

        </>
    );
}

export default Layout;
