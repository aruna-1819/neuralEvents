import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { mockEvents } from '../data/mockEvents';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Download, 
  Share2, 
  XCircle, 
  Clock, 
  Sparkles, 
  DollarSign, 
  Bell, 
  Heart, 
  X, 
  User 
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (Object.keys(timeLeft).length === 0) {
    return <span className="text-red-400 font-bold text-xs">Event Started</span>;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5 text-accent w-fit">
      <Clock size={12} />
      <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');

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
  const [tickets, setTickets] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { wishlistMap, toggleWishlist, isWishlisted } = useWishlist();

  // Fetch Tickets/Bookings
  const fetchTickets = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/tickets/my-tickets', config);
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      const userLocalBookings = localBookings.filter(b => b.user === user._id);
      setTickets([...data, ...userLocalBookings]);
    } catch (error) {
      console.warn("Using offline mock ticket list fallback:", error.message);
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      const userLocalBookings = localBookings.filter(b => b.user === user._id);
      setTickets(userLocalBookings);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all events
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

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const savedEvents = allEvents.filter(e => isWishlisted(e._id));

  // Cancel Booking handler
  const handleCancelBooking = (ticketId) => {
    if (window.confirm("Are you sure you want to cancel this booking? This will issue a full mock refund.")) {
      // Offline local cancellations
      const localBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      const updated = localBookings.filter(b => b._id !== ticketId);
      localStorage.setItem('mockBookings', JSON.stringify(updated));
      
      // Also update current tickets state
      setTickets(prev => prev.filter(t => t._id !== ticketId));
      toast.success("Booking cancelled successfully and mock refund processed!");
    }
  };

  // Download QR Code image
  const handleDownloadQR = (ticket) => {
    const link = document.createElement('a');
    link.href = ticket.qrCode;
    link.download = `neuralevents-qr-${ticket._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code download started!");
  };

  // Share Event handler
  const handleShareEvent = (eventId) => {
    const url = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied to clipboard! Share it with friends.");
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-primary font-display text-xl animate-pulse">Loading Dashboard...</div>;

  // Filter Tickets
  const now = new Date();
  const upcomingTickets = tickets
    .filter(t => new Date(t.event?.date || '') >= now && t.status !== 'cancelled')
    .sort((a, b) => new Date(a.event?.date || '') - new Date(b.event?.date || ''));

  const pastTickets = tickets.filter(t => new Date(t.event?.date || '') < now || t.status === 'cancelled');

  // Simulated AI Notifications
  const notifications = [
    {
      id: 1,
      title: "Welcome to NeuralEvents!",
      text: `Hello ${user.name}! Ask our floating AI Chatbot in the bottom right corner for event matches.`,
      time: "Just now",
      badge: "AI Help"
    },
    {
      id: 2,
      title: "AI Recommendation Match",
      text: "Based on your interests, Virtual Synthwave Concert matches your style with a 98% score!",
      time: "2 hours ago",
      badge: "High Match"
    }
  ];

  return (
    <div className="relative">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-display font-bold">Welcome back, <span className="gradient-text">{user.name}</span></h2>
          <p className="text-gray-400 text-sm mt-1">Manage your bookings, digital tickets, and personalized AI recommendations.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 glass-panel rounded-2xl border border-white/10 text-xs">
          <User size={14} className="text-primary" />
          <span className="text-gray-300 font-mono">ID: {user._id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side Navigation Panel */}
        <div className="flex flex-col gap-2">
          {[
            { id: 'upcoming', label: 'Upcoming Events', icon: Clock, count: upcomingTickets.length },
            { id: 'past', label: 'Past Events', icon: Ticket, count: pastTickets.length },
            { id: 'saved', label: 'Saved Events', icon: Heart, count: savedEvents.length },
            { id: 'payments', label: 'Payment History', icon: DollarSign, count: tickets.length },
            { id: 'notifications', label: 'AI Notices', icon: Bell, count: notifications.length }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg border border-white/10'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </div>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side Content Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* UPCOMING EVENTS TAB */}
            {activeTab === 'upcoming' && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-primary" size={20} />
                  <h3 className="text-xl font-bold font-display">Upcoming Event Bookings</h3>
                </div>

                {upcomingTickets.length === 0 ? (
                  <div className="glass-panel p-12 text-center rounded-2xl border border-white/5">
                    <Ticket className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-300">No upcoming events booked</h4>
                    <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">You don't have any pending events. Go ahead and find your next immersive experience!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {upcomingTickets.map((ticket) => (
                      <motion.div 
                        whileHover={{ y: -4 }}
                        key={ticket._id} 
                        className="glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row gap-6 border border-white/10 hover:border-primary/40 transition-colors shadow-lg p-5 relative group"
                      >
                        {/* Event Image Banner with category tag */}
                        <div className="w-full md:w-56 h-40 rounded-xl overflow-hidden relative flex-shrink-0">
                          <img src={ticket.event?.banner} alt={ticket.event?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-2 left-2 bg-primary/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-white uppercase">
                            {ticket.event?.category}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                              <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{ticket.event?.title || 'Unknown Event'}</h4>
                              <CountdownTimer targetDate={ticket.event?.date} />
                            </div>

                            <div className="space-y-1.5 text-gray-400 text-xs mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-primary" />
                                <span>{formatDate(ticket.event?.date, 'MMMM d, yyyy • h:mm a')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-primary" />
                                <span className="truncate">{ticket.event?.venue}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Ticket size={14} className="text-accent" />
                                <span>Seat: <strong className="text-white font-mono uppercase">VIP-B{ticket._id.slice(-3)}</strong> (VIP Access)</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons Panel */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                            <button 
                              onClick={() => setSelectedTicket(ticket)}
                              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Ticket size={12} /> View Ticket
                            </button>
                            <button 
                              onClick={() => handleDownloadQR(ticket)}
                              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                            >
                              <Download size={12} /> Download QR
                            </button>
                            <button 
                              onClick={() => handleShareEvent(ticket.event?._id)}
                              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                            >
                              <Share2 size={12} /> Share
                            </button>
                            <button 
                              onClick={() => handleCancelBooking(ticket._id)}
                              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors flex items-center gap-1.5 border border-red-500/20 ml-auto cursor-pointer"
                            >
                              <XCircle size={12} /> Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PAST EVENTS TAB */}
            {activeTab === 'past' && (
              <motion.div
                key="past"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Ticket className="text-secondary" size={20} />
                  <h3 className="text-xl font-bold font-display">Completed & Cancelled Events</h3>
                </div>

                {pastTickets.length === 0 ? (
                  <div className="glass-panel p-12 text-center rounded-2xl border border-white/5">
                    <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-400">No past bookings found</h4>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastTickets.map((ticket) => (
                      <div key={ticket._id} className="glass-panel rounded-xl p-5 flex flex-col justify-between border border-white/5 opacity-60">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-lg text-white truncate max-w-[70%]">{ticket.event?.title || 'Unknown Event'}</h4>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ticket.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {ticket.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              <span>{formatDate(ticket.event?.date, 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} />
                              <span className="truncate">{ticket.event?.venue}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-4">ID: {ticket._id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SAVED EVENTS TAB */}
            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="text-red-500 fill-red-500" size={20} />
                  <h3 className="text-xl font-bold font-display">My Saved Wishlist</h3>
                </div>

                {savedEvents.length === 0 ? (
                  <div className="glass-panel p-12 text-center rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 relative overflow-hidden">
                      <Heart className="w-10 h-10 text-gray-500 animate-[pulse_2s_infinite]" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">No Saved Events Yet</h4>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Your wishlist is currently empty. Explore our amazing events and tap the heart icon to save your favorites!</p>
                    <a 
                      href="/events" 
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all"
                    >
                      Explore Event Catalog
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedEvents.map((event) => (
                      <div key={event._id} className="glass-panel rounded-xl overflow-hidden border border-white/5 flex flex-col group relative">
                        <div className="h-32 overflow-hidden relative">
                          <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-2 left-2 bg-primary/95 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">{event.category}</span>
                          
                          {/* Heart toggle on image to remove */}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleWishlist(event)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full border border-white/10 hover:border-red-500/50 hover:bg-black/80 transition-all cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Heart size={12} className="fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                          </motion.button>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-base text-white mt-1 group-hover:text-primary transition-colors truncate">{event.title}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                              <Calendar size={12} />
                              <span>{formatDate(event.date, 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                              <MapPin size={12} />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                            <span className="text-accent font-bold">${event.price}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleShareEvent(event._id)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                title="Share Event"
                              >
                                <Share2 size={12} />
                              </button>
                              <button 
                                onClick={() => toggleWishlist(event)}
                                className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/20 text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PAYMENT HISTORY TAB */}
            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-accent" size={20} />
                  <h3 className="text-xl font-bold font-display">Payment & Billing History</h3>
                </div>

                {tickets.length === 0 ? (
                  <div className="glass-panel p-12 text-center rounded-2xl border border-white/5">
                    <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-400">No payment invoices found</h4>
                  </div>
                ) : (
                  <div className="glass-panel overflow-hidden border border-white/5 rounded-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                          <tr>
                            <th className="p-4">Invoice ID</th>
                            <th className="p-4">Event Title</th>
                            <th className="p-4">Payment Method</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {tickets.map((t) => (
                            <tr key={t._id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-gray-500 text-xs">INV-{t._id.slice(-6).toUpperCase()}</td>
                              <td className="p-4 font-medium text-white">{t.event?.title || 'Event Booking'}</td>
                              <td className="p-4 text-gray-400 text-xs">Razorpay Online</td>
                              <td className="p-4 text-accent font-mono font-bold">${t.event?.price || 150}.00</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  t.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {t.status === 'cancelled' ? 'REFUNDED' : 'PAID'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-secondary" size={20} />
                  <h3 className="text-xl font-bold font-display">AI Personal Notices</h3>
                </div>

                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div key={n.id} className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex gap-4 hover:border-secondary/30 transition-colors">
                      <div className="p-3 bg-secondary/10 rounded-xl h-fit w-fit text-secondary">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base text-white">{n.title}</h4>
                          <span className="bg-primary/20 text-primary border border-primary/25 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded font-mono">{n.badge}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{n.text}</p>
                        <span className="text-[10px] text-gray-500 block mt-2 font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODERN DIGITAL TICKET MODAL */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-darkCard border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              {/* Event Image Banner */}
              <div className="h-40 relative">
                <img src={selectedTicket.event?.banner} alt={selectedTicket.event?.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dotted lines tearing indicators */}
              <div className="absolute left-0 right-0 h-1 flex justify-between px-4 -translate-y-0.5">
                {[...Array(20)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-black rounded-full"></span>
                ))}
              </div>

              {/* Ticket details */}
              <div className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-primary font-bold tracking-wider uppercase">{selectedTicket.event?.category}</span>
                    <h3 className="text-xl font-display font-bold mt-1 text-white truncate max-w-[250px]">{selectedTicket.event?.title}</h3>
                  </div>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 mb-6 border-b border-dashed border-white/10 pb-5">
                  <div>
                    <div className="text-gray-500 text-[10px]">ATTENDEE</div>
                    <div className="font-semibold text-white mt-0.5">{user.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">BOOKING ID</div>
                    <div className="font-mono text-white text-[10px] mt-0.5">{selectedTicket._id}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">DATE & TIME</div>
                    <div className="font-semibold text-white mt-0.5 truncate">{formatDate(selectedTicket.event?.date, 'MMM d, yyyy • h:mm a')}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">VENUE</div>
                    <div className="font-semibold text-white mt-0.5 truncate">{selectedTicket.event?.venue}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">ACCESS TYPE</div>
                    <div className="font-bold text-accent mt-0.5">VIP PASS</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">SEAT NUMBER</div>
                    <div className="font-mono text-accent font-bold mt-0.5">VIP-B{selectedTicket._id.slice(-3).toUpperCase()}</div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center pt-1">
                  <div className="bg-white p-2.5 rounded-2xl shadow-xl w-32 h-32 flex items-center justify-center">
                    <img src={selectedTicket.qrCode} alt="Ticket QR" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-4 text-center leading-normal">
                    This ticket is a digital VIP pass. Please present this QR code at the venue gate for rapid entry scanning. Enjoy the show!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
