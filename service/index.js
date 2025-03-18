const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const DB = require('./database.js');
const uuid = require('uuid');
const app = express();

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Enable CORS for production
app.use(cors({
  origin: 'https://startup.cardcash.click/', // Replace with your production domain
  credentials: true
}));

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  try {
    console.log('Received request to create user:', req.body);

    const existingUser = await findUser('email', req.body.email);
    if (existingUser) {
      console.log('User with this email already exists:', req.body.email);
      return res.status(409).json({ msg: 'Existing user' });
    }

    const user = await createUser(req.body.email, req.body.password);
    res.json({ email: user.email, token: user.token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// Function to create a new user
async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword, locations: [], cards: [], token: uuid.v4() };
  
  DB.addUser(user);

  return user;
}

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  console.log('Received request to login:', req.body);

  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      res.send({ email: user.email, token: user.token });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    delete user.token;
    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetLocations
apiRouter.get('/locations', verifyAuth, async (req, res) => {
  console.log('Received request to get locations:', req.body);

  const user = await DB.getUser(req.user.email);
  res.send(user.locations);
});

// AddLocation
apiRouter.post('/locations', verifyAuth, async (req, res) => {
  const user = req.user;
  const location = req.body.location;
  DB.addLocation(user,location);  
  res.send(user.locations);
});

// RemoveLocation
apiRouter.delete('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const location = req.body.location;
  DB.removeLocation(user,location);  
  res.send(user.locations);
});

// GetCards
apiRouter.get('/cards', verifyAuth, async (req, res) => {
  const Cards = await DB.getCards(req.user.email)
  res.send(Cards);
});

// AddCard
apiRouter.post('/cards', verifyAuth, async (req, res) => {
  const user = req.user;
  const cardId = req.body.cardId;
  
  await DB.addCard(user,cardId);  
  const updatedUser = await DB.getUser(user.email);
  res.send(updatedUser.cards);

});

// Function to find a user by a specific field
async function findUser(field, value) {
  if (!value) return null;

  if (field == 'token') {
    return DB.getUserByToken(value);
  }

  return DB.getUser(value);
}

// RemoveCard
apiRouter.delete('/cards', verifyAuth, (req, res) => {
  const user = req.user;
  const cardId = req.body.cardId;
  
  DB.removeCard(user,cardId);  
  res.send(user.cards);
});

// AddLocationToCard
apiRouter.post('/cards/:cardId/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const cardId = req.params.cardId;
  const { location, cashback } = req.body;
  DB.addLocationToCard(user, cardId, location, cashback);
  
  res.send(user.cards);
});

// RemoveLocationFromCard
apiRouter.delete('/cards/:cardId/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const cardId = req.params.cardId;
  const location = req.body.location;
  const card = user.cards.find(card => card.cardId === cardId);
  if (card) {
    card.locations = card.locations.filter(loc => loc.location !== location);
  }
  res.send(user.cards);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Middleware to verify authentication
async function verifyAuth(req, res, next) {
  const token = req.headers['authorization'];
  console.error("token", token);
  try {
    const user = await DB.getUserByToken(token)
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({msg: 'Unauthorized'});
    }
  } catch {
    consle.error('Error verifying user');
  }
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});