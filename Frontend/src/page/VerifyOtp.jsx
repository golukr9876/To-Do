import React, { useRef, useState } from "react";
import { verifyEmail } from "../api/auth.api";
import { useDispatch } from 'react-redux';
import { login } from "../store/authSlice";
import { useNavigate, useParams } from "react-router-dom";

function VerifyOtp() {
  const {slug} = useParams();


  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if(isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); //take only the last value (if user type multiple value in a box)
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    console.log('input ref', inputRefs);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handleVerify =  async (e) => {
    e.preventDefault();
    const finalCode = otp.join("");
    if(finalCode.length === 6){
      try {
        const response = await verifyEmail({email:slug, otp:finalCode});
        console.log(response);
        dispatch(login({userData: response.data}));
        navigate('/');
      } catch (error) {
        setError(error.message);
      }
        
    }
    else{
      console.log("otpp... : ",finalCode);
      setError("Please enter a complete otp");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-[80vh] backdrop-blur-md bg-gray-400/30">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-2xl relative">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-base text-black/60">
            check your email for otp
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleVerify}>
          <div className="space-y-8">
            <div className="flex justify-between items-center gap-2 px-2">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  // Assign the reference to the inputRefs array
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-gray-50/50"
                  placeholder="-"
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-3 text-white font-semibold rounded-xl bg-linear-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 hover:opacity-90 transition-opacity"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
