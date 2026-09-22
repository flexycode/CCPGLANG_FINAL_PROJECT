/**
 * PrivateRoute.tsx — Auth Guard Component
 * ========================================
 * PARADIGM: Functional Programming (FP)
 *
 * A route wrapper that checks for an active auth session.
 * If the user is authenticated, it renders the child routes.
 * If not, it redirects to the login page.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PrivateRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
