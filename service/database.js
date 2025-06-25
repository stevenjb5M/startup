// Database logic removed. All data is now managed in local storage via the frontend for demo purposes.

/*
// --- Original MongoDB database code ---
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('cardcash');
const userCollection = db.collection('users');
const storeCollection = db.collection('store');

(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.replaceOne({ email: user.email }, user);
}

async function addLocation(user, location) {
  await userCollection.updateOne({ email: user.email }, { $push: { locations: location } });
}

async function getCards(email) {
  const user1 = await userCollection.findOne({ email: email });
  return user1.cards;
}

async function removeLocation(user, location) {
  await userCollection.updateOne({ email: user.email }, { $pull: { locations: location } });
}

async function addCard(user, cardId) {
  await userCollection.updateOne({ email: user.email }, { $push: { cards: { cardId, locations: [] } } });
}

async function removeCard(user, cardId) {
  await userCollection.updateOne({ email: user.email }, { $pull: { cards: { cardId } } });
}

async function addLocationToCard(user, cardId, location, cashback) {
  await userCollection.updateOne(
    { email: user.email, 'cards.cardId': cardId },
    { $push: { 'cards.$.locations': { location, cashback } } }
  );
}

async function removeLocationFromCard(user, cardId, location) {
  await userCollection.updateOne(
    { email: user.email, 'cards.cardId': cardId },
    { $pull: { 'cards.$.locations': { location } } }
  );
}

async function addStore(store) {
  await storeCollection.insertOne(store);
}

async function getMostPopularStore() {
  return storeCollection.find().sort({ counter: -1 }).limit(1).toArray();
}
*/

function getUser(email) {
  return null;
}

function getUserByToken(token) {
  return null;
}

async function addUser(user) {}

async function updateUser(user) {}

async function addLocation(user, location) {}

async function getCards(email) {
  return [];
}

async function removeLocation(user, location) {}

async function addCard(user, cardId) {}

async function removeCard(user, cardId) {}

async function addLocationToCard(user, cardId, location, cashback) {}

async function removeLocationFromCard(user, cardId, location) {}

async function addStore(store) {}

async function getMostPopularStore() {
  return null;
}

module.exports = {
  getUser,
  addStore,
  getUserByToken,
  addUser,
  addCard,
  getCards,
  removeCard,
  updateUser,
  getMostPopularStore,
  removeLocation,
  removeLocationFromCard,
  addLocation,
  addLocationToCard
};
