import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from './Redux/UserAuthSlice';
import api from './axiosconfig';

import Layout from "./Components/Layout";
import Login from "./Components/Login";
import Register from "./Components/Register";
import UserDashboard from "./Components/UserDashboard";

import RequireAuth from './utils/RequireAuth';
import RestrictAuth from './utils/RestrictAuth'; // ⬅️ for login/register

export default function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public route, but restricted for authenticated users */}
        <Route index element={<RestrictAuth><Login /></RestrictAuth>} />
        <Route path="register/" element={<RestrictAuth><Register /></RestrictAuth>} />

        {/* Protected route */}
        <Route path="dashboard/" element={<RequireAuth><UserDashboard /></RequireAuth>} />
      </Route>
    </Routes>
  );
}
