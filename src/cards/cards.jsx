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
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

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

  const addLocationToCard = (cardId, locationName, cashBack, setLocalError, resetFields) => {
    if (!locationName || !cashBack) {
      setLocalError('Location name and cashback percentage are required');
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
    resetFields();
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
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <main className="cards-main">
      <button
        onClick={() => navigate('/home')}
        className="cards-back-btn"
        aria-label="Back to Home"
      >
        ← Back
      </button>
      <div className="cards-container">
        <div className="cards-header">
          <h2 className="cards-title">
            Your Cards
          </h2>
          <img id="plus-button" className="icon-button cards-add-icon" src="plus-solid.svg" alt="Add new card" onClick={() => setPopupOpen(true)} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <ul className="cards-list">
          {cards.map((card, index) => (
            <CardItem
              key={card.cardId}
              card={card}
              onDelete={deleteCard}
              onAddLocation={addLocationToCard}
              onRemoveLocation={removeLocationFromCard}
            />
          ))}
        </ul>
      </div>
      <div className={`cards-popup-bg${popupOpen ? ' open' : ''}`} onClick={() => setPopupOpen(false)}></div>
      <div className={`cards-popup${popupOpen ? ' open' : ''}`}> 
        <h3 className="cards-popup-title">Enter Card Name</h3>
        <input type="text" placeholder="Card name" value={cardName} onChange={e => setCardName(e.target.value)} className="cards-popup-input" />
        <div className="cards-popup-actions">
          <button type="button" onClick={addCard} className="card-add-btn">Add Card</button>
          <button type="button" onClick={() => setPopupOpen(false)} className="card-add-btn cards-close-btn">Close</button>
        </div>
      </div>
    </main>
  );
}

function CardItem({ card, onDelete, onAddLocation, onRemoveLocation }) {
  const [locationName, setLocationName] = useState('');
  const [cashBack, setCashBack] = useState('');
  const [localError, setLocalError] = useState(null);
  const resetFields = () => {
    setLocationName('');
    setCashBack('');
    setLocalError(null);
  };
  return (
    <li className="card-item">
      <div className="card-box">
        <div className="card-box-header">
          <span className="card-box-title">{card.cardId}</span>
          <button onClick={() => onDelete(card.cardId)} className="card-delete-btn">Delete</button>
        </div>
        <ul className="card-locations-list">
          {card.locations && card.locations.map(loc => (
            <li key={loc.location} className="card-location-item">
              <span>{loc.location}: {loc.cashback}%</span>
              <button onClick={() => onRemoveLocation(card.cardId, loc.location)} className="card-location-remove">Remove</button>
            </li>
          ))}
        </ul>
        <div className="card-inputs">
          <input
            type="text"
            placeholder="Location name"
            value={locationName}
            onChange={e => setLocationName(e.target.value)}
            className="card-input"
          />
          <input
            type="text"
            placeholder="Cash back %"
            value={cashBack}
            onChange={e => setCashBack(e.target.value)}
            className="card-input cashback"
          />
          <button onClick={() => onAddLocation(card.cardId, locationName, cashBack, setLocalError, resetFields)} className="card-add-btn">Add</button>
        </div>
        {localError && <div className="card-error">{localError}</div>}
      </div>
    </li>
  );
}

CardItem.propTypes = {
  card: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddLocation: PropTypes.func.isRequired,
  onRemoveLocation: PropTypes.func.isRequired,
};