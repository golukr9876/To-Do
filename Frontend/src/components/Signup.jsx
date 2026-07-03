import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCurrentUser, registerUser } from '../api/auth.api';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice';
import { useForm } from 'react-hook-form';
import {Input, Button} from './index';

const Signup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {handleSubmit, register} = useForm();
    const [loading , setLoading] = useState(false);

    const dispatch = useDispatch();

    const signup = async(data) => {
        setError("");
        try {
            setLoading(true);
            const session = await registerUser(data);
            console.log("signup payload", session);
            navigate(`/verify-otp/${session.data.email}`);
        } catch (error) {
            console.log("error : ", error)
            setError(error.message || "An unexpected error occured during Signup.");
        } finally {
            setLoading(false);
        }
    }
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-[80vh] backdrop-blur-md bg-gray-400/30">
       <div className="w-full max-w-md p-8 space-y-8 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-2xl relative">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
           <p className="mt-2 text-center text-base text-black/60">
                    already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Login
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(signup)}>
            <div className='space-y-2'>
                <Input
                label="Full Name: "
                placeholder="Enter your name"
                type="text"
                {...register("full_name", {
                    required: true
                })}
                />
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
                <Button
                type="submit"
                classname="w-full px-4 py-3 text-white font-semibold rounded-xl bg-linear-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Sign Up"}
                </Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
