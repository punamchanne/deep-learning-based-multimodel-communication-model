import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Eye, Zap, MessageSquare, ArrowRight, Video, Brain, Volume2, ShieldCheck, Heart, Globe, Github, Twitter, Linkedin } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-40 overflow-hidden min-h-[90vh] flex items-center">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/hero_bg.png" 
              alt="Background" 
              className="w-full h-full object-cover opacity-90 dark:opacity-40 object-center"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/95 to-slate-50 dark:from-slate-900/80 dark:via-slate-900/95 dark:to-slate-900 backdrop-blur-sm"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium text-sm mb-8 border border-brand-100 dark:border-brand-500/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                GazeSense v1.0 is Live
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
                Communication through <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-500 drop-shadow-sm">
                  intentional gaze
                </span>.
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
                An advanced assistive technology platform enabling individuals with speech or motor impairments to communicate effortlessly using just their eyes and facial movements.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
                <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-brand-500/30 transition-all hover:-translate-y-1 group">
                  Start Communicating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-slate-700 transition-all hover:shadow-lg">
                  See how it works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-brand-600 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">Core Capabilities</h2>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Empowering Features</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to communicate smoothly without using a keyboard or mouse.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Eye className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <Eye className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-4 dark:text-white group-hover:text-brand-500 transition-colors">Precision Eye Tracking</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Industry-leading MediaPipe Face Mesh integration accurately detects gaze direction and intentional blinking directly in your browser.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <Zap className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-4 dark:text-white group-hover:text-blue-500 transition-colors">Real-time Performance</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Powered by persistent WebSockets, providing ultra-low lag streaming and instant, frictionless feedback from the AI engine.</p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-4 dark:text-white group-hover:text-purple-500 transition-colors">Speech Generation</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Generate audible speech from your eye movements seamlessly, utilizing browser native synthesis technologies for immediate communication.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 bg-white dark:bg-slate-800/30 border-y border-slate-100 dark:border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide uppercase text-sm mb-3">The Workflow</h2>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">How GazeSense Works</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">Three simple steps to transform your vision into voice.</p>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-100 via-brand-200 to-brand-100 dark:from-emerald-900 dark:via-brand-900 dark:to-brand-900 z-0"></div>
              
              <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {/* Step 1 */}
                <div className="text-center relative">
                  <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 border-4 border-emerald-100 dark:border-emerald-900 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
                    <Video className="w-10 h-10 text-emerald-500" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 font-bold bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">1</div>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 dark:text-white">Enable Webcam</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Simply allow camera access. The system instantly detects your facial landmarks without any physical setup.</p>
                </div>

                {/* Step 2 */}
                <div className="text-center relative">
                  <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 border-4 border-brand-100 dark:border-brand-900 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
                    <Brain className="w-10 h-10 text-brand-500" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 font-bold bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg">2</div>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 dark:text-white">AI Processing</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Machine learning algorithms analyze your gaze direction and blinking patterns in real-time securely.</p>
                </div>

                {/* Step 3 */}
                <div className="text-center relative">
                  <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 border-4 border-cyan-100 dark:border-cyan-900 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
                    <Volume2 className="w-10 h-10 text-cyan-500" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 font-bold bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg">3</div>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 dark:text-white">Speak to the World</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your actions map to words or actions, which are immediately spoken aloud by the browser's native speech engine.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section id="benefits" className="py-24 bg-slate-50 dark:bg-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-brand-600 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">Why GazeSense</h2>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">Giving everyone the power to connect.</h3>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold dark:text-white mb-2">Absolute Privacy</h4>
                      <p className="text-slate-600 dark:text-slate-400">All facial data forms are processed and discarded locally. No imagery is ever stored on our servers.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold dark:text-white mb-2">Zero Additional Hardware</h4>
                      <p className="text-slate-600 dark:text-slate-400">Instead of thousand-dollar eye trackers, GazeSense works on any standard laptop or desktop webcam.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold dark:text-white mb-2">Use Anywhere</h4>
                      <p className="text-slate-600 dark:text-slate-400">Works directly in your modern web browser. No complex installations or maintenance required.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Benefit Image or Block */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-emerald-500 transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-20 blur-2xl"></div>
                <div className="relative bg-white dark:bg-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Live Dashboard</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl h-80 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700/50 p-6 text-center">
                    <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Eye className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold text-xl mb-2">"Hello world!"</p>
                    <p className="text-emerald-500 text-sm font-medium">Message spoken successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="py-24 bg-brand-900 relative overflow-hidden text-white">
          <div className="absolute inset-0 z-0 opacity-20 pattern-grid-lg">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-brand-900"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-emerald-400 font-semibold tracking-wide uppercase text-sm mb-3">Our Mission</h2>
            <h3 className="text-4xl font-bold mb-8">About GazeSense</h3>
            <p className="text-xl text-brand-100 leading-relaxed mb-10 text-justify sm:text-center">
              We believe that the ability to express oneself is a fundamental human right. However, for individuals living with conditions like ALS, severe cerebral palsy, or spinal cord injuries, traditional communication can be an insurmountable barrier. 
              <br/><br/>
              GazeSense was founded with a singular purpose: to democratize assistive technology. By leveraging accessible web technologies and state-of-the-art computer vision models, we are tearing down the walled gardens of expensive hardware, providing a free, frictionless communication pipeline for those who need it most.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-brand-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-1">
              Join the Movement
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Eye className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">GazeSense</span>
            </div>
            
            <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How it works</a>
              <a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-700 dark:hover:text-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} GazeSense Analytics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
