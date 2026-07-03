import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTempAvatarUrl } from '../store/authSlice';

const ProfilePic = ({ ppurl }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (e) => {
        console.log("e target", e.target);
        const file = e.target.files[0];
        if(file){
            const localUrl = URL.createObjectURL(file);
            dispatch(setTempAvatarUrl(localUrl));
            navigate(`/change-profile-pic`)
        }
    }

    const handleCancelCrop = () => {
        setSelectedImage(null);
    }
  return (
    /* Full-screen Dark backdrop with intense glassmorphism blur */
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in select-none">
      
      {/* Top Floating Utility Bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4 bg-linear-to-b from-black/60 to-transparent z-10">
        
        {/* Back Button (Top Left) */}
        <button 
            onClick={()=> navigate('/profile')}
          type="button"
          className="group flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Edit/Upload Button (Top Right) */}
        <label 
          className="group flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          htmlFor="profile-upload"
        >
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          {/* Hidden input field for picture selection */}
          <input 
            type="file" 
            id="profile-upload" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Main Responsive Frame Container */}
      <div className="w-full max-w-4xl px-4 md:px-8 flex items-center justify-center h-full max-h-[80vh]">
        <div className="relative group overflow-hidden rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-neutral-800/40 bg-neutral-900/50">
          <img
            src={ppurl || "/api/placeholder/600/600"}
            alt="Profile Preview"
            /* object-contain ensures the image fits any phone, tablet, or desktop viewport 
               smoothly without cutting off edges, while max-h limits full vertical bloat.
            */
            className="w-full max-w-full max-h-[70vh] md:max-h-[75vh] object-contain pointer-events-none transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>
      </div>
      
    </div>
  );
};

export default ProfilePic;