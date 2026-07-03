import React from 'react'
import { useDispatch } from 'react-redux'
import { loginUser, logoutUser } from '../../api/auth.api'
import { logout } from '../../store/authSlice'

const LogoutBtn = () => {
    const dispatch = useDispatch();
    const logoutHandler = () =>{
        logoutUser().then(()=>{
            dispatch(logout());
        })
    }
  return (
     <button
        onClick={logoutHandler}
        className="px-5 py-2 text-sm font-medium text-white transition-all duration-300 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5"
    >
            Logout
    </button>
  )
}

export default LogoutBtn
