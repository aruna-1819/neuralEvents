import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Ticket, DollarSign, Calendar, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', tickets: 400, revenue: 2400 },
  { name: 'Feb', tickets: 300, revenue: 1398 },
  { name: 'Mar', tickets: 200, revenue: 9800 },
  { name: 'Apr', tickets: 278, revenue: 3908 },
  { name: 'May', tickets: 189, revenue: 4800 },
  { name: 'Jun', tickets: 239, revenue: 3800 },
  { name: 'Jul', tickets: 349, revenue: 4300 },
];

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-8">Admin <span className="text-primary">Dashboard</span></h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Revenue', value: '$24,500', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
          { title: 'Tickets Sold', value: '1,245', icon: Ticket, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Active Events', value: '12', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10' },
          { title: 'Total Users', value: '850', icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4 shadow-lg"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-medium">{stat.title}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-xl font-bold mb-6">Revenue & Ticket Sales Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QR Scanner Mockup */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 relative overflow-hidden">
            <ScanLine size={40} />
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute w-full h-0.5 bg-secondary shadow-[0_0_10px_rgba(236,72,153,0.8)] z-10"
            />
          </div>
          <h3 className="text-xl font-bold mb-2">Ticket Verification</h3>
          <p className="text-gray-400 mb-6 text-sm">Use a connected QR scanner or mobile device to verify attendee tickets at the gate.</p>
          <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center justify-center gap-2 border border-white/10">
            <ScanLine size={18} /> Open Scanner Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
