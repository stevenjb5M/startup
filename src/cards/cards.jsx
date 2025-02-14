import React from 'react';
import './cards.css';
import "../main.css";


export function Cards() {
  return (
    
    <main>
        
      <div id="cards-div">
        <h2 id="cards-title">Your Cards</h2>
        <ul id="cards-list">
          <li className="card">Ally</li>
          <li className="card">Capitol One</li>
          <li className="card">Wells Fargo</li>
         </ul>
  
         <div id="add-remove-buttons">
          <a className="icon-link">
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Description of image" />
          </a>
          <a className="icon-link" href="">
            <img className="icon-button" src="minus-solid.svg" alt="Description of image" />
          </a>
         </div>
         
      </div>
      
  
      <div id="popup">
          <h3>Enter Location Name</h3>
          <input type="text" id="locationName" placeholder="Location name" />
          <br />
          <button type="button" onclick="addLocation()">Add Location</button>
          <button type="button" onclick="closePopup()">Close</button>
      </div>
  

      </main>
    );
}