import React, {useRef} from "react";
import { LogoutBtn } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import { uploadAvatar } from "../api/auth.api";
import { setTempAvatarUrl } from "../store/authSlice";

const ProfilePage = () => {
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  console.log(userData);
  const ppurl = userData?.avatar;

  const handleTriggerFilePicker = () => {
    if(fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const localBlobUrl = URL.createObjectURL(file);

      dispatch(setTempAvatarUrl(localBlobUrl));
      navigate('/change-profile-pic');
    }
  };

  return (
    <div style={{ transform: 'translateZ(0)' }} className="  fixed inset-0 z-100 isolate flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-md transition-opacity">
         <div className="relative flex flex-col items-center w-full max-w-lg bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 overflow-hidden">

          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4 bg-linear-to-b z-10">
          <button 
            onClick={()=> navigate('/')}
          type="button"
          className=" group flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/20 text-black backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
        <div className="relative inline-block mb-4">
          {userData?.avatar ? (
            <img
              onClick={()=> navigate('/profile-pic')}
             src={userData?.avatar}
              alt="Avatar" className="w-28 h-28 cursor-pointer rounded-full border-4 border-white shadow-lg object-cover" />
          ) : (
              <Avatar name={userData?.full_name} size={100} className={`w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover`}/>
          )}
          <button
          type="button"
          onClick={handleTriggerFilePicker}
           className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
            📷
          </button>
        </div>

        <input type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        />
        
        {/* Inline Edit Rows */}
        <div className="space-y-4 max-w-sm mx-auto mt-6">
          <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-gray-100">
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">{userData?.full_name}</p>
            </div>
            {/* <button className="text-gray-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
              ✏️
            </button> */}
          </div>

          <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-gray-100">
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
              <p className="text-lg font-semibold text-gray-800">{userData?.email}</p>
            </div>
            {/* <button className="text-gray-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
              ✏️
            </button> */}
          </div>
        <LogoutBtn />
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;