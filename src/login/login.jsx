import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';


export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements['email-input'].value;
    const password = event.target.elements['password-input'].value;
    const user = {
      email,
      password
    };

    setLoading(true);
    setError(null);

    if (event.nativeEvent.submitter.id === 'login-button') {
      // Refactored: All user authentication/data is now managed in localStorage. API calls removed. Alerts replaced with error UI. PropTypes, loading, and accessibility improvements added.
      const storedUser = JSON.parse(localStorage.getItem('users'))?.find(u => u.email === email && u.password === password);

      if (storedUser) {
        setCurrentUser(storedUser);
        navigate('/home');
      } else {
        setError('Invalid email or password');
      }
    } else if (event.nativeEvent.submitter.id === 'create-account-button') {
      if (email !== "" && password !== "") {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
          setError('User with this email already exists');
        } else {
          users.push(user);
          localStorage.setItem('users', JSON.stringify(users));
          setCurrentUser(user);
          navigate('/home');
        }
      } else {
        setError("Please enter a username and a password");
      }
      
    }

    setLoading(false);
  };

  return (
    <main>
      <div id="login-screen">
        <img id="piggy-image" src="piggy-bank-solid.svg" alt="Description of image" />

        <form id="form" onSubmit={handleSubmit}>
          <span>Email</span>
          <input id="email-input" type="text" placeholder="your@email.com" />
          <span>Password</span>
          <input id="password-input" type="password" placeholder="password" />
          <button id="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button id="create-account-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </main>
  );
}

Login.propTypes = {
  setCurrentUser: PropTypes.func.isRequired,
};