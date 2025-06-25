import React, { useContext, useEffect, useState } from 'react';
import "./cards.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';

export function Cards() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const userEmail = currentUser?.email || '';
  const cardsKey = `cards_${userEmail}`;
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [cashBack, setCashBack] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      getCards();
    }
  }, [currentUser, navigate]);

  const getCards = () => {
    const storedCards = JSON.parse(localStorage.getItem(cardsKey)) || [];
    setCards(storedCards);
  };

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
  };

  const handleLocationNameChange = (event) => {
    setLocationName(event.target.value);
  };

  const handleCashBackChange = (event) => {
    setCashBack(event.target.value);
  };

  const addCard = () => {
    if (!cardName) {
      setError('Card name is required');
      return;
    }

    const newCard = {
      cardId: cardName,
      locations: []
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
    setCardName('');
    closePopup();
  };

  const deleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.cardId !== cardId);
    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
  };

  const addLocationToCard = (cardId) => {
    if (!locationName || !cashBack) {
      setError('Location name and cashback percentage are required');
      return;
    }

    const updatedCards = cards.map(card => {
      if (card.cardId === cardId) {
        const updatedLocations = [...card.locations, { location: locationName, cashback: cashBack }];
        return { ...card, locations: updatedLocations };
      }
      return card;
    });

    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
    setLocationName('');
    setCashBack('');
    closePopup();
  };

  const removeLocationFromCard = (cardId, location) => {
    const updatedCards = cards.map(card => {
      if (card.cardId === cardId) {
        const updatedLocations = card.locations.filter(loc => loc.location !== location);
        return { ...card, locations: updatedLocations };
      }
      return card;
    });

    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
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
      <button
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          left: 24,
          top: 90,
          background: 'none',
          border: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          padding: 0,
          zIndex: 2,
          marginBottom: 30,
          marginTop: 40
        }}
        aria-label="Back to Home"
      >
        ← Back
      </button>
      <div id="cards-div">
        <h2 id="cards-title">Your Cards</h2>
        {error && <div className="error">{error}</div>}
        <ul id="cards-list">
          {cards.map((card, index) => (
            <div key={index} className="specific-card-div">
              <li className="card-style">
                <h3>{card.cardId}</h3>
                <ul>
                  {card.locations && card.locations.map(loc => (
                    <li key={loc.location}>
                      {loc.location}: {loc.cashback}%
                      <button onClick={() => removeLocationFromCard(card.cardId, loc.location)}>Remove Location</button>
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Location name"
                  value={locationName}
                  onChange={handleLocationNameChange}
                />
                <input
                  type="text"
                  placeholder="Cash back percentage"
                  value={cashBack}
                  onChange={handleCashBackChange}
                />
                <button onClick={() => addLocationToCard(card.cardId)}>Add Location</button>
              </li>
              <button onClick={() => deleteCard(card.cardId)}>Delete</button>
            </div>
          ))}
        </ul>

        <div id="add-remove-buttons">
          <a className="icon-link" href="#" onClick={openPopup}>
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Add new card" />
          </a>
        </div>
      </div>

      <div id="popup-background" style={{ display: 'none' }}></div>

      <div id="popup" style={{ display: 'none' }}>
        <h3>Enter Card Name</h3>
        <input type="text" id="card-name" placeholder="Card name" value={cardName} onChange={handleCardNameChange} />
        <br />
        <button type="button" onClick={addCard}>Add Card</button>
        <button type="button" onClick={closePopup}>Close</button>
      </div>
    </main>
  );
}

Cards.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
  }),
  setCurrentUser: PropTypes.func.isRequired,
};