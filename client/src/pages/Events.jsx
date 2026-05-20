import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  Filter, 
  X,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useWishlist } from '../context/WishlistContext';
import { mockEvents } from '../data/mockEvents';

const EventCardImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const fallbackImage = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="relative h-48 w-full overflow-hidden bg-[#101017] rounded-t-2xl">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.08] to-white/[0.02] animate-pulse" />
      )}
      <img
        src={error ? fallbackImage : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-95'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Advanced Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'priceAsc' | 'priceDesc' | 'rating'
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/events');
        setEvents(data.length > 2 ? data : mockEvents);
      } catch (error) {
        console.warn("Using offline mock events data:", error.message);
        setEvents(mockEvents);
      }
    };
    fetchEvents();
  }, []);

  // Debouncing effect
  useEffect(() => {
    if (searchTerm.trim() !== debouncedSearchTerm.trim()) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleToggleWish = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(event);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setMaxPrice(10000);
    setSortBy('date');
  };

  // Suggestions computation
  const suggestions = events.filter(e => {
    if (!searchTerm.trim()) return false;
    const q = searchTerm.toLowerCase();
    return (
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.organizer && e.organizer.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  // Filter & Sort Logic
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

  const getFilteredEvents = () => {
    let result = [...events];

    // Search query filter using debouncedSearchTerm
    if (debouncedSearchTerm.trim() !== '') {
      result = result.filter(e => {
        if (!e) return false;
        const q = debouncedSearchTerm.toLowerCase();
        const titleMatch = typeof e.title === 'string' ? e.title.toLowerCase().includes(q) : false;
        const catMatch = typeof e.category === 'string' ? e.category.toLowerCase().includes(q) : false;
        const venueMatch = typeof e.venue === 'string' ? e.venue.toLowerCase().includes(q) : false;
        const locMatch = typeof e.location === 'string' ? e.location.toLowerCase().includes(q) : false;
        const orgMatch = typeof e.organizer === 'string' ? e.organizer.toLowerCase().includes(q) : false;
        return titleMatch || catMatch || venueMatch || locMatch || orgMatch;
      });
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(e => e && e.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'All') {
      result = result.filter(e => e && e.location === selectedLocation);
    }

    // Price filter
    result = result.filter(e => e && typeof e.price === 'number' && e.price <= maxPrice);

    // Sorting logic
    if (sortBy === 'date') {
      result.sort((a, b) => {
        const da = a && a.date ? new Date(a.date).getTime() : 0;
        const db = b && b.date ? new Date(b.date).getTime() : 0;
        return da - db;
      });
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
    }

    return result;
  };

  const filteredEvents = getFilteredEvents();

  const categories = [
    'All', 'Music Concerts', 'DJ Nights', 'AI & Tech Events', 
    'Hackathons', 'Food Festivals', 'Fashion Shows', 'Gaming Tournaments', 
    'Cultural Events', 'Workshops', 'Sports Events', 'Stand-up Comedy Shows', 
    'Movie Premieres', 'Business Summits', 'Dance Competitions', 'Art Exhibitions', 'Photography Events'
  ];

  const locations = [
    'All', 'Gachibowli', 'Hitech City', 'Madhapur', 'Jubilee Hills', 
    'Kondapur', 'Financial District', 'Banjara Hills', 'Shilparamam', 
    'HITEX Exhibition Center', 'Necklace Road', 'Ramoji Film City'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight">
            Explore Live <span className="gradient-text">Hyderabad Events</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Discover, filter and book verified premium experiences instantly.</p>
        </div>
        
        {/* Reset filter trigger */}
        <button 
          onClick={resetFilters}
          className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-2 rounded-xl cursor-pointer"
        >
          <X size={12} /> Clear All Filters
        </button>
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FILTER SIDEBAR PANEL */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 shadow-md">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <Filter size={14} className="text-primary" /> Advanced Filters
            </h3>
            
            {/* Search Input inside sidebar */}
            <div className="space-y-2" id="search-container">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Keyword</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter keyword..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 focus:outline-none focus:border-primary text-xs text-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Search className="absolute left-3 top-3 text-gray-500 w-3.5 h-3.5" />
                
                {/* Search Loader & Reset */}
                <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                  {isSearching ? (
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : searchTerm ? (
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setDebouncedSearchTerm('');
                      }} 
                      className="text-gray-500 hover:text-white cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  ) : null}
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && searchTerm.trim() && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 bg-[#0e0e16]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      {suggestions.length > 0 ? (
                        <div className="p-2 space-y-1">
                          <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 mb-1">Suggestions</div>
                          {suggestions.map((evt) => (
                            <button
                              key={evt._id}
                              onClick={() => {
                                setSearchTerm(evt.title);
                                setDebouncedSearchTerm(evt.title);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-primary/10 rounded-xl transition-all duration-200 flex items-center gap-3 cursor-pointer group"
                            >
                              <img src={evt.banner} alt={evt.title} className="w-8 h-8 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
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
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Event Category</label>
              <select 
                className="w-full bg-[#101017] border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-xs text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Venue Location</label>
              <select 
                className="w-full bg-[#101017] border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-xs text-white"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Max Ticket Price</span>
                <span className="text-primary font-mono font-bold text-xs">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="100"
                className="w-full accent-primary bg-white/10 rounded-lg h-1.5 cursor-pointer"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="flex justify-between text-[8px] font-bold text-gray-600">
                <span>₹0 (Free)</span>
                <span>₹10,000 (VIP)</span>
              </div>
            </div>

            {/* Sorting Order */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown size={10} /> Sort Listings By
              </label>
              <select 
                className="w-full bg-[#101017] border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-xs text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date: Nearest first</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Popularity: Top Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: EVENTS RESULTS GRID */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">
              Found <span className="text-primary font-bold">{filteredEvents.length}</span> live events
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {filteredEvents.map((event, index) => {
                  if (!event) return null;
                  const formattedPrice = event.price === 0 ? 'FREE' : `₹${(event.price || 0).toLocaleString('en-IN')}`;
                  const categoryText = (event.category || '').split(' ')[0] || 'Event';

                  return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    key={event._id}
                    className="flex flex-col bg-[#0e0e16] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 group cursor-pointer"
                  >
                    <Link to={`/events/${event._id}`} className="flex flex-col h-full">
                      
                      {/* Image Container */}
                      <div className="relative">
                        <EventCardImage src={event.banner} alt={event.title || 'Event'} />
                        
                        {/* Category Tag */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                            {categoryText}
                          </span>
                        </div>
 
                          {/* Wishlist Button */}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleToggleWish(e, event)}
                            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 hover:border-red-500/50 rounded-full border border-white/10 backdrop-blur-md transition-all cursor-pointer group/heart"
                          >
                            <Heart 
                              size={12} 
                              className={`transition-colors duration-300 ${isWishlisted(event._id) ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-white group-hover/heart:text-red-400'}`} 
                            />
                          </motion.button>
                          {/* Price Tag */}
                          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg">
                            {formattedPrice}
                          </div>
                        </div>
 
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono font-bold">
                              <Star size={10} className="fill-primary" />
                              <span>{event.rating || 0} • {event.location || 'TBA'}</span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">
                              {event.title || 'Untitled Event'}
                            </h3>
                            
                            <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2">
                              {event.description || ''}
                            </p>
                          </div>
 
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-gray-500 text-[10px] font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar size={10} className="text-secondary" />
                              <span>{formatDate(event.date, 'MMM dd, yyyy • h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={10} className="text-secondary" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
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
                <p className="text-gray-400 text-xs max-w-sm mx-auto">We couldn't find any events matching your keywords or selected filters. Try broadening your criteria or reset your filters.</p>
                <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer">Clear Search & Filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
};

export default Events;
