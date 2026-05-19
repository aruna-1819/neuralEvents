import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIRecommendations = ({ currentCategory }) => {
  // Mock recommendations based on category
  const recommendations = [
    {
      _id: 'rec1',
      title: 'Virtual Synthwave Concert',
      category: 'Music',
      banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
      matchScore: 98
    },
    {
      _id: 'rec2',
      title: 'Next-Gen VR Expo',
      category: 'Technology',
      banner: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop',
      matchScore: 92
    }
  ];

  return (
    <div className="mt-16 glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-secondary" size={24} />
        <h2 className="text-2xl font-bold">AI Selected For You</h2>
      </div>
      
      <p className="text-gray-400 mb-8">Based on your interest in <strong>{currentCategory}</strong>, our Neural AI suggests these upcoming events.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={rec._id} 
            className="bg-white/5 rounded-2xl overflow-hidden flex flex-col group border border-white/5 hover:border-secondary/50 transition-colors cursor-pointer shadow-lg"
          >
            <div className="h-40 overflow-hidden relative">
              <img src={rec.banner} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-green-400 border border-green-400/30">
                {rec.matchScore}% Match
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-primary font-bold">{rec.category}</span>
                <h3 className="font-bold text-lg mt-1 group-hover:text-secondary transition-colors">{rec.title}</h3>
              </div>
              <Link to="/events" className="mt-4 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                View Event <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
