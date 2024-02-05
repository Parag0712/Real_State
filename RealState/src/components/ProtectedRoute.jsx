import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

function ProtectedRoute() {
    const navigate = useNavigate();
    // AuthStatus   
    const { currentUser } = useSelector((state) => state.user);
    return currentUser?<Outlet />:<Navigate to='/sign-in' />
}

export default ProtectedRoute