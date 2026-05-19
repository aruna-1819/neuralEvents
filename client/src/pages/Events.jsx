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
  
  // Advanced Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'priceAsc' | 'priceDesc' | 'rating'
  const [wishlist, setWishlist] = useState({});

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

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setMaxPrice(10000);
    setSortBy('date');
  };

  // Filter & Sort Logic
  const getFilteredEvents = () => {
    let result = [...events];

    // Search query filter
    if (searchTerm.trim() !== '') {
      result = result.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'All') {
      result = result.filter(e => e.location === selectedLocation);
    }

    // Price filter
    result = result.filter(e => e.price <= maxPrice);

    // Sorting logic
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
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
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Keyword</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter keyword..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-primary text-xs text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 text-gray-500 w-3.5 h-3.5" />
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
                  const formattedPrice = event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString('en-IN')}`;
                  const isWishlisted = !!wishlist[event._id];

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25 }}
                      key={event._id} 
                      className="glass-panel rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/45 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all flex flex-col justify-between"
                    >
                      <Link to={`/events/${event._id}`}>
                        <EventCardImage src={event.banner} alt={event.title} />
                          
                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[80%]">
                            <span className="bg-primary/95 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10">
                              {event.category.split(' ')[0]}
                            </span>
                            {event.price >= 2000 && (
                              <span className="bg-amber-500/90 backdrop-blur-md text-black text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-300/20">
                                VIP
                              </span>
                            )}
                          </div>

                          {/* Wishlist Button */}
                          <button 
                            onClick={(e) => toggleWishlist(event._id, e)}
                            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white hover:text-red-400 rounded-full border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
                          >
                            <Heart size={12} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                          </button>

                          {/* Price Tag */}
                          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg">
                            {formattedPrice}
                          </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono font-bold">
                              <Star size={10} className="fill-primary" />
                              <span>{event.rating} • {event.location}</span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">
                              {event.title}
                            </h3>
                            
                            <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-gray-500 text-[10px] font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar size={10} className="text-secondary" />
                              <span>{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</span>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass-panel border border-white/5 rounded-3xl"
              >
                <p className="text-gray-400 text-sm">No events found matching your selected criteria.</p>
                <button onClick={resetFilters} className="mt-4 text-xs font-bold text-primary hover:underline">Clear Search & Filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
};

export default Events;
