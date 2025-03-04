import React, { useContext, useEffect, useState } from 'react';
import "./cards.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Cards() {
  const [cards, setCards] = useState([]);
  const [locations, setLocations] = useState([]);
  const { currentUser } = useContext(UserContext);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    }

    const userObject = JSON.parse(localStorage.getItem("users/" + currentUser.email)) || [];
    const storedcards = userObject.cards || [];
    setCards(storedcards);

    const storedLocations = userObject.locations || [];
    setLocations(storedLocations);
  }, [currentUser, navigate]);

  return (
    <main>
      <div id="cards-div">
        <h2 id="cards-title">Your cards</h2>
        <ul id="cards-list">
          {cards.map((card, index) => (
            <div className="specific-card-div">
              <li key={index} className="card">{card}</li>
              <button onClick={() => deletecard(index)}>Delete</button>
            </div>
            
          ))}
        </ul>

        <div id="add-remove-buttons">
          <a className="icon-link" href="#" onClick={openPopup}>
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Description of image" />
          </a>
        </div>
      </div>

      <div id="popup-background" style={{display: 'none'}}></div>

      <div id="popup" style={{ display: 'none' }}>
      <h3>Enter Card Name</h3>
      <input type="text" id="card-name" placeholder="Card name" value={cardName} onChange={handleCardNameChange} />
      <br />
      <h3>Choose Location</h3>
      <ul id="locations-list">
        {locations.map((location, index) => (
          <div key={index} className="specific-location-div">
            <li className="location">{location}</li>
            <input
              type="text"
              placeholder="Cash back percentage"
              value={cashBacks[location] || ''}
              onChange={(event) => handleCashBackChange(location, event)}
            />
          </div>
        ))}
      </ul>
      <br />
      <button type="button" onClick={addCard}>Add Card</button>
      <button type="button" onClick={closePopup}>Close</button>
    </div>
    </main>
  );

  function addcard() {
    const cardName = document.getElementById('card-name').value;
    if (cardName) {
      const updatedcards = [...cards, cardName];
      setCards(updatedcards);

      const updatedUser = { ...currentUser, cards: updatedcards };
      setCurrentUser(updatedUser);
      localStorage.setItem("users/" + currentUser.email, JSON.stringify(updatedUser));

      document.getElementById('card-name').value = '';
      closePopup();
    }
  }

  function deletecard(cardIndex) {
    const updatedcards = cards.filter((_, index) => index !== cardIndex);
    setCards(updatedcards);

    const updatedUser = { ...currentUser, cards: updatedcards };
    setCurrentUser(updatedUser);
    localStorage.setItem("users/" + currentUser.email, JSON.stringify(updatedUser));
  }

  function openPopup() {
    document.getElementById('popup').style.display = 'grid';
    document.getElementById('popup-background').style.display = 'block';

  }

  function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';

  }
}