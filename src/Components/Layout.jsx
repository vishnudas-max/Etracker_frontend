import React from 'react';
import { Outlet, Link } from 'react-router-dom'
import api from '../axiosconfig'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/UserAuthSlice'
import { IoMdLogOut } from "react-icons/io";

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
            <div className="flex flex-col hide-scrollbar overflow-scroll">
                {/* Navbar */}
                <div className="flex w-full  fixed bg-gradient-to-r from-indigo-400 to-purple-400 h-20 items-center flex-shrink-0">
                    <div className="basis-1/2 pl-5">
                        <h1 className="text-black font-extrabold font-mono tracking-wide md:text-2xl text-xl lg:text-3xl">
                            Expense Tracker
                        </h1>
                    </div>
                    {is_auth && (
                        <div className="flex basis-1/2 justify-end pr-7">
                            <button
                                className="text-black w-fit font-semibold lg:text-xl flex items-center"
                                onClick={(e) => handleLogout(e)}
                            ><span><IoMdLogOut className='size-9'/></span>
                                Log out
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <main className="flex-grow h-full">
                    <Outlet />
                </main>
            </div>


        </>
    );
}

export default Layout;
