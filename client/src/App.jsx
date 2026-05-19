import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <h1 className="text-3xl font-display">{title} - Coming Soon</h1>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
