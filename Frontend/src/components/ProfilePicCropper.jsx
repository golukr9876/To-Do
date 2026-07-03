import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearTempAvatarUrl, updateAvatarSuccess } from '../store/authSlice';
import { uploadAvatar } from '../api/auth.api';

const ProfilePicCropper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tempAvatarUrl = useSelector(state => state.auth.tempAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);



  //transformation states 
  const [scale, setScale] = useState(1.1);
  const [position, setPosition] = useState({x: 0, y: 0});

  const isDragging = useRef(false);
  const startPanCoords = useRef({x: 0, y: 0, initialY: 0});
  const multiTouchRef = useRef({initialDistance: 0, initialScale: 1});

  const handlePointerDown = (e) => {
    if(e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging.current = true;
    startPanCoords.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: position.x,
      initialY: position.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  }


  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    // Safety check: skip if mobile is currently pinch-zooming with 2 fingers
    if (e.pointerType === 'touch' && multiTouchRef.current.initialDistance > 0) return;

    const deltaX = e.clientX - startPanCoords.current.x;
    const deltaY = e.clientY - startPanCoords.current.y;

    setPosition({
      x: startPanCoords.current.initialX + deltaX,
      y: startPanCoords.current.initialY + deltaY,
    });
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
  };

  // --- MOBILE 2-FINGER PINCH TO ZOOM LOGIC ---
  const calculateDistance = (touch1, touch2) => {
    return Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = calculateDistance(e.touches[0], e.touches[1]);
      multiTouchRef.current = {
        initialDistance: distance,
        initialScale: scale,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && multiTouchRef.current.initialDistance > 0) {
      const currentDistance = calculateDistance(e.touches[0], e.touches[1]);
      const factor = currentDistance / multiTouchRef.current.initialDistance;
      
      // Dynamic scaling bounded smoothly between 1x and 3x zoom
      const newScale = Math.min(Math.max(multiTouchRef.current.initialScale * factor, 1), 3);
      setScale(Number(newScale.toFixed(2)));
    }
  };

  const handleTouchEnd = () => {
    multiTouchRef.current.initialDistance = 0;
  };


  const handleWheelZoom = (e) => {
    const zoomIntensity = 0.05;
    const adjustFactor = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
    const newScale = Math.min(Math.max(scale * adjustFactor, 1), 3);
    setScale(Number(newScale.toFixed(2)));
  };


  if(!tempAvatarUrl){
    navigate('/profile');
    return null;
  }
  const handleCancel = () => {
    dispatch(clearTempAvatarUrl());
    navigate('/profile');
  }

  const handleConfirmAndUpload = async () => {
    try{
      setIsUploading(true);
      const response = await fetch(tempAvatarUrl);
      const imageBlob = await response.blob();
      console.log("image blob : ", imageBlob)

      const formData = new FormData();
      formData.append("avatar", imageBlob);

      const apiResponse = await uploadAvatar(formData);
      console.log("response", apiResponse);
      dispatch(updateAvatarSuccess(apiResponse.data.avatar));
      navigate('/profile');

    } catch(error){
      setError(error);
      console.log("while changing avatar", error);
    }finally{
      setIsUploading(false);
    }
  }
  return (
    /* Full-screen immersive layout with high-depth glassmorphism blurring */
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-neutral-950/95 backdrop-blur-xl select-none animate-fade-in">
      
      {/* Top Floating Action Bar */}
      <header className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20">
        {/* Title Indicator */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold tracking-wide text-white">Edit Profile Photo</span>
          <span className="text-xs text-neutral-400">Drag to re-center or crop</span>
        </div>

        {/* Action Controls Group (Top Right) */}
        <div className="flex items-center gap-3">
          {/* Cancel/Cross Button */}
          <button 
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
            aria-label="Cancel adjustment"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Confirm/Tick Button (Gradient Green Premium Accent) */}
          <button 
            type="button"
            onClick={handleConfirmAndUpload}
            disabled={isUploading}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-900/30 hover:brightness-110 border border-emerald-300/20 transition-all active:scale-95"
            aria-label="Save and Upload"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Interactive Workspace Container */}
      <div className="relative w-full max-w-lg aspect-square px-4 flex items-center justify-center">
        
        {/* The Frame viewport Window */}
        <div 
          className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden border-2 border-white/60 shadow-2xl flex items-center justify-center group cursor-move touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheelZoom}
        >
          
          {/* 1. Underlying Profile Picture to be cropped */}
          <img 
            src={tempAvatarUrl} 
            alt="Source Cropping Asset" 
            className="w-full h-full object-cover pointer-events-none transform"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging.current ? 'none' : 'transform 0.1s ease-out' // Smooth transitions for wheels/pinches
            }}
          />

          {/* 2. Infinite Dark Mask Ring (Darkens everything outside the circle like WhatsApp) */}
          <div className="absolute inset-0 pointer-events-none rounded-full shadow-[0_0_0_9999px_rgba(10,10,10,0.45)]"></div>

          {/* 3. Transparent 3x3 Dynamic Grid Matrix Overlaid Inside the Circle */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-60 group-hover:opacity-150 transition-opacity duration-300">
            {/* Grid Intersections Lines using subtle borders */}
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-white/20"></div>
            
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-white/20"></div>
            
            <div className="border-r border-white/20"></div>
            <div className="border-r border-white/20"></div>
            <div></div>
          </div>

        </div>
      </div>

      {/* Optional Scale/Zoom Precision Utility Track at the Bottom */}
      <div className="mt-8 flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-72 max-w-full">
        <span className="text-xs text-neutral-400">➖</span>
        <input 
          type="range" 
          min="1" 
          max="3" 
          step="0.01" 
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          defaultValue="1.1" 
          className="w-full accent-emerald-500 h-1 bg-neutral-800 rounded-lg cursor-pointer appearance-none"
        />
        <span className="text-xs text-neutral-400">➕</span>
      </div>

    </div>
  );
};

export default ProfilePicCropper;