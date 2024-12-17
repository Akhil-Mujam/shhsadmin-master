import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      setLoading(false); // Avoid setting loading if role is already available
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get('/userauthdata/getUserRole');
        setRole(response.data); // Set the user role
        console.log("response.data= "+response.data)
        setLoading(false); // Stop loading once role is set
      } catch (error) {
        console.error('Error fetching user role:', error);

        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data.message;

          if (status === 401 || errorMessage === 'Invalid JWT token') {
            console.warn('JWT token is invalid or expired. Redirecting to login.');
            setRole(null);
            navigate('/login');
          } else if (status === 404 || errorMessage === 'User not found') {
            console.warn('User not found in the system. Redirecting to login.');
            setRole(null);
            navigate('/login');
          } else {
            console.warn('An unexpected error occurred.');
            setRole(null);
          }
        } else {
          console.warn('Network error or server is unreachable.');
          setRole(null);
        }
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchUserRole();
  }, [role, navigate]);

  return (
    <UserContext.Provider value={{ role, setRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};
