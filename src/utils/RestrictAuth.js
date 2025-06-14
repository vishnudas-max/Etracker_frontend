// src/hoc/RestrictAuth.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { login, logout } from "../Redux/UserAuthSlice";
import api from "../axiosconfig";
import Loader from "../Components/Loader";

const RestrictAuth = ({ children }) => {
  const isAuthenticated = useSelector(state => state.user.is_auth);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await api.get("/auth/check/");
        dispatch(login({
          is_auth: res.data.is_authenticated,
          username: res.data.user.username,
          user_id: res.data.user.id,
          is_admin: res.data.user.is_admin
        }));
      } catch {
        dispatch(logout());
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [dispatch]);

  // Wait for auth check to complete
  if (checkingAuth) return <Loader isPage />

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RestrictAuth;
