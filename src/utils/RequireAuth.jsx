// src/hoc/RequireAuth.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../axiosconfig';
import { login, logout } from '../Redux/UserAuthSlice';

const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector(state => state.user.is_auth);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await api.get('/auth/check/');
        dispatch(login({
          is_auth: res.data.is_authenticated,
          username: res.data.user.username,
          user_id: res.data.user.id
        }));
      } catch {
        dispatch(logout());
      } finally {
        setCheckingAuth(false);
      }
    };

    // Only check if not authenticated yet
    if (!isAuthenticated) {
      verifyAuth();
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch, isAuthenticated]);

  if (checkingAuth) return null

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
