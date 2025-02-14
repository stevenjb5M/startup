import React from 'react';
import "./leaderboard.css";
import "../main.css";


export function Leaderboard() {
  return (
    <main>
      
      <div id="leaderboard-div">
        <h2 id="leaderboard-title">Leaderboard(Web Sockets)</h2>
        <ul id="leader-list">
          <li className="card">#1 Ally</li>
          <li className="card">#2 Capitol One</li>
          <li className="card">#3 Wells Fargo</li>
         </ul>

         <h2 id="dog-title">Random Dog Fact(Third party service)</h2>
         <p id="dog-p">Dogs eat food</p>
      </div>

  
      </main>
  
  );
}