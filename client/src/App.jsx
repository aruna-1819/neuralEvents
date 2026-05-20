import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const isAdmin = user.role === 'admin' || user.isAdmin === true;
  if (!isAdmin) {
    return <Unauthorized />;
  }
  return children;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
      <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-secondary animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
    </div>
    <span className="text-xs font-mono font-bold tracking-widest text-primary/80 mt-6 uppercase animate-pulse">Loading Neural Experience...</span>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
