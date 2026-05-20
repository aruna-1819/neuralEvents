import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Search, Star, Flame, Heart, ChevronRight, ChevronLeft, Zap, Music, Code, Laugh, Utensils, Trophy, Users, Ticket, TrendingUp, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useWishlist } from '../context/WishlistContext';
import { mockEvents } from '../data/mockEvents';

const EventCardImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80";
  return (
    <div className="relative h-48 w-full overflow-hidden bg-[#101017] rounded-t-2xl">
      {!loaded && !error && <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.08] to-white/[0.02] animate-pulse" />}
      <img src={error ? fallback : src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
    </div>
  );
};

const STATS = [
  { icon: Users, value: '25K+', label: 'Happy Users', color: 'from-violet-500 to-purple-600' },
  { icon: Ticket, value: '500+', label: 'Live Events', color: 'from-cyan-500 to-blue-600' },
  { icon: Star, value: '4.9★', label: 'Avg Rating', color: 'from-amber-500 to-orange-600' },
  { icon: TrendingUp, value: '100K+', label: 'Tickets Sold', color: 'from-pink-500 to-rose-600' },
];

const CATEGORIES = [
  { label: 'Concerts', icon: Music, grad: 'from-fuchsia-500 to-pink-600', glow: 'rgba(236,72,153,0.55)', border: 'hover:border-pink-500/50', bg: 'from-fuchsia-900/30 to-pink-900/20', filter: 'Music' },
  { label: 'Tech Events', icon: Code, grad: 'from-cyan-400 to-blue-600', glow: 'rgba(6,182,212,0.55)', border: 'hover:border-cyan-400/50', bg: 'from-cyan-900/30 to-blue-900/20', filter: 'Tech' },
  { label: 'DJ Nights', icon: Zap, grad: 'from-violet-500 to-purple-700', glow: 'rgba(139,92,246,0.55)', border: 'hover:border-violet-500/50', bg: 'from-violet-900/30 to-purple-900/20', filter: 'DJ' },
  { label: 'Comedy', icon: Laugh, grad: 'from-amber-400 to-orange-500', glow: 'rgba(251,146,60,0.55)', border: 'hover:border-orange-400/50', bg: 'from-amber-900/30 to-orange-900/20', filter: 'Comedy' },
  { label: 'Food Fests', icon: Utensils, grad: 'from-emerald-400 to-green-600', glow: 'rgba(52,211,153,0.55)', border: 'hover:border-emerald-400/50', bg: 'from-emerald-900/30 to-green-900/20', filter: 'Food' },
  { label: 'Sports', icon: Trophy, grad: 'from-red-500 to-rose-600', glow: 'rgba(239,68,68,0.55)', border: 'hover:border-red-500/50', bg: 'from-red-900/30 to-rose-900/20', filter: 'Sports' },
];

