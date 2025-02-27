import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import { UserContext } from '../context/UserContext';


export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);


  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.elements['email-input'].value;
    const password = event.target.elements['password-input'].value;
    const user = {
      email,
      password
    };

    if (event.nativeEvent.submitter.id === 'login-button') {
      const storedUser = JSON.parse(localStorage.getItem(email));
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        setCurrentUser(storedUser);
        navigate('/home');
      } else {
        alert('User does not exist or incorrect credentials');
      }
    } else if (event.nativeEvent.submitter.id === 'create-account-button') {
      if ((email !== "") && (password !== ""))
      {
        const existingUser = JSON.parse(localStorage.getItem(email));
        if (existingUser) {
          alert('User with this email already exists');
        }
        else {
          localStorage.setItem(email, JSON.stringify(user));
          alert('Account created successfully');
          setCurrentUser(user);
          navigate('/home');
        }

      } else {
        alert("Please enter a username and a password");
      }
      
    }
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
          <button id="create-account-button" type="submit">Create Account</button>
        </form>
      </div>
    </main>
  );
}