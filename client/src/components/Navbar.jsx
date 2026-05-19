import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15 }} 
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Logo size="md" />
            </motion.div>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/events" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Browse Events</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About Us</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Contact Us</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium">
                  <User size={16} /> {user.name}
                </Link>
                <button onClick={logout} className="text-red-400 hover:text-red-300 flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all text-sm font-medium">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.5)] text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
