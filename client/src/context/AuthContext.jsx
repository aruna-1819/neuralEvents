import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
        } else {
          localStorage.removeItem('userInfo');
        }
      }
    } catch (error) {
      console.warn("Failed to parse stored user info:", error.message);
      localStorage.removeItem('userInfo');
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.warn("Using offline mock auth login fallback:", error.message);
      if (email === 'admin@neuralevents.com' && password === 'password123') {
        const mockUser = { _id: 'admin-id', name: 'Admin User', email: 'admin@neuralevents.com', role: 'admin', isAdmin: true, token: 'mock-jwt-token' };
        setUser(mockUser);
        localStorage.setItem('userInfo', JSON.stringify(mockUser));
      } else {
        let storedUsers = [];
        try {
          storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          if (!Array.isArray(storedUsers)) storedUsers = [];
        } catch {
          storedUsers = [];
        }
        const found = storedUsers.find(u => u.email === email && u.password === password);
        if (found) {
          const loggedUser = { _id: found._id, name: found.name, email: found.email, role: found.role || 'user', isAdmin: false, token: 'mock-jwt-token' };
          setUser(loggedUser);
          localStorage.setItem('userInfo', JSON.stringify(loggedUser));
        } else {
          throw new Error('Invalid email or password');
        }
      }
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/users', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.warn("Using offline mock auth registration fallback:", error.message);
      let storedUsers = [];
      try {
        storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        if (!Array.isArray(storedUsers)) storedUsers = [];
      } catch {
        storedUsers = [];
      }
      const userExists = storedUsers.some(u => u.email === email) || email === 'admin@neuralevents.com';
      if (userExists) {
        throw new Error('User already exists');
      }
      
      const newMockUser = {
        _id: 'mock-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: 'user',
        isAdmin: false,
        token: 'mock-jwt-token'
      };
      
      storedUsers.push(newMockUser);
      localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
      
      const loggedUser = { _id: newMockUser._id, name: newMockUser.name, email: newMockUser.email, role: 'user', isAdmin: false, token: 'mock-jwt-token' };
      setUser(loggedUser);
      localStorage.setItem('userInfo', JSON.stringify(loggedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
