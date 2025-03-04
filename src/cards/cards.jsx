import React, { useContext, useEffect, useState } from 'react';
import "./cards.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Cards() {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [cashBacks, setCashBacks] = useState({});
  const [locations, setLocations] = useState([]);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    }

    const userObject = JSON.parse(localStorage.getItem("users/" + currentUser.email)) || {};
    const storedCards = userObject.cards || [];
    setCards(storedCards);

    const storedLocations = userObject.locations || [];
    setLocations(storedLocations);
  }, [currentUser, navigate]);

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
  };

  const handleCashBackChange = (location, event) => {
    const value = event.target.value;
    setCashBacks((prevCashBacks) => ({
      ...prevCashBacks,
      [location]: value,
    }));
  };

  const addCard = () => {
    const card = {
      name: cardName,
      cashBacks,
    };

    if (card) {
      const updatedCards = [...cards, card];
      setCards(updatedCards);

      const updatedUser = { ...currentUser, cards: updatedCards };
      setCurrentUser(updatedUser);
      localStorage.setItem("users/" + currentUser.email, JSON.stringify(updatedUser));

      setCardName('');
      setCashBacks({});
    }
    console.log('Card added:', card);
    closePopup();
  };

  const deleteCard = (cardIndex) => {
    const updatedCards = cards.filter((_, index) => index !== cardIndex);
    setCards(updatedCards);

    const updatedUser = { ...currentUser, cards: updatedCards };
    setCurrentUser(updatedUser);
    localStorage.setItem("users/" + currentUser.email, JSON.stringify(updatedUser));
  };

  const openPopup = () => {
    document.getElementById('popup').style.display = 'grid';
    document.getElementById('popup-background').style.display = 'block';
  };

  const closePopup = () => {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';
  };

  return (
    <main>
      <div id="cards-div">
        <h2 id="cards-title">Your Cards</h2>
        <ul id="cards-list">
          {cards.map((card, index) => (
            <div key={index} className="specific-card-div">
              <li className="card-style">
                <h3>{card.name}</h3>
                <ul>
                  {card.cashBacks && Object.entries(card.cashBacks).map(([location, percentage]) => (
                    <li key={location}>{location}: {percentage}%</li>
                  ))}
                </ul>
              </li>
              <button onClick={() => deleteCard(index)} aria-label={`Delete card ${card.name}`}>Delete</button>
            </div>
          ))}
        </ul>

        <div id="add-remove-buttons">
          <a className="icon-link" href="#" onClick={openPopup} aria-label="Add new card">
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Add new card" />
          </a>
        </div>
      </div>

      <div id="popup-background" style={{ display: 'none' }}></div>

      <div id="popup" style={{ display: 'none' }}>
        <h3>Enter Card Name</h3>
        <input type="text" id="card-name" placeholder="Card name" value={cardName} onChange={handleCardNameChange} />
        <br />
        <h3>Choose Location</h3>
        <ul id="locations-list">
          {locations.map((location, index) => (
            <div key={location} className="specific-location-div">
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
}