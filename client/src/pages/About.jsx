import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Target, 
  Award, 
  Calendar, 
  MapPin, 
  User, 
  ArrowRight, 
  X, 
  Eye
} from 'lucide-react';

const About = () => {
  const [activePhoto, setActivePhoto] = useState(null);

  const stats = [
    { label: 'Events Managed', val: '5,000+' },
    { label: 'Tickets Booked', val: '1.2M+' },
    { label: 'Global Cities', val: '45+' },
    { label: 'AI Match Accuracy', val: '98.4%' }
  ];

  const timeline = [
    { year: '2024', title: 'NeuralEvents Founded', desc: 'Launched with a vision to revolutionize the event booking pipeline utilizing AI matching models.' },
    { year: '2025', title: 'AI Matchmaking v2.0', desc: 'Introduced deep-neural cohort profiling, scaling ticketing capacity by over 400% globally.' },
    { year: '2026', title: 'Monorepo Expansion', desc: 'Created complete MERN enterprise ecosystem with offline fallback caches and digital QR gates.' }
  ];

  const team = [
    {
      name: 'Aruna Kumari',
      role: 'Founder & CEO',
      img: 'https://res.cloudinary.com/dxz68zfml/image/upload/v1779212712/image---1_khzthk.jpg',
      bio: 'Passionate entrepreneur and event management visionary focused on creating premium event experiences and modern ticket booking solutions across Hyderabad.'
    }
  ];

  const officePhotos = [
    {
      title: 'Neural Headquarters Lobby',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000',
      desc: 'Our central collaborative space located in the heart of Silicon Valley.'
    },
    {
      title: 'AI Lab & Boardroom',
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000',
      desc: 'Where the core neural ticketing algorithms and system architectures are designed.'
    },
    {
      title: 'Creative Collaboration Arena',
      url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000',
      desc: 'Open-concept workspace facilitating rapid prototyping and cross-team development.'
    },
    {
      title: 'Zen Relaxation Lounge',
      url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1000',
      desc: 'Recharging zone built for developer wellness, equipped with smart health tech.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Award size={12} /> The Future of Ticketing
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-extrabold mb-6 leading-tight"
          >
            Pioneering Intelligent <span className="gradient-text">Event Management</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            We are NeuralEvents. We merge cutting-edge neural intelligence with secure booking gateways to connect fans with unforgettable real-world experiences.
          </motion.p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary mb-6">
              <Compass size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Core Mission</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              To eliminate friction in event discovery and ticket booking. By deploying custom machine-learning cohort mapping, we personalize live recommendations so fans never miss events that match their aesthetic and cultural preferences.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit text-cyan-400 mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Future Vision</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Establishing a decentralized, hyper-secure event gateway. From real-time camera QR scans at physical stadium gates to dynamic biometric tickets and hybrid AR arenas, we are building the operational backbone for future entertainment.
            </p>
          </motion.div>
        </div>

        {/* STATS COUNTER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/5 rounded-3xl p-8 border border-white/5 shadow-2xl mb-24">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center p-4">
              <div className="text-3xl sm:text-5xl font-black gradient-text tracking-tight mb-2">{s.val}</div>
              <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE OFFICE GALLERY */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold">Inside <span className="text-primary">Our Spaces</span></h2>
              <p className="text-gray-400 text-sm mt-1">Take a look inside the futuristic design centers of NeuralEvents Corp.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officePhotos.map((photo, idx) => (
              <motion.div 
                whileHover={{ scale: 1.03 }}
                onClick={() => setActivePhoto(photo)}
                key={idx} 
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 cursor-pointer relative group aspect-[4/3]"
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col p-4 text-center">
                  <Eye className="text-primary w-8 h-8 mb-2" />
                  <h4 className="font-bold text-white text-sm">{photo.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* GORGEOUS TIMELINE SYSTEM */}
        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Our Journey & <span className="gradient-text">Milestones</span></h2>
          <div className="relative border-l border-white/10 max-w-3xl mx-auto pl-8 space-y-10 py-2">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-12 top-1.5 w-8 h-8 rounded-full bg-background border border-primary text-primary flex items-center justify-center font-mono text-xs font-bold shadow-lg shadow-primary/20">
                  {idx + 1}
                </span>
                <span className="text-primary font-mono font-bold text-lg">{item.year}</span>
                <h4 className="text-xl font-bold text-white mt-1 mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM MEMEBERS */}
        <div>
          <h2 className="text-3xl font-display font-bold text-center mb-4">Meet Our <span className="text-primary">Founder</span></h2>
          <p className="text-gray-400 text-center text-sm max-w-md mx-auto mb-12">The visionary behind NeuralEvents — building the future of premium event experiences across Hyderabad.</p>

          <div className="flex justify-center">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-300 group w-full max-w-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Photo side */}
                  <div className="relative sm:w-64 h-72 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600'; }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0e18]/60 sm:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e18]/60 via-transparent to-transparent sm:hidden" />
                  </div>

                  {/* Info side */}
                  <div className="p-8 flex flex-col justify-center flex-1 space-y-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-primary font-black tracking-widest uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                        ✦ {member.role}
                      </span>
                    </div>
                    <h4 className="text-3xl font-display font-black text-white">{member.name}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{member.bio}</p>

                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                      <a href="#" className="p-2.5 bg-white/5 hover:bg-primary/20 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                      <a href="#" className="p-2.5 bg-white/5 hover:bg-primary/20 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <span className="text-gray-600 text-xs ml-1">Hyderabad, Telangana</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>

      {/* FULL LIGHTBOX PREVIEW POPUP */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#101017] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative cursor-default"
            >
              <button 
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="h-96 relative">
                <img src={activePhoto.url} alt={activePhoto.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{activePhoto.title}</h3>
                <p className="text-gray-400 text-sm leading-normal">{activePhoto.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
