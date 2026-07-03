import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {login as authLogin} from '../store/authSlice'
import {Logo, Input, Button} from './index'
import { useDispatch, useSelector } from 'react-redux';
import {useForm} from 'react-hook-form'
import { getCurrentUser, loginUser } from '../api/auth.api';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const login = async (data) =>{
        setError("");
        try{
            setLoading(true);

            const session = await loginUser(data);
            console.log("while loging: ", session.data);

            dispatch(authLogin({userData : session.data}));
            navigate('/');
            
        } catch(error){
            console.log("error : ", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }



    }
    
  return (
    //  <div className="flex items-center justify-center min-h-[80vh]">
    // <div className="fixed inset-0 z-50 flex items-center justify-center min-h-[80vh] backdrop-blur-md bg-gray-100/30">
    //   <div className="w-full max-w-md p-8 space-y-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-[80vh] backdrop-blur-md bg-gray-400/30">
       <div className="w-full max-w-md p-8 space-y-8 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-2xl relative">
         
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
           <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)}>
            <div className='space-y-2'>
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password:"
                type="Password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                {!loading ? (
                     <Button
                type="submit"
                classname="w-full px-4 py-3 text-white font-semibold rounded-xl bg-linear-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Login
                </Button>
                ) : (
                   <Button
                classname="w-full px-4 py-3 text-white font-semibold rounded-xl bg-linear-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Loading...
                </Button> 
                )}
               
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login
