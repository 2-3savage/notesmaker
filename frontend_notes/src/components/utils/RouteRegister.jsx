import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import NavbarAuth from './NavbarAuth';

const RouteRegister = () => {
    let {} = useContext(AuthContext)
    let user = localStorage.getItem('authTokens') ?  jwtDecode(localStorage.getItem('authTokens')) : null
    return user ? <Navigate to={'/'}/> : 
        <NavbarAuth>
            <Outlet/>
        </NavbarAuth>
}

export default RouteRegister