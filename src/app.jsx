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
        <div className="body bg-dark text-light">
            <header>
                <h1>Welcome to Card Cash</h1>
                <hr />
            </header>

            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cards' element={<Cards />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/locations' element={<Locations />} />
                <Route path='/home' element={<Home />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
                {location.pathname !== '/' && (
                    <nav id="leaderboard-button-div">
                        {isLoggedIn ? (
                            <button className="icon-link" style={{background:'none',border:'none',padding:0,margin:0}} onClick={handleLogout} title="Logout">
                                <img className="icon-button" src="arrow-rotate-left-solid.svg" alt="Logout" />
                            </button>
                        ) : (
                            <NavLink className="icon-link" to="/">
                                <img className="icon-button" src="user-solid-2.svg" alt="Login" />
                            </NavLink>
                        )}
                        <NavLink className="icon-link" to="/home">
                            <img className="icon-button" src="house-solid.svg" alt="Home" />
                        </NavLink>
                        <NavLink className="icon-link" to="/locations">
                            <img className="icon-button" src="store-solid.svg" alt="Locations" />
                        </NavLink>
                        <NavLink className="icon-link" to="/cards">
                            <img className="icon-button" src="credit-card-solid.svg" alt="Cards" />
                        </NavLink>
                        <NavLink className="icon-link" to="/leaderboard">
                            <img className="icon-button" src="chart-simple-solid.svg" alt="Leaderboard" />
                        </NavLink>
                    </nav>
                )}
            </footer>
        </div>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}