import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Cards } from './cards/cards';
import { Leaderboard } from './leaderboard/leaderboard';
import { Locations } from './locations/locations';
import { Login } from './login/login';
import { Home } from './home/home';
import { UserProvider, UserContext } from './context/UserContext';

export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </UserProvider>
    );
}

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const isLoggedIn = currentUser && currentUser.email;

    const handleLogout = () => {
        setCurrentUser({ email: null });
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="body bg-dark text-light" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <header style={{position: 'relative'}}>
                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        style={{
                            position: 'absolute',
                            left: 24,
                            top: 24,
                            background: 'none',
                            border: 'none',
                            color: '#1a365d',
                            fontWeight: 700,
                            fontSize: 18,
                            cursor: 'pointer',
                            padding: 0,
                            zIndex: 2
                        }}
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                )}
                <h1 style={{textAlign: 'center', color: '#1a365d'}}>Welcome to Card Cash</h1>
                <hr />
            </header>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/cards' element={<Cards />} />
                    <Route path='/leaderboard' element={<Leaderboard />} />
                    <Route path='/locations' element={<Locations />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>

            <footer style={{textAlign: 'center', color: '#fff', background: 'transparent', border: 'none', marginTop: 32, marginBottom: 16, fontSize: 15}}>
                © Card Cash 2025 &nbsp;—&nbsp; Contact stevenjbrown95@gmail.com
            </footer>
        </div>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}