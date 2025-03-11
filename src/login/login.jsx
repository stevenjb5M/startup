import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import { UserContext } from '../context/UserContext';


export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements['email-input'].value;
    const password = event.target.elements['password-input'].value;
    const user = {
      email,
      password
    };

    if (event.nativeEvent.submitter.id === 'login-button') {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user)
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
          navigate('/home');
        } else {
          alert('Unauthorized');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in');
      }
    } else if (event.nativeEvent.submitter.id === 'create-account-button') {
      if (email !== "" && password !== "") {
        try {
          const response = await fetch('/api/auth/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
          });

          if (response.status === 409) {
            alert('User with this email already exists');
          } else if (response.ok) {
            const data = await response.json();
            setCurrentUser(data);
            navigate('/home');
          } else {
            alert('Failed to create account');
          }
        } catch (error) {
          console.error('Error creating account:', error);
          alert('An error occurred while creating the account');
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