const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const app = express();

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use the cors middleware to allow cross-origin requests
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow cookies to be sent with requests
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
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    res.send({ email: user.email });
  }
});

// Function to create a new user
async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword, locations: [], cards: [] };
  users.push(user);
  return user;
}

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
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
apiRouter.get('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  res.send(user.locations);
});

// AddLocation
apiRouter.post('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const location = req.body.location;
  if (!user.locations.includes(location)) {
    user.locations.push(location);
  }
  res.send(user.locations);
});

// RemoveLocation
apiRouter.delete('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const location = req.body.location;
  user.locations = user.locations.filter(loc => loc !== location);
  res.send(user.locations);
});

// GetCards
apiRouter.get('/cards', verifyAuth, (req, res) => {
  const user = req.user;
  res.send(user.cards);
});

// AddCard
apiRouter.post('/cards', verifyAuth, (req, res) => {
  try {
    const user = req.user;
    const cardId = req.body.cardId;
    console.log(user);
    if (!user.cards.find(card => card.cardId === cardId)) {
      user.cards.push({ cardId, locations: [] });
    }
    res.send(user.cards);
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// RemoveCard
apiRouter.delete('/cards', verifyAuth, (req, res) => {
  const user = req.user;
  const cardId = req.body.cardId;
  user.cards = user.cards.filter(card => card.cardId !== cardId);
  res.send(user.cards);
});

// AddLocationToCard
apiRouter.post('/cards/:cardId/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const cardId = req.params.cardId;
  const { location, cashback } = req.body;
  const card = user.cards.find(card => card.cardId === cardId);
  if (card && !card.locations.find(loc => loc.location === location)) {
    card.locations.push({ location, cashback });
  }
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
  const user = users.find(user => user.token === token);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

app.get('*', (_req, res) => {
  res.send({ msg: 'Simon service' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});