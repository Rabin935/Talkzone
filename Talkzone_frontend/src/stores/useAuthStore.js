import axios from 'axios';
import { useState } from 'react';

const useAuthStore = () => {
  const [auth, setAuth] = useState(null);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/auth/check', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAuth(response.data);
    } catch (error) {
      console.error('Error during auth check:', error);
    }
  };

  return {
    auth,
    checkAuth
  };
};

export default useAuthStore;
