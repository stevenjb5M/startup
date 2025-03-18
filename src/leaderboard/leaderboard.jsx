import React, { useEffect, useState, useContext } from 'react';
import "./leaderboard.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const stores = ['Walmart', 'Target', 'Best Buy', 'Costco', 'Amazon', 'Home Depot', 'Lowe\'s', 'Kroger', 'Walgreens', 'CVS'];

function getRandomStore() {
  return stores[Math.floor(Math.random() * stores.length)];
}

export function Leaderboard() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [randomStore, setRandomStore] = useState(getRandomStore());
  const [quote, setQuote] = useState('Loading...');

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      
    }

    const interval = setInterval(() => {
      setRandomStore(getRandomStore());
    }, 5000);

    return () => clearInterval(interval);
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

  return (
    <main>
      <div id="leaderboard-div">
        <h2 id="leaderboard-title">Leaderboard(Web Sockets)</h2>
        <ul id="leader-list">
          <li className="card">#1 {randomStore}</li>
        </ul>

        <h2 id="quote-title">Random Kanye Quote</h2>
        <p id="quote-p">{quote}</p>
      </div>
    </main>
  );
}