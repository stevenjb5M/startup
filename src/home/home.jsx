import React, { useContext, useEffect, useState } from 'react';
import "../main.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cards, setCards] = useState([]);
  const [bestCard, setBestCard] = useState(null);
  const [bestCashBack, setBestCashBack] = useState(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/');
      return;
    }

    console.log("Current User:", currentUser);
    const userObject = JSON.parse(localStorage.getItem("users/" + currentUser.email)) || {};
    console.log("User Object from Local Storage:", userObject);

    const storedLocations = userObject.locations || [];
    console.log("Stored Locations:", storedLocations);

    if (storedLocations.length > 0) {
      setLocations(storedLocations);
      console.log("Locations state set:", storedLocations);
    } else {
      console.log("No stored locations found for user:", currentUser.email);
    }

    const storedCards = userObject.cards || [];
    setCards(storedCards);
  }, [currentUser, navigate]);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    const locationIndex = locations.indexOf(selectedValue);
    const location = locations[locationIndex];
    console.log(locations);
    console.log(location);
    setSelectedLocation(location);

    // Find the card with the highest cashback percentage for the selected location
    let highestCashback = 0;
    let bestCard = null;
    cards.forEach(card => {
      const cashback = card.cashBacks[selectedValue];
      if (cashback && cashback > highestCashback) {
        highestCashback = cashback;
        bestCard = card.name;
      }
    });
    setBestCard(bestCard);
    setBestCashBack(highestCashback);
  };

  return (
    <main>
      <div id="main-div">
        <select id="dropdown" title="Location" name="location_selection" onChange={handleSelectionChange} defaultValue="">
          <option value="" disabled>Select Location (Database data)</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <br />
    
        {selectedLocation && (
          <div id="cashback-div">
            <h2>{selectedLocation}</h2>
            {bestCard ? (
              <>
                <p>Use your {bestCard} card!</p>
                <p>You will earn {bestCashBack}% back</p>
              </>
            ) : (
              <p>No card found</p>
            )}
          </div>
        )}
    
        <br />
        <br />
      </div> 
    </main>
  );
}