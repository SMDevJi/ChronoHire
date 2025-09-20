import React, { useState } from 'react';
import DropOn from '../assets/dropdown-on.svg'; // Your SVG icon
import { Link, useLocation } from 'react-router-dom';

export default function Drawer({ authorization, handleLogout, decoded }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()

    const getLinkClass = (path) => {
        return location.pathname === path
            ? 'text-purple-600 font-bold ' // Active link style
            : 'hover:text-purple-600'
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 p-2"
            >
                <img
                    src={DropOn}
                    alt="Toggle Drawer"
                    className={`cursor-pointer h-9 w-9 transition duration-300`}
                />
            </button>


            <div
                className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-blue-300 z-40 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="ml-3 p-3 mt-20 font-medium text-xl">
                    <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
                </div>

                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/purchases" className={getLinkClass('/purchases')}>Purchases</Link>
                </div>
                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/about" className={getLinkClass('/about')}>About</Link>
                </div>

                {authorization == '' ?
                    <>
                        <Link to='/login'>
                            <button
                                className=" cursor-pointer mt-3 ml-6 text-base text-black font-medium bg-white hover:bg-gray-200 p-2 px-4 rounded-md"
                            >
                                Login
                            </button>
                        </Link>
                    </>
                    :
                    <>
                        <div className="coins w-12 h-12 ml-4 mb-2">
                            <img className='-mt-1 rounded-full ' src='/coin.png' alt="Profile" />
                            <p className='text-yellow-300 stroke text-lg -mt-5 ml-2'>{decoded.coins}</p>
                        </div>
                        <Link to='/profile'>
                            <button
                                className="cursor-pointer mt-3 ml-6 text-base text-black font-medium bg-white hover:bg-gray-200 p-2 px-4 rounded-md"
                            >
                                Profile
                            </button>
                        </Link>


                        <button
                            onClick={handleLogout}
                            className="cursor-pointer mt-3 ml-6 text-base text-black font-medium bg-white hover:bg-gray-200 p-2 px-4 rounded-md"
                        >
                            Logout
                        </button>
                    </>

                }
            </div>
        </div>
    );
}