const TESTIMONIALS = [
  { name: 'Ananya Sharma', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', rating: 5, text: 'Best event platform in Hyderabad! Booked 3 concerts here and the QR ticket system is flawless.' },
  { name: 'Rohan Verma', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', rating: 5, text: 'Ultra premium UI. Feels like a million-dollar app. Booking was done in under 60 seconds!' },
  { name: 'Priya Reddy', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', rating: 5, text: 'The dashboard is beautiful and upcoming events section keeps me organized. Love it!' },
  { name: 'Karthik Rao', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150', rating: 5, text: 'Attended the AI Summit and HackHyd through NeuralEvents. Seamless from booking to check-in.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState('All');
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const trendRef = useRef(null);
  const musicRef = useRef(null);
  const techRef = useRef(null);

  const handleSelectSuggestion = (evt) => {
    setIsNavigating(true);
    setShowSuggestions(false);
    setSearch(evt.title);
    setDebouncedSearch(evt.title);
    
    setTimeout(() => {
      navigate(`/event/${evt._id}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setIsNavigating(false);
    }, 850);
  };

  // Debouncing effect
  useEffect(() => {
    if (search.trim() !== debouncedSearch.trim()) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Click outside suggestions
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#hero-search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Suggestions computation
  const suggestions = events.filter(e => {
    if (!search.trim()) return false;
    const q = search.toLowerCase();
    return (
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.organizer && e.organizer.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/events');
        setEvents(data.length > 2 ? data : mockEvents);
      } catch { setEvents(mockEvents); }
    };
    fetch();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const scroll = (ref, dir) => ref.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });

  const handleToggleWish = (e, event) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    toggleWishlist(event); 
  };

  const trending = events.filter(e => e && typeof e.rating === 'number' && e.rating >= 4.8).slice(0, 8);
  const music = events.filter(e => e && typeof e.category === 'string' && (e.category.toLowerCase().includes('music') || e.category.toLowerCase().includes('dj'))).slice(0, 8);
  const tech = events.filter(e => e && typeof e.category === 'string' && (e.category.toLowerCase().includes('tech') || e.category.toLowerCase().includes('hackathon'))).slice(0, 8);

  const filtered = events.filter(e => {
    if (!e) return false;
    const q = debouncedSearch.toLowerCase();
    const titleMatch = typeof e.title === 'string' ? e.title.toLowerCase().includes(q) : false;
    const catMatch = typeof e.category === 'string' ? e.category.toLowerCase().includes(q) : false;
    const venueMatch = typeof e.venue === 'string' ? e.venue.toLowerCase().includes(q) : false;
    const locMatch = typeof e.location === 'string' ? e.location.toLowerCase().includes(q) : false;
    const orgMatch = typeof e.organizer === 'string' ? e.organizer.toLowerCase().includes(q) : false;
    const matchSearch = !q || titleMatch || catMatch || venueMatch || locMatch || orgMatch;
    
    const matchCat = activeCategory === 'All' || (typeof e.category === 'string' && e.category.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchSearch && matchCat;
  });

  const formatDate = (dateStr, formatStr) => {
    try {
      if (!dateStr) return 'Date TBA';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Date TBA';
      return format(d, formatStr);
    } catch {
      return 'Date TBA';
    }
  };

  const Card = ({ event, idx }) => {
    if (!event) return null;
    const price = event.price === 0 ? 'FREE' : `₹${(event.price || 0).toLocaleString('en-IN')}`;
    const wished = isWishlisted(event._id);
    const categoryText = (event.category || '').split(' ')[0] || 'Event';
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: (idx % 4) * 0.07 }} key={event._id}
        className="flex-shrink-0 w-72 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 bg-[#0e0e16] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 relative flex flex-col">
        <Link to={`/events/${event._id}`}>
          <EventCardImage src={event.banner} alt={event.title} />
          <div className="absolute top-3 left-3">
            <span className="bg-primary/90 backdrop-blur text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              {categoryText}
            </span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={e => handleToggleWish(e, event)} 
            className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur rounded-full border border-white/10 hover:border-red-500/50 hover:bg-black/80 transition-all cursor-pointer group/heart">
            <Heart 
              size={13} 
              className={`transition-colors duration-300 ${wished ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-white group-hover/heart:text-red-400'}`} 
            />
          </motion.button>
          <div className="absolute bottom-[7.5rem] right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur border border-white/10 text-xs font-bold text-white">
            {price}
          </div>
          <div className="p-4 space-y-2 flex-1">
            <div className="flex items-center gap-1 text-[10px] text-primary font-bold font-mono">
              <Star size={10} className="fill-primary" /> {event.rating || 0} • {event.location || 'TBA'}
            </div>
            <h3 className="text-sm font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">{event.title || 'Untitled Event'}</h3>
            <div className="pt-2 border-t border-white/5 space-y-1.5 text-gray-500 text-[10px] font-medium">
              <div className="flex items-center gap-1.5"><Calendar size={10} className="text-secondary" />{formatDate(event.date, 'MMM dd, yyyy • h:mm a')}</div>
              <div className="flex items-center gap-1.5"><MapPin size={10} className="text-secondary" /><span className="line-clamp-1">{event.venue || 'TBA'}</span></div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  const ScrollRow = ({ label, desc, evts, refEl }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">{label}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(refEl, 'left')} className="p-2 bg-white/5 border border-white/10 hover:bg-primary/10 rounded-xl transition-all cursor-pointer"><ChevronLeft size={14} /></button>
          <button onClick={() => scroll(refEl, 'right')} className="p-2 bg-white/5 border border-white/10 hover:bg-primary/10 rounded-xl transition-all cursor-pointer"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div ref={refEl} className="flex gap-5 overflow-x-auto no-scrollbar py-2 scroll-smooth">
        {evts.map((ev, i) => <Card event={ev} idx={i} key={ev._id} />)}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#07070f] overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920')] bg-cover bg-center opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07070f] via-transparent to-[#07070f]" />
        </div>
        {/* Orbs */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-cyan-700/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-bold text-primary">
            <Flame size={12} className="animate-pulse" /> 50+ Live Events Happening Across Hyderabad
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-black leading-[1.02] tracking-tighter">
            Experience The
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
              Future of Events
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Book concerts, tech conferences, college fests, and premium experiences across Hyderabad. Secured by digital QR tickets.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-xl mx-auto relative group animate-glow" id="hero-search-container">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-2xl blur opacity-25 group-focus-within:opacity-60 transition-opacity pointer-events-none" />
            <div className="relative flex items-center bg-[#10101a] border border-white/10 rounded-2xl px-4 py-3.5 gap-3">
              <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search events, artists, venues..." 
                value={search} 
                onChange={e => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                  setFocusedSuggestionIndex(-1);
                }}
                onFocus={() => {
                  setShowSuggestions(true);
                  setFocusedSuggestionIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setFocusedSuggestionIndex((prev) => 
                      prev < suggestions.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setFocusedSuggestionIndex((prev) => (prev > -1 ? prev - 1 : -1));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < suggestions.length) {
                      handleSelectSuggestion(suggestions[focusedSuggestionIndex]);
                    } else if (suggestions.length > 0) {
                      handleSelectSuggestion(suggestions[0]);
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                className="flex-grow bg-transparent border-0 focus:outline-none text-white text-sm placeholder:text-gray-600 pr-8" 
              />
              
              {/* Search Loader & Reset */}
              <div className="absolute right-4 top-3.5 flex items-center gap-1.5 z-10">
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : search ? (
                  <button 
                    onClick={() => {
                      setSearch('');
                      setDebouncedSearch('');
                      setFocusedSuggestionIndex(-1);
                    }} 
                    className="text-gray-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && search.trim() && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-[#0e0e16]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden text-left"
                >
                  {suggestions.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 mb-1">Suggestions</div>
                      {suggestions.map((evt, idx) => (
                        <button
                          key={evt._id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSuggestion(evt);
                          }}
                          onClick={() => handleSelectSuggestion(evt)}
                          onMouseEnter={() => setFocusedSuggestionIndex(idx)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-3 cursor-pointer group ${
                            idx === focusedSuggestionIndex 
                              ? 'bg-primary/25 border-l-2 border-primary pl-4' 
                              : 'hover:bg-primary/10'
                          }`}
                        >
                          <img src={evt.banner} alt={evt.title} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="flex-grow min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{evt.title}</div>
                            <div className="text-[9px] text-gray-400 truncate">{evt.category} • {evt.location}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No suggestions found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4 justify-center">
            <Link to="/events"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-105">
              Explore Events <ArrowRight size={16} />
            </Link>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 hover:border-primary/30 transition-all backdrop-blur">
              Book Tickets
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 border-y border-white/5 bg-[#0a0a12]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-white/5 text-center hover:border-primary/20 transition-all group">
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="text-2xl font-black text-white font-display">{value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-display font-extrabold text-white">Browse By <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Category</span></h2>
          <p className="text-gray-500 text-sm mt-2">Tap any category to discover events</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES.map(({ label, icon: Icon, grad, glow, border, bg, filter }, i) => {
            const isActive = activeCategory === filter;
            return (
              <motion.button key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(isActive ? 'All' : filter)}
                style={isActive ? { boxShadow: `0 0 24px ${glow}` } : {}}
                className={`relative flex flex-col items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                  bg-gradient-to-br ${bg}
                  ${isActive ? `border-transparent ring-2 ring-offset-0` : `border-white/8 ${border}`}`}>

                {/* Glow pulse on active */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${bg} opacity-60 blur-sm`} />
                )}

                {/* Icon with glow halo */}
                <div className="relative z-10">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${grad} opacity-40 blur-[12px] scale-110 group-hover:opacity-70 transition-opacity`} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-xl`}
                    style={{ boxShadow: `0 4px 20px ${glow}` }}>
                    <Icon size={24} className="text-white drop-shadow-lg" />
                  </div>
                </div>

                <span className="relative z-10 text-xs font-bold text-white tracking-wide">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ─── EVENT SECTIONS ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16">
        <AnimatePresence mode="wait">
          {search.trim() !== '' || debouncedSearch.trim() !== '' || activeCategory !== 'All' ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Found <span className="text-primary">{filtered.length}</span> events</h2>
                <button onClick={() => { setSearch(''); setDebouncedSearch(''); setActiveCategory('All'); }} className="text-xs text-gray-500 hover:text-primary font-bold cursor-pointer transition-colors">Clear Filters ×</button>
              </div>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filtered.map((ev, i) => <Card event={ev} idx={i} key={ev._id} />)}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 glass-panel border border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-2">
                    <Search size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No matching events found</h3>
                  <p className="text-gray-400 text-xs max-w-sm mx-auto">We couldn't find any events matching your keywords or selected category. Try different search terms or clear filters.</p>
                  <button onClick={() => { setSearch(''); setDebouncedSearch(''); setActiveCategory('All'); }} className="mt-4 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer">Clear Search & Filters</button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
              <ScrollRow label="🔥 Trending Events" desc="Top-rated live shows with highest demand across Hyderabad" evts={trending} refEl={trendRef} />
              <ScrollRow label="🎵 Music & DJ Nights" desc="Electrifying concerts, rave parties, and live performances" evts={music} refEl={musicRef} />
              <ScrollRow label="🚀 Tech & Hackathons" desc="AI summits, coding sprints, and startup meetups at T-Hub" evts={tech} refEl={techRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-[#0a0a12] border-y border-white/5 relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-extrabold text-white">Loved By <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Thousands</span></h2>
            <p className="text-gray-500 text-sm mt-2">Real reviews from our event community</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={testimonialIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e0e18] to-[#12102a] shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-primary/30">
                <img src={TESTIMONIALS[testimonialIdx].img} alt={TESTIMONIALS[testimonialIdx].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
              </div>
              <p className="text-gray-300 text-base italic leading-relaxed max-w-lg mx-auto">"{TESTIMONIALS[testimonialIdx].text}"</p>
              <p className="text-primary font-bold text-sm mt-4">{TESTIMONIALS[testimonialIdx].name}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === testimonialIdx ? 'bg-primary w-6' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-primary/20 p-12 text-center bg-gradient-to-br from-[#0f0d1f] via-[#130e28] to-[#0c0a1a] shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200')] bg-cover bg-center opacity-[0.06]" />
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyan-600/15 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white leading-tight">
              Ready to experience<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">something unforgettable?</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">Join 25,000+ event lovers booking premium experiences across Hyderabad every month.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/events" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:opacity-90 transition-all shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:scale-105">
                Browse All Events <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                Create Free Account
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Dynamic Cybernetic Redirection Overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center space-y-6 max-w-sm px-6 py-8 rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_0_50px_rgba(139,92,246,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10 pointer-events-none" />
              
              {/* Spinner */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-cyan-500/10 border-b-cyan-400 animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
                <div className="absolute inset-4 rounded-full bg-[#0a0a0f] flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-display font-black tracking-wider text-white uppercase">Redirecting to Node</h3>
                <p className="text-gray-400 text-[11px] font-mono tracking-widest uppercase animate-pulse">Syncing Event Coordinates...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Home;
