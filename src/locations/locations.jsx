import React from 'react';
import "./locations.css";
import "../main.css";

export function Locations() {
  return (
    <main>
        
    <div id="locations-div">
      <h2 id="locations-title">Your Locations</h2>
      <ul id="locations-list">
        <li className="location">Amazon</li>
        <li className="location">Walmart</li>
        <li className="location">Smiths</li>
       </ul>

       <div id="add-remove-buttons">
        <a className="icon-link" href="">
          <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Description of image" />
        </a>
        <a className="icon-link" href="">
          <img className="icon-button" src="minus-solid.svg" alt="Description of image" />
        </a>
       </div>
       
    </div>
    

    <div id="popup" >
        <h3>Enter Location Name</h3>
        <input type="text" id="locationName" placeholder="Location name" />
        <br />
        <button type="button" onclick="addLocation()">Add Location</button>
        <button type="button" onclick="closePopup()">Close</button>
    </div>

    </main>

  );
}