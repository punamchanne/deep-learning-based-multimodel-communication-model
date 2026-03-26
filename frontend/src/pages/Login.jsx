import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
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
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 border-r border-slate-200 dark:border-slate-800">
        <img 
            src="/images/auth_bg.png" 
            alt="Communication Technology" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-brand-900/60 to-transparent"></div>
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          <Link to="/" className="inline-flex items-center gap-3 w-fit group">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:scale-110 transition-transform">
               <Eye className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">GazeSense</span>
          </Link>
          
          <div className="mb-20">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Empowering your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                voice through vision
              </span>.
            </h1>
            <p className="text-lg text-brand-100 max-w-lg leading-relaxed font-light">
              Log in to continue accessing your custom communication dashboard, tailored specific phrases, and real-time inference tools.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-white dark:bg-slate-900 shadow-2xl lg:shadow-none">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden inline-flex justify-center mb-6">
              <Link to="/">
                <Eye className="w-12 h-12 text-brand-500" />
              </Link>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 hover:underline transition-all">
                Sign up today
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
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
                  placeholder="Password"
                />
              </div>
              
              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-md font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log in to Dashboard'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
