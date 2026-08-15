import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('smart_resume_token') || null);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.warn('Session expired or invalid token:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      const newToken = res.data.token;
      localStorage.setItem('smart_resume_token', newToken);
      setToken(newToken);
      setUser(res.data.data);
    }
    return res.data;
  };

  const register = async (name, email, password, role = 'recruiter') => {
    const res = await axios.post('/api/auth/register', { name, email, password, role });
    if (res.data.success) {
      const newToken = res.data.token;
      localStorage.setItem('smart_resume_token', newToken);
      setToken(newToken);
      setUser(res.data.data);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('smart_resume_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
