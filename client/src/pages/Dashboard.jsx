import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'admin' || user.isAdmin === true;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
