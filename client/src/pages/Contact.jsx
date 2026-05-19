import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Users, 
  MessageSquare, 
  ArrowUpRight,
  Sparkles,
  Calendar
} from 'lucide-react';

const Contact = () => {
  const contactDetails = [
    { icon: MapPin, title: 'Office Address', val1: 'Gowlidoddy, Hyderabad,', val2: 'Telangana, India' },
    { icon: Phone, title: 'Phone Support', val1: '+91 98765 43210', val2: '9:00 AM - 11:00 PM IST' },
    { icon: Mail, title: 'Email Support', val1: 'support@neuralevents.in', val2: 'Responses in under 4 hours' },
    { icon: Clock, title: 'Business Hours', val1: 'Mon - Sun: 9:00 AM - 11:00 PM', val2: 'Open Daily' }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Ananya Sharma',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400',
      rating: 5,
      comment: 'Amazing event booking experience! The QR ticket system is smooth and fast.',
      date: '2 days ago'
    },
    {
      id: 2,
      name: 'Rohan Verma',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
      rating: 5,
      comment: 'Best event platform UI I have ever used. Very premium design.',
      date: '1 week ago'
    },
    {
      id: 3,
      name: 'Priya Patel',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
      rating: 5,
      comment: 'Booking tickets was super easy and the dashboard is beautiful.',
      date: '3 days ago'
    }
  ];

  const ratingsStats = {
    average: '4.9',
    totalReviews: '1,250+',
    satisfaction: '99.2%'
  };

  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-4">Connect With <span className="gradient-text">NeuralEvents</span></h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Experience premium customer care, explore our Hyderabad corporate headquarters, and see why thousands of event lovers rate us 5 stars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: HYDERABAD OFFICE DETAILS & SOCIALS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactDetails.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    whileHover={{ y: -2 }}
                    key={idx} 
                    className="glass-panel p-6 rounded-2xl border border-white/5 flex gap-4 hover:border-primary/20 transition-all shadow-md"
                  >
                    <div className="p-3 bg-primary/10 rounded-xl text-primary h-fit">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">{item.title}</h4>
                      <p className="text-gray-300 text-sm font-medium">{item.val1}</p>
                      <p className="text-gray-400 text-sm">{item.val2}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social channels */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shadow-md">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Social Channels</h4>
              <div className="flex gap-3">
                {/* LinkedIn */}
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-blue-600 cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-pink-600 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/></svg>
                </a>
                {/* Twitter / X */}
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-cyan-500 cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REVIEWS & HYDERABAD GOOGLE MAP */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* REVIEWS & RATINGS SECTION */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl space-y-8">
              
              {/* Ratings Summary stats */}
              <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h3 className="text-2xl font-display font-extrabold flex items-center gap-2 text-white">
                    Customer Reviews
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">Verified platform bookings and event check-ins.</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white flex items-center gap-1">
                      {ratingsStats.average} <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 inline-block mb-1" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Overall Rating</span>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-black text-accent">{ratingsStats.totalReviews}</div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Reviews</span>
                  </div>
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    key={rev.id} 
                    className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300 relative group flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={rev.img} alt={rev.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-white text-sm">{rev.name}</h5>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
                      </div>
                      <p className="text-gray-300 text-xs italic leading-relaxed">
                        “{rev.comment}”
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* PLANNING AN EVENT? */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0c0c14] to-[#120826] hover:border-primary/40 transition-all duration-500"
            >
              {/* Futuristic glowing backdrop lights */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary animate-pulse">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">
                    Planning an Event?
                  </h3>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  We organize all types of events including concerts, college fests, corporate events, tech conferences, birthday parties, cultural programs, DJ nights, workshops, and premium live experiences across Hyderabad.
                </p>

                <p className="text-gray-400 text-sm leading-relaxed">
                  Want to organize your event with us? Feel free to contact our team anytime through phone or email. We are available from <span className="text-primary font-bold">9:00 AM to 11:00 PM</span>.
                </p>

                {/* Highlights grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2.5 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/20 hover:bg-white/[0.04] transition-colors">
                    <Phone className="w-4 h-4 text-primary animate-bounce" />
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Phone</span>
                      <a href="tel:+919876543210" className="text-xs font-bold text-white hover:text-primary transition-colors">+91 98765 43210</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/20 hover:bg-white/[0.04] transition-colors">
                    <Mail className="w-4 h-4 text-primary animate-pulse" />
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Email</span>
                      <a href="mailto:support@neuralevents.in" className="text-xs font-bold text-white hover:text-primary transition-colors">support@neuralevents.in</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/20 hover:bg-white/[0.04] transition-colors">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Location</span>
                      <span className="text-xs font-bold text-white">Gowlidoddy, Hyd</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <a 
                    href="mailto:support@neuralevents.in?subject=Event%20Organization%20Inquiry"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-secondary font-bold text-sm text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group cursor-pointer gap-2"
                  >
                    Contact Now <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* STYLISH HYDERABAD GOOGLE MAPS SIMULATION */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 aspect-[16/9] relative shadow-lg group hover:border-primary/30 transition-all duration-300">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.4103019808365!2d78.33120141477755!3d17.41611738806296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a61f4fa24b%3A0xc319b222956cf9e2!2sGowlidoddy%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1625628562723!5m2!1sen!2sin"
                className="w-full h-full border-0 filter invert-[90%] hue-rotate-[180deg] grayscale opacity-75 group-hover:opacity-90 transition-opacity"
                allowFullScreen="" 
                loading="lazy"
                title="Hyderabad Office Map"
              />
              <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 border border-white/10 text-xs font-bold rounded-xl bg-background/80 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <MapPin size={12} className="text-primary animate-pulse" />
                <span>Gowlidoddy, Hyderabad</span>
                <a 
                  href="https://maps.google.com/?q=Gowlidoddy,+Hyderabad,+Telangana"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline ml-1.5 flex items-center gap-0.5 font-bold"
                >
                  Open in Maps <ArrowUpRight size={10} />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
