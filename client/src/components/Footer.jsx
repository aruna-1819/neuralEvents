import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { 
  Send,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscription Successful! Welcome to the NeuralEvents circle.');
    setEmail('');
  };

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f] pt-16 pb-8 relative overflow-hidden">
      
      {/* Subtle neon glowing accent background vectors */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo, address, socials */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed">
              “The ultimate futuristic event booking platform for concerts, tech conferences, college fests, and premium live experiences across Hyderabad.”
            </p>
            
            <div className="space-y-3.5 text-xs text-gray-400 font-medium">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Gowlidoddy, Financial District,<br />
                  Hyderabad, Telangana 500075,<br />
                  India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-primary flex-shrink-0" />
                <a href="mailto:support@neuralevents.in" className="hover:text-primary transition-colors">support@neuralevents.in</a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/></svg>
              </a>
              {/* X / Twitter */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
                title="Twitter/X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/events" className="hover:text-primary transition-colors">Browse Events</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Our Company</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">User Dashboard</Link></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Stay Tuned</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Receive smart alerts and exclusive VIP ticket drops straight to your email.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-xs text-white flex-1 min-w-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="p-3 bg-primary hover:bg-primary/80 rounded-xl text-white transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs text-gray-500 font-mono">
          <p>&copy; {new Date().getFullYear()} NeuralEvents Corp. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
