import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Star, Ticket } from 'lucide-react';
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

const Wishlist = () => {
  const [allEvents, setAllEvents] = useState([]);
  const { wishlistMap, toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/events');
        setAllEvents(data.length > 2 ? data : mockEvents);
      } catch (error) {
        setAllEvents(mockEvents);
      }
    };
    fetchEvents();
  }, []);

  const savedEvents = allEvents.filter(event => isWishlisted(event._id));

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

  const handleToggleWish = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(event);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen pt-24 pb-20 px-6 sm:px-12 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white flex items-center gap-4">
          <Heart className="text-red-500 fill-red-500" size={40} />
          Your Wishlist
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl text-sm md:text-base leading-relaxed">
          Events you've saved for later. Don't miss out, book your tickets before they sell out!
        </p>
      </div>

      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedEvents.map((event, index) => {
            if (!event) return null;
            const formattedPrice = event.price === 0 ? 'FREE' : `₹${(event.price || 0).toLocaleString('en-IN')}`;
            const categoryText = (event.category || '').split(' ')[0] || 'Event';

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                key={event._id}
                className="flex flex-col bg-[#0e0e16] rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all duration-300 group cursor-pointer"
              >
                <Link to={`/events/${event._id}`} className="flex flex-col h-full">
                  <div className="relative">
                    <EventCardImage src={event.banner} alt={event.title || 'Event'} />
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
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-gray-500 text-[10px] font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={10} className="text-secondary" />
                        <span>{formatDate(event.date, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={10} className="text-secondary" />
                        <span className="line-clamp-1">{event.venue || 'TBA'}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 py-2 bg-white/5 hover:bg-primary text-white text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 group-hover:bg-primary group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <Ticket size={14} /> Book Ticket
                    </button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 glass-panel border border-white/5 rounded-3xl mt-8"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <Heart size={40} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-400 text-sm max-w-sm text-center mb-8">
            You haven't saved any events yet. Explore our upcoming events and click the heart icon to save them here.
          </p>
          <Link to="/events" className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/80 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Explore Events
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Wishlist;
