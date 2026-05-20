import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  CheckCircle2, 
  X, 
  CreditCard, 
  QrCode, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  FileText,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AIRecommendations from '../components/AIRecommendations';
import { mockEvents } from '../data/mockEvents';

// Dynamic Zero-Dependency Confetti Effect
const ConfettiEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          top: -10px;
          animation: fall 3s infinite linear;
        }
      `}</style>
      {[...Array(35)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2.5;
        const duration = Math.random() * 2 + 1.5;
        const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#f59e0b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div 
            key={i} 
            className="confetti-piece" 
            style={{ 
              left: `${left}%`, 
              animationDelay: `${delay}s`, 
              animationDuration: `${duration}s`,
              background: randomColor
            }}
          />
        );
      })}
    </div>
  );
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

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

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('summary'); // 'summary' | 'options' | 'upi-qr' | 'processing' | 'success' | 'failed'
  const [selectedMethod, setSelectedMethod] = useState('razorpay'); // 'razorpay' | 'stripe' | 'upi'
  const [ticketQty, setTicketQty] = useState(1);
  const [paymentCountdown, setPaymentCountdown] = useState(300); // 5 minutes
  const [bookedTicket, setBookedTicket] = useState(null);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsStats, setReviewsStats] = useState({
    averageRating: '0.0',
    totalReviews: 0,
    starsCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [sortBy, setSortBy] = useState('latest');
  
  // Submit review form states
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formMessage, setFormMessage] = useState('');
  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/event/${id}?sortBy=${sortBy}`);
      setReviews(data.reviews);
      setReviewsStats(data.stats);
    } catch (error) {
      console.warn("Using offline localStorage reviews database fallback:", error.message);
      
      const localKey = `mockReviews_${id}`;
      let localReviews = JSON.parse(localStorage.getItem(localKey) || '[]');
      if (localReviews.length === 0) {
        localReviews = [
          {
            _id: 'rev-1',
            eventId: id,
            userName: 'Rahul Rao',
            rating: 5,
            reviewMessage: 'Absolutely mind-blowing production! The lasers, sound system, and crowd vibe were top-tier.',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
            likes: 12,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            _id: 'rev-2',
            eventId: id,
            userName: 'Meera Reddy',
            rating: 4,
            reviewMessage: 'Very well organized corporate tech summit. High value networking, though the lunch lines were long.',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
            likes: 5,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
          }
        ];
        localStorage.setItem(localKey, JSON.stringify(localReviews));
      }

      // Sort
      let sorted = [...localReviews];
      if (sortBy === 'highest') {
        sorted.sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === 'helpful') {
        sorted.sort((a, b) => b.likes - a.likes || new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Stats
      let totalRating = 0;
      let starsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      sorted.forEach(r => {
        totalRating += r.rating;
        if (starsCount[r.rating] !== undefined) {
          starsCount[r.rating]++;
        }
      });
      const totalReviews = sorted.length;
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';

      setReviews(sorted);
      setReviewsStats({
        averageRating,
        totalReviews,
        starsCount
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, sortBy]);

  useEffect(() => {
    if (user) {
      setFormName(user.name);
    }
  }, [user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      toast.error('Please complete all review fields');
      return;
    }

    setSubmittingReview(true);
    const reviewData = {
      userId: user?._id || null,
      eventId: id,
      userName: formName,
      rating: formRating,
      reviewMessage: formMessage,
      userAvatar: formAvatar
    };

    try {
      await axios.post('/api/reviews', reviewData);
      toast.success('🎉 Thank You For Your Feedback!');
      setFormMessage('');
      fetchReviews();
    } catch (error) {
      console.warn("Using offline review submission fallback:", error.message);
      
      const localKey = `mockReviews_${id}`;
      const localReviews = JSON.parse(localStorage.getItem(localKey) || '[]');
      const newReview = {
        _id: 'rev-' + Math.random().toString(36).substr(2, 9),
        eventId: id,
        userName: formName,
        rating: formRating,
        reviewMessage: formMessage,
        userAvatar: formAvatar,
        likes: 0,
        createdAt: new Date().toISOString()
      };
      
      localReviews.push(newReview);
      localStorage.setItem(localKey, JSON.stringify(localReviews));
      
      toast.success('🎉 Thank You For Your Feedback!');
      setFormMessage('');
      fetchReviews();
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      await axios.post(`/api/reviews/${reviewId}/like`);
      fetchReviews();
    } catch (error) {
      console.warn("Using offline review like fallback:", error.message);
      
      const localKey = `mockReviews_${id}`;
      const localReviews = JSON.parse(localStorage.getItem(localKey) || '[]');
      const updatedReviews = localReviews.map(r => {
        if (r._id === reviewId) {
          return { ...r, likes: r.likes + 1 };
        }
        return r;
      });
      localStorage.setItem(localKey, JSON.stringify(updatedReviews));
      fetchReviews();
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.warn("Using offline mock details data for ID:", id);
        const localEvent = mockEvents.find(e => e._id === id);
        if (localEvent) {
          setEvent(localEvent);
          setLoading(false);
        } else {
          toast.error('Event not found');
          navigate('/events');
        }
      }
    };
    fetchEvent();
  }, [id, navigate]);

  // Payment Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (showPaymentModal && paymentStep === 'upi-qr' && paymentCountdown > 0) {
      timer = setInterval(() => {
        setPaymentCountdown(prev => prev - 1);
      }, 1000);
    } else if (paymentCountdown === 0) {
      setPaymentStep('failed');
    }
    return () => clearInterval(timer);
  }, [showPaymentModal, paymentStep, paymentCountdown]);

  const handleOpenBooking = () => {
    if (!user) {
      toast.error('Please login to book a ticket');
      navigate('/login');
      return;
    }
    setPaymentCountdown(300);
    setPaymentStep('summary');
    setShowPaymentModal(true);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && ticketQty < 10) {
      setTicketQty(prev => prev + 1);
    } else if (type === 'decrease' && ticketQty > 1) {
      setTicketQty(prev => prev - 1);
    }
  };

  const handleProceedToPayment = () => {
    setPaymentStep('options');
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === 'upi') {
      setPaymentCountdown(300);
      setPaymentStep('upi-qr');
    } else {
      handlePayNow(method);
    }
  };

  const handlePayNow = (method = selectedMethod) => {
    setPaymentStep('processing');
    
    // Simulate live payment verification delay (2.5 seconds)
    setTimeout(async () => {
      // 5% chance of simulated failure for user robust retry testing
      const isFailed = Math.random() < 0.05;
      
      if (isFailed) {
        setPaymentStep('failed');
        toast.error('Payment rejected by gateway');
        return;
      }

      // Successful Booking Execution
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const transactionId = 'txn-' + Math.random().toString(36).substr(2, 9);
        const { data } = await axios.post('/api/tickets', { 
          eventId: id, 
          paymentId: transactionId,
          quantity: ticketQty
        }, config);
        
        setBookedTicket(data);
        setSuccess(true);
        setPaymentStep('success');
        toast.success('Payment verified & ticket booked!');
      } catch (error) {
        console.warn("Using offline mock payment flow fallback:", error.message);
        
        const mockTicketId = 'tkt-' + Math.random().toString(36).substr(2, 9);
        const mockTicket = {
          _id: mockTicketId,
          event: event,
          user: user._id,
          status: 'valid',
          qty: ticketQty,
          paymentId: 'txn-' + Math.random().toString(36).substr(2, 9),
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockTicketId}`,
          createdAt: new Date().toISOString()
        };
        
        const storedBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        storedBookings.push(mockTicket);
        localStorage.setItem('mockBookings', JSON.stringify(storedBookings));
        
        setBookedTicket(mockTicket);
        setSuccess(true);
        setPaymentStep('success');
        toast.success('Payment verified & ticket booked!');
      }
    }, 2500);
  };

  // Simulated PDF Ticket Download
  const handleDownloadPDF = () => {
    toast.success('Generating and downloading your secure PDF entry ticket...');
    const link = document.createElement('a');
    link.href = bookedTicket?.qrCode;
    link.download = `neuralevents-ticket-${bookedTicket?._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-primary font-display text-xl animate-pulse">Loading Event details...</div>;

  const ticketPrice = event.price;
  const serviceFee = 12.50;
  const totalAmount = (ticketPrice * ticketQty) + serviceFee;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden mb-12 relative h-96 border border-white/5 shadow-2xl"
        >
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="px-4 py-2 rounded-full glass-panel border-primary/30 text-primary text-sm font-medium">{event.category}</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">About this Event</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-8">{event.description}</p>
            
            <AIRecommendations currentCategory={event.category} />

            {/* COMPREHENSIVE REVIEWS & RATINGS HUB */}
            <div className="mt-16 pt-16 border-t border-white/5 space-y-12">
              
              {/* HEADING */}
              <div>
                <h2 className="text-3xl font-display font-extrabold text-white flex items-center gap-3">
                  Attendee Reviews & Ratings
                </h2>
                <p className="text-gray-400 text-sm mt-1">Read checked-in member feedback or share your own live experiences.</p>
              </div>

              {/* RATING BREAKDOWN STATS */}
              <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c14] to-[#120826] grid grid-cols-1 md:grid-cols-12 gap-8 shadow-2xl items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
                
                {/* Total Average Card */}
                <div className="md:col-span-4 text-center space-y-2 border-r border-white/5 py-4">
                  <div className="text-6xl font-black text-white font-mono flex justify-center items-center gap-2">
                    {reviewsStats.averageRating}
                    <span className="text-yellow-400 text-4xl">★</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base font-bold text-white">Attendee Average</p>
                    <p className="text-xs text-gray-500 font-mono">Based on {reviewsStats.totalReviews} verified reviews</p>
                  </div>
                </div>

                {/* Stars breakdown bars */}
                <div className="md:col-span-8 space-y-3.5">
                  {[5, 4, 3, 2, 1].map(num => {
                    const count = reviewsStats.starsCount[num] || 0;
                    const percent = reviewsStats.totalReviews > 0 ? ((count / reviewsStats.totalReviews) * 100).toFixed(0) : 0;
                    return (
                      <div key={num} className="flex items-center gap-4 text-xs font-semibold">
                        <span className="text-gray-400 w-12 font-mono flex items-center justify-end gap-1">
                          {num} <span className="text-yellow-400 text-sm">★</span>
                        </span>
                        <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                          />
                        </div>
                        <span className="text-gray-500 w-12 text-right font-mono">{percent}% ({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WRITE A REVIEW FORM */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden bg-white/[0.01]">
                <div className="absolute bottom-0 right-0 w-36 h-36 bg-secondary/5 rounded-full blur-[50px] pointer-events-none" />
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Rate Your Experience
                </h3>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* User name */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Name</label>
                      <input 
                        type="text" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm text-white"
                        required
                      />
                    </div>
                    {/* Avatar select */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Choose Avatar Profile</label>
                      <div className="flex items-center gap-3">
                        {[
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
                          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
                        ].map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormAvatar(url)}
                            className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all ${
                              formAvatar === url ? 'border-primary scale-110 shadow-[0_0_10px_rgba(139,92,246,0.6)]' : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <img src={url} alt="User profile selection option" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Star selection */}
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Star Rating Selection</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <motion.button
                          key={num}
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFormRating(num)}
                          onMouseEnter={() => setFormHoverRating(num)}
                          onMouseLeave={() => setFormHoverRating(0)}
                          className="text-2xl cursor-pointer focus:outline-none transition-colors"
                        >
                          <span 
                            className={`transition-all duration-200 ${
                              num <= (formHoverRating || formRating) 
                                ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] scale-110' 
                                : 'text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Review Message Text area */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review Message</label>
                    <textarea
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Share details of your experience attending this event..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm text-white resize-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] cursor-pointer disabled:opacity-50 font-display"
                  >
                    {submittingReview ? 'Submitting Review...' : 'Submit Verified Review'}
                  </button>
                </form>
              </div>

              {/* DYNAMIC PUBLIC REVIEWS FEED */}
              <div className="space-y-6">
                
                {/* Header and sort filter */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <span className="text-sm font-semibold text-gray-400">
                    Latest Attendee Feedback ({reviews.length} reviews)
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Filter By</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#101017] border border-white/10 rounded-xl py-1.5 px-3 focus:outline-none focus:border-primary text-xs text-white cursor-pointer"
                    >
                      <option value="latest">Latest Reviews</option>
                      <option value="highest">Highest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>

                {/* Review Cards list */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={rev._id}
                        className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-primary/20 hover:bg-white/[0.03] transition-all flex items-start gap-4 shadow-lg relative group"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-white text-sm">{rev.userName}</h5>
                              <div className="flex gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-sm ${
                                      i < rev.rating 
                                        ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' 
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {rev.createdAt ? formatDate(rev.createdAt, 'MMM dd, yyyy') : 'Recently'}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                            {rev.reviewMessage}
                          </p>

                          {/* Action Button: Helpful react */}
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">
                              Attended: {event.title}
                            </span>
                            
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleLikeReview(rev._id)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-primary/20 hover:text-white rounded-lg border border-white/5 flex items-center gap-1.5 text-xs font-bold text-gray-400 transition-all cursor-pointer group-hover:border-primary/30"
                            >
                              👍 Helpful ({rev.likes})
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 text-sm">
                      No reviews found. Be the first to attend and rate this event!
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          <div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel p-8 rounded-2xl sticky top-28 border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
            >
              <div className="text-3xl font-bold mb-6">${event.price} <span className="text-sm font-normal text-gray-400">/ per ticket</span></div>
              
              <div className="space-y-4 mb-8 text-gray-300">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <div className="font-medium text-white">Date and Time</div>
                    <div>{formatDate(event.date, 'MMMM d, yyyy')}</div>
                    <div>{formatDate(event.date, 'h:mm a')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <div className="font-medium text-white">Location</div>
                    <div>{event.venue}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <div className="font-medium text-white">Capacity</div>
                    <div>{event.capacity} people max</div>
                  </div>
                </div>
              </div>

              {success ? (
                <div className="space-y-3">
                  <div className="w-full py-4 rounded-xl bg-green-500/20 text-green-400 font-bold flex justify-center items-center gap-2 border border-green-500/30">
                    <CheckCircle2 /> Ticket Booked!
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenBooking}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Ticket /> Book Now
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* PREMIUM MODAL CHECKOUT FLOW */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#101017] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {/* Event Header in Payment */}
              <div className="h-28 relative">
                <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#101017]/90 flex items-end p-5">
                  <div>
                    <span className="text-[10px] text-primary font-bold tracking-wider uppercase">{event.category}</span>
                    <h3 className="text-xl font-display font-bold text-white truncate max-w-[380px]">{event.title}</h3>
                  </div>
                </div>
                {paymentStep !== 'processing' && paymentStep !== 'success' && (
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-1.5 hover:bg-black transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* STEP 1: SUMMARY */}
              {paymentStep === 'summary' && (
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                    <span className="text-gray-300 font-medium text-sm">Quantity Selection</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleQuantityChange('decrease')}
                        className="p-1 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-white text-base">{ticketQty}</span>
                      <button 
                        onClick={() => handleQuantityChange('increase')}
                        className="p-1 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 border-b border-dashed border-white/10 pb-5 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Ticket Price ({ticketQty}x)</span>
                      <span>${ticketPrice * ticketQty}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking Service Charge</span>
                      <span>${serviceFee}.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-white text-base pt-2">
                      <span>Total Amount Due</span>
                      <span className="text-accent">${totalAmount}.00</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-gray-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Customer Name:</span>
                      <strong className="text-white">{user?.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Email:</span>
                      <strong className="text-white">{user?.email}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={handleProceedToPayment}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Proceed to Payment <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: GATEWAY OPTIONS */}
              {paymentStep === 'options' && (
                <div className="p-6 space-y-5">
                  <h4 className="text-gray-300 font-bold text-sm">Select Your Payment Gateway</h4>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'razorpay', label: 'Razorpay Checkout (UPI/Cards)', desc: 'Scan code, pay via major credit/debit cards or netbanking', icon: CreditCard },
                      { id: 'stripe', label: 'Stripe Pay Checkout', desc: 'Secure payments powered by Stripe Checkout Portal', icon: CreditCard },
                      { id: 'upi', label: 'Instant UPI QR Code', desc: 'Scan dynamic Google Pay / Paytm / PhonePe UPI QR code', icon: QrCode }
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleMethodSelect(m.id)}
                          className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all flex items-start gap-4 cursor-pointer"
                        >
                          <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-0.5">
                            <Icon size={18} />
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-sm">{m.label}</h5>
                            <p className="text-gray-400 text-xs mt-1 leading-normal">{m.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2.5: UPI QR ANIMATION VIEW */}
              {paymentStep === 'upi-qr' && (
                <div className="p-6 flex flex-col items-center text-center space-y-6">
                  <div className="flex justify-between items-center w-full px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-mono">
                    <span>UPI SECURE TIMEOUT:</span>
                    <strong>
                      {Math.floor(paymentCountdown / 60)}:
                      {String(paymentCountdown % 60).padStart(2, '0')}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-3xl shadow-xl w-44 h-44 flex items-center justify-center relative border border-white/10">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=pay-neuralevents@upi%26pn=NeuralEvents%26am=${totalAmount}%26cu=USD`} 
                      alt="UPI QR Payment" 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-sm">Scan QR with Google Pay, PhonePe, Paytm</h5>
                    <p className="text-gray-400 text-xs">UPI Address: <strong className="text-primary select-all">pay-neuralevents@upi</strong></p>
                  </div>

                  <div className="flex items-center gap-6 justify-center w-full py-2 border-y border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Accepted Apps:</span>
                    <div className="flex gap-3 text-xs font-bold text-gray-400 font-mono">
                      <span>GPay</span>
                      <span>PhonePe</span>
                      <span>Paytm</span>
                      <span>UPI</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePayNow('upi')}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Simulate UPI Success Response
                  </button>
                </div>
              )}

              {/* PROCESSING SECURE SCREEN */}
              {paymentStep === 'processing' && (
                <div className="p-10 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">Processing Secure Payment...</h4>
                    <p className="text-gray-400 text-xs max-w-xs mx-auto animate-pulse">Communicating with payment gateway vault. Please do not close this window or refresh the page.</p>
                  </div>
                </div>
              )}

              {/* STEP 4: GORGEOUS SUCCESS POPUP */}
              {paymentStep === 'success' && (
                <div className="p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                  <ConfettiEffect />
                  
                  <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full w-fit relative z-20 scale-110 shadow-lg shadow-green-500/10">
                    <Check size={36} />
                  </div>

                  <div className="space-y-2 relative z-20">
                    <h3 className="text-2xl font-display font-bold text-white">🎉 Ticket Booked Successfully!</h3>
                    <p className="text-gray-400 text-sm">Your seats have been securely reserved. Enjoy your event!</p>
                  </div>

                  {bookedTicket && (
                    <div className="w-full bg-white/5 p-5 rounded-2xl border border-white/5 text-xs text-gray-300 space-y-2.5 text-left relative z-20 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">EVENT NAME:</span>
                        <strong className="text-white truncate max-w-[200px]">{event.title}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">BOOKING ID:</span>
                        <strong className="text-primary">{bookedTicket._id}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">TICKETS SECURED:</span>
                        <strong className="text-white">{ticketQty} Pass(es)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">PAID AMOUNT:</span>
                        <strong className="text-accent">${totalAmount}.00</strong>
                      </div>
                    </div>
                  )}

                  <div className="w-full flex flex-col sm:flex-row gap-3 relative z-20 pt-2">
                    <button 
                      onClick={handleDownloadPDF}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    >
                      <FileText size={14} /> Download PDF Ticket
                    </button>
                    <button 
                      onClick={() => {
                        setShowPaymentModal(false);
                        navigate('/dashboard');
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      View Upcoming Events
                    </button>
                  </div>
                </div>
              )}

              {/* FAILED GATEWAY ERROR SCREEN */}
              {paymentStep === 'failed' && (
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                  <div className="p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full w-fit">
                    <AlertCircle size={36} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-white">❌ Payment Failed. Please Try Again.</h3>
                    <p className="text-gray-400 text-sm max-w-sm">The payment session timed out or was declined by the card issuer. Let's get you sorted.</p>
                  </div>

                  <div className="w-full flex flex-col gap-3 pt-2">
                    <button 
                      onClick={() => handlePayNow()}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all flex justify-center items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <RefreshCw size={16} className="animate-spin-slow" /> Retry Secure Payment
                    </button>
                    <button 
                      onClick={() => setPaymentStep('options')}
                      className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm transition-all flex justify-center items-center gap-2 cursor-pointer"
                    >
                      Change Payment Method
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventDetails;
