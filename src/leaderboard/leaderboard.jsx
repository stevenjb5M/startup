import React, { useEffect, useState } from 'react';
import "./leaderboard.css";
import "../main.css";

const stores = ['Walmart', 'Target', 'Best Buy', 'Costco', 'Amazon', 'Home Depot', 'Lowe\'s', 'Kroger', 'Walgreens', 'CVS'];

function getRandomStore() {
  return stores[Math.floor(Math.random() * stores.length)];
}

export function Leaderboard() {
  const [randomStore, setRandomStore] = useState(getRandomStore());

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomStore(getRandomStore());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <div id="leaderboard-div">
        <h2 id="leaderboard-title">Leaderboard(Web Sockets)</h2>
        <ul id="leader-list">
          <li className="card">#1 {randomStore}</li>
        </ul>

        <h2 id="dog-title">Random Dog Fact(Third party service)</h2>
        <p id="dog-p">Dogs like to eat dog food</p>
      </div>
    </main>
  );
}