import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 mb-6">
          Organize Your Life, <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-green-500">One Task at a Time</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-500 mb-10">
          A simple yet powerful task management application that helps users stay productive and manage daily goals efficiently.
        </p>
        <div className="flex space-x-4">
          <button
          onClick={()=> navigate('/signup')}
           className="px-8 py-3 text-base font-semibold text-white transition-all duration-300 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-1">
            Get Started
          </button>
          <button
          onClick={()=> navigate('/login')}
           className="px-8 py-3 text-base font-semibold text-gray-700 transition-all duration-300 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white/80 hover:shadow-md">
            Login
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;