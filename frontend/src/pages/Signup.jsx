import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, Loader2, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }
      
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-brand-500 selection:text-white">
      {/* Left Pane: Image & Branding (Hidden on Small Screens) */}
      <div className="hidden lg:flex flex-col lg:w-1/2 relative bg-brand-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
        <img 
            src="/images/auth_bg.png" 
            alt="Communication Technology" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-brand-900/60 to-transparent"></div>
        
        <div className="relative z-10 w-full h-full p-16 flex flex-col justify-between">
          <Link to="/" className="inline-flex items-center gap-3 w-fit group">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:scale-110 transition-transform">
               <Eye className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">GazeSense</span>
          </Link>
          
          <div className="mb-20">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6 mt-auto">
              Unlock a new <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                realm of freedom
              </span>.
            </h1>
            <p className="text-lg text-brand-100 max-w-lg leading-relaxed font-light mb-8">
              Join thousands of users who have regained their voice. Setup is completely free, runs locally in your browser, and takes less than a minute.
            </p>
            
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-brand-900"></div>
                 <div className="w-10 h-10 rounded-full bg-slate-500 border-2 border-brand-900"></div>
                 <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-brand-900"></div>
              </div>
              <div className="flex flex-col justify-center">
                 <div className="text-white text-sm font-bold">Over 1,000+</div>
                   <div className="text-brand-300 text-xs">Active communicators</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-white dark:bg-slate-900 shadow-2xl lg:shadow-none">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden inline-flex justify-center mb-6">
              <Link to="/">
                <Eye className="w-12 h-12 text-brand-500" />
              </Link>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 hover:underline transition-all">
                Log in here
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                  placeholder="Full Name"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                  placeholder="Email address"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                   <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                  placeholder="Password (minimum 6 characters)"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-md font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
               By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
