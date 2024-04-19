import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import Menu from '../../components/sidebar/Menu';
import { jwtDecode } from "jwt-decode";
const PrivateRoute = () => {
    let {logoutUser} = useContext(AuthContext)
    let user = localStorage.getItem('authTokens') ?  jwtDecode(localStorage.getItem('authTokens')) : null
    
    return user ? <Menu logoutUser={logoutUser}><Outlet /></Menu> : <Navigate to="/login" />;
}

export default PrivateRoute