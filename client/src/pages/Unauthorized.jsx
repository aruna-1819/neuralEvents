import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070f] relative overflow-hidden px-4">
      {/* Background cyber glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel max-w-lg w-full p-8 md:p-10 rounded-3xl border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center relative overflow-hidden"
      >
        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Animated warning beam */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[pulse_2s_infinite]" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
            className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <ShieldAlert size={42} className="animate-pulse" />
          </motion.div>

          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase mb-2">
            Access Denied
          </span>
          
          <h1 className="text-3xl font-display font-black text-white tracking-tight mb-4">
            Unauthorized <span className="text-red-500">Access</span>
          </h1>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
            This high-clearance neural node is reserved exclusively for system administrators. Your credentials do not grant access to `/admin` routes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link 
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all cursor-pointer"
            >
              <ArrowLeft size={16} /> Previous Page
            </Link>
            
            <Link 
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:scale-105 cursor-pointer"
            >
              <Home size={16} /> Go to Homepage
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
