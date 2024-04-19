import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Menu from './components/sidebar/Menu';
import Home from './pages/Home';
import Authentification from './pages/Authentification';
import NotesListPage from './pages/NotesListPage';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Pages from './pages/Pages';
import PrivateRoute from './components/utils/PrivateRoute';
import Registration from './pages/Registration';
import { AuthProvider } from './components/context/AuthContext'; 
import Activate from './pages/Activate';
import ResetPassword from './pages/ResetPassword';
import ResetEmail from './pages/ResetEmail';
import RouteRegister from './components/utils/RouteRegister';

function App() {
  return (
    <div className='container'>
      <div className='app'>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/activate/:uid/:token' element={<Activate />}/>
              <Route element={<RouteRegister />}>
                <Route path='/reset/:uid/:token' element={<ResetPassword />} />
                <Route path='/reset_password' element={<ResetEmail />} />
                <Route path="/login" element={<Authentification />} />
                <Route path='/registration' element={<Registration />} />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/notes" element={<NotesListPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/pages/:id" element={<Pages />} />
                  <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}

export default App

