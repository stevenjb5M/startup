import React from 'react';
import { NavLink } from 'react-router-dom';
import { Login } from './login/login';

export function Login() {
  return (
    <main>
      <div id="login-screen">
        <img id="piggy-image" src="piggy-bank-solid.svg" alt="Description of image" />

        <form id="form" method="get" action="play.html">
          <span>Email</span>
          <input id="email-input" type="text" placeholder="your@email.com" />
          <span>Password</span>
          <input id="password-input" type="password" placeholder="password" />
          <NavLink to={Login}>
            <button id="login-button" type="submit" formaction="main.html">Login</button>
          </NavLink>
        </form>
      </div>
    </main>
  );
}