import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

const Navbar = ({ isAuth = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="p-1.5 sm:p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="font-bold text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-white">GazeSense</span>
          </Link>
          
          {/* Main Navigation Links (Hidden on mobile) */}
          {!isAuth && (
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
              <a href="/#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
              <a href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How it works</a>
              <a href="/#benefits" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Benefits</a>
              <a href="/#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About us</a>
            </div>
          )}
          
          {/* Auth/Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {isAuth ? (
              <button 
                onClick={handleLogout}
                className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
               >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-600 to-brand-500 text-white px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full hover:from-brand-500 hover:to-brand-400 transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5">
                  Registration
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
