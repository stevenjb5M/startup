import React, { useEffect, useState, useContext } from 'react';
import "./leaderboard.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';

const stores = ['Walmart', 'Target', 'Best Buy', 'Costco', 'Amazon', 'Home Depot', 'Lowe\'s', 'Kroger', 'Walgreens', 'CVS'];

function getRandomStore() {
  return stores[Math.floor(Math.random() * stores.length)];
}

export function Leaderboard() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [randomStore, setRandomStore] = useState(getRandomStore());
  const [quote, setQuote] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      const storedStore = localStorage.getItem('popularStore');
      if (storedStore) {
        setRandomStore(storedStore);
      }
      setLoading(false);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'popularStore') {
        setRandomStore(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch('https://api.kanye.rest/');
        if (response.ok) {
          const data = await response.json();
          setQuote(data.quote);
        } else {
          setQuote('quote failed to load');
        }
      } catch (error) {
        setQuote('An error occurred while getting the quote');
      }
    }

    fetchQuote();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div id="leaderboard-div">
        <h2 id="leaderboard-title">Leaderboard</h2>
        <ul id="leader-list">
          <li className="card" role="listitem" tabIndex="0">#1 {randomStore}</li>
        </ul>

        <h2 id="quote-title">Random Kanye Quote</h2>
        <p id="quote-p" aria-label="Kanye West quote">{quote}</p>
      </div>
    </main>
  );
}

Leaderboard.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
  }),
};