import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


function Header() {
    const [isMobile, setMobile] = useState();
    const [searchTerm,setSearchTerm] = useState('');
    const navigate = useNavigate();

    
    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);  
        urlParams.set('searchTerm',searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])


    const handleMobile = () => {
        setMobile(!isMobile)
    }
    const { currentUser } = useSelector((state) => state.user);
    return (
        <motion.header className='bg-slate-950 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4 px-6'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-100'>Real</span>
                        <span className='text-slate-300'>State</span>
                    </h1>
                </Link>
                <form
                    onSubmit={handleSubmit}
                    className='bg-white p-3 rounded-lg flex items-center'
                >
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e)=>{setSearchTerm(e.target.value)}}
                    />
                    <button>
                        <FaSearch className=' text-slate-600' />
                    </button>
                </form>
                <IoMenu className='text-white text-[20px] max-sm:block hidden z-20'
                    onClick={handleMobile}

                />
                <ul className={`${isMobile ? "max-sm:top-0 opacity-1" : "max-sm:top-[-170px] max-sm:opacity-0"}  max-sm:absolute max-sm:text-center max-sm:p-[10px] max-sm:w-full left-0 top-0 max-sm:bg-slate-950  flex flex-col sm:flex-row gap-8 
                duration-300 ease-in-out
                
                `}>
                    <Link to='/' onClick={() => setMobile(false)}>
                        <li className='text-[18px] duration-75 ease-in-out   sm:inline text-white hover:text-gray-300'>
                            Home
                        </li>
                    </Link>
                    <Link to='/about' onClick={() => setMobile(false)}>
                        <li className='text-[18px] duration-75  ease-in   sm:inline text-white hover:text-gray-300'>
                            About
                        </li>
                    </Link>
                    {
                        currentUser ?
                            (<Link to='/profile' onClick={() => setMobile(false)}>
                                <img
                                    src={currentUser.avatar}
                                    className=' rounded-full h-7 w-7 object-cover'
                                    alt='profile'
                                />
                            </Link>) : (
                                <Link to='/sign-in' onClick={() => setMobile(false)}>
                                    <li className='text-[18px] duration-75 ease-in  sm:inline text-white hover:text-gray-300'> Sign in</li>
                                </Link>
                            )
                    }
                </ul>
            </div>
        </motion.header>
    )
}

export default Header