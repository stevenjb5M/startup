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
  const [showCreate, setShowCreate] = useState(false);
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.elements['email-input'].value;
    const password = event.target.elements['password-input'].value;
    setLoading(true);
    setError(null);
    const storedUser = JSON.parse(localStorage.getItem('users'))?.find(u => u.email === email && u.password === password);
    if (storedUser) {
      setCurrentUser(storedUser);
      navigate('/home');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    if (createEmail !== "" && createPassword !== "") {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const existingUser = users.find(u => u.email === createEmail);
      if (existingUser) {
        setCreateError('User with this email already exists');
      } else {
        const user = { email: createEmail, password: createPassword };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        setCurrentUser(user);
        setShowCreate(false);
        navigate('/home');
      }
    } else {
      setCreateError("Please enter a username and a password");
    }
    setCreateLoading(false);
  };

  return (
    <main>
      <div id="login-screen">
        <img id="piggy-image" src="piggy-bank-solid.svg" alt="Description of image" />

        <form id="form" onSubmit={handleLogin}>
          <span>Email</span>
          <input id="email-input" type="text" placeholder="your@email.com" />
          <span>Password</span>
          <input id="password-input" type="password" placeholder="password" />
          <button id="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" id="create-account-button" onClick={() => setShowCreate(true)}>
            Create Account
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        {showCreate && (
          <div className="modal-overlay" onClick={() => setShowCreate(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Create Account</h2>
              <form onSubmit={handleCreateAccount}>
                <span>Email</span>
                <input type="text" value={createEmail} onChange={e => setCreateEmail(e.target.value)} placeholder="your@email.com" />
                <span>Password</span>
                <input type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} placeholder="password" />
                <button type="submit" disabled={createLoading}>{createLoading ? 'Creating...' : 'Create'}</button>
                <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                {createError && <div className="error-message">{createError}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

Login.propTypes = {
  setCurrentUser: PropTypes.func.isRequired,
};