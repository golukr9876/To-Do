import React, { useState } from 'react'
import { Logo, Container, LogoutBtn } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'


const Header = () => {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector(state => state.auth.userData)
    const navigate = useNavigate();
    console.log(userData);
    const ppurl = userData?.avatar;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-1 mt-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm">
        <Link to='/'>
            <Logo />
        </Link>
        {authStatus ?
            (
                <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-500 hover:text-emerald-600 transition-colors">
                    {/* Bell Icon Placeholder */}
                    🔔
                </button>
                <div 
                onClick={()=> navigate('/profile')}
                >
                    {ppurl ?(
                        <img
                        className='w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm cursor-pointer'
                         src={ppurl}/>
                    ) : (
                        <Avatar name={userData?.full_name} size={40} className={`w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer`}/>
                    )}
                    
                </div>
            </div>
            ) 
            :
        ( <div  className="flex items-center space-x-4">
                <button
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
                onClick={()=> navigate('/login')}
                >
                    Login
                </button>
                <button
                className="px-5 py-2 text-sm font-medium text-white transition-all duration-300 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5"
                onClick={()=> navigate('/signup')}
                >
                    Sign Up
                </button>
            </div>
            
        )
        }
      </header>
  )
}

export default Header
