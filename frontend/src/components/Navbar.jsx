import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Drawer from './Drawer'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { remove } from '../redux/userSlice'
import { jwtDecode } from 'jwt-decode'
import { Toaster } from 'sonner'

function Navbar() {
    const dispatch = useDispatch()
    const location = useLocation()
    const authorization = useSelector((state) => state.user.authorization)
    //console.log(authorization)

    let decoded;
    if (authorization !== '') {
        decoded = jwtDecode(authorization)
        //console.log(decoded)
    }

    const handleLogout = () => {
        dispatch(remove())
        localStorage.removeItem('authorization')
    }

    const getLinkClass = (path) => {
        return location.pathname === path
            ? 'text-purple-600 font-bold ' // Active link style
            : 'hover:text-purple-600'
    }


    return (
        
        <header className='z-20 sticky top-0 w-full flex justify-center bg-gray-200'>
            <nav className="w-full max-w-[1200px] navbar flex sm:flex-row flex-col justify-between items-start sm:items-center text-2xl p-3 h-[70px] text-white font-bold ">
                <div className=''>
                    <Link to="/" className='flex items-center gap-2 h-15 w-15'>
                        <img src="/logo.png" alt="Logo" />
                    </Link>
                </div>
                <div className='font-bold text-gray-600 links text-sm h-full sm:flex hidden items-center'>
                    <ul className='gap-3 flex'>
                        <li><Link to='/dashboard' className={getLinkClass('/dashboard')}>Dashboard</Link></li>
                        <li><Link to='/purchases' className={getLinkClass('/purchases')}>Purchases</Link></li>
                        <li><Link to='/about' className={getLinkClass('/about')}>About</Link></li>
                    </ul>


                </div>
                <div className="account sm:flex hidden items-center">

                    {authorization == '' ?
                        <>
                            <Link to='/login'>
                                <button
                                    className='cursor-pointer text-base bg-purple-600 hover:bg-purple-700 font-medium  p-2 px-4 rounded-md mx-3'
                                >
                                    Login
                                </button>
                            </Link>
                        </>
                        :
                        <>
                            <Link to='/profile'>
                                <div className="profile w-12 h-12 ">
                                    <img className='rounded-full border border-black' src={decoded?.picture || '/default-profile.png'} alt="Profile" />
                                    <p className='w-10 font-extrabold rounded-3xl text-xl text-yellow-200 transform -translate-y-[23px] translate-x-[5px] stroke'>{decoded.coins}</p>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='cursor-pointer text-base  bg-purple-600 hover:bg-purple-700 font-medium  p-2  rounded-md mx-3'
                            >
                                Logout
                            </button>
                        </>

                    }


                </div>
                <div className=" small-dd sm:hidden block">
                    <Drawer authorization={authorization} handleLogout={handleLogout} decoded={decoded} />
                </div>
            </nav>
            <Toaster/>
        </header>
    )
}

export default Navbar