import React from 'react'

const Container = ({ children }) => {
  
   return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-linear-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000"></div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}

export default Container
