import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/home');
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
          <button id="login-button" type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}