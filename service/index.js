const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const app = express();
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ noServer: true });

const connections = [];

wss.on('connection', (ws) => {
  const connection = { id: uuid.v4(), alive: true, ws: ws};
  connections.push(connection);

  ws.on('close', () => {
    const pos = connections.findIndex((o) => o.id === connection.id);
    if (pos >= 0) {
      connections.splice(pos, 1);
    }
  });

  ws.on('pong', () => {
    connection.alive = true;
  });
});

setInterval(() => {
  connections.forEach((c) => {
    if (!c.alive) {
      c.ws.terminate();
    } else {
      c.alive = false;
      c.ws.ping();
    }
  });
}, 5000);


// The scores and users are saved in memory and disappear whenever the service is restarted.
// let users = [];

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

    // const existingUser = await findUser('email', req.body.email);
    // if (existingUser) {
    //   console.log('User with this email already exists:', req.body.email);
    //   return res.status(409).json({ msg: 'Existing user' });
    // }

    // const user = await createUser(req.body.email, req.body.password);
    // res.json({ email: user.email, token: user.token });
    res.json({ email: req.body.email, token: uuid.v4() });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// // Function to create a new user
// async function createUser(email, password) {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = { email, password: hashedPassword, locations: [], cards: [], token: uuid.v4() };
  
//   DB.addUser(user);

//   return user;
// }

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  console.log('Received request to login:', req.body);

  // const user = await findUser('email', req.body.email);
  // if (user) {
  //   if (await bcrypt.compare(req.body.password, user.password)) {
  //     user.token = uuid.v4();
  //     await DB.updateUser(user);
  //     res.send({ email: user.email, token: user.token });
  //     return;
  //   }
  // }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  // const user = await findUser('email', req.body.email);
  // if (user) {
  //   delete user.token;
  //   res.status(204).end();
  // } else {
  //   res.status(401).send({ msg: 'Unauthorized' });
  // }
  res.status(204).end();
});

// GetLocations
apiRouter.get('/locations', verifyAuth, async (req, res) => {
  console.log('Received request to get locations:', req.body);

  // const user = await DB.getUser(req.user.email);
  // res.send(user.locations);
  res.send([]);
});

// AddLocation
apiRouter.post('/locations', verifyAuth, async (req, res) => {
  const user = req.user;
  const location = req.body.location;
  // await DB.addLocation(user,location);  
  // const user1 = await DB.getUser(req.user.email);
  // res.send(user1.locations);
  res.send([]);
});

// RemoveLocation
apiRouter.delete('/locations', verifyAuth, async (req, res) => {
  const user = req.user;
  const location = req.body.location;
  // await DB.removeLocation(user,location);
  // const user1 = await DB.getUser(req.user.email);
  // res.send(user1.locations);
  res.send([]);
});

// GetCards
apiRouter.get('/cards', verifyAuth, async (req, res) => {
  // const Cards = await DB.getCards(req.user.email)
  // res.send(Cards);
  res.send([]);
});

// AddCard
apiRouter.post('/cards', verifyAuth, async (req, res) => {
  const user = req.user;
  const cardId = req.body.cardId;
  
  // await DB.addCard(user,cardId);  
  // const Cards = await DB.getCards(req.user.email)
  // res.send(Cards);
  res.send([]);
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
apiRouter.delete('/cards', verifyAuth, async (req, res) => {
  const user = req.user;
  const cardId = req.body.cardId;
  console.log(user,cardId);
  // await DB.removeCard(user,cardId);  
  // const Cards = await DB.getCards(req.user.email)
  // res.send(Cards);
  res.send([]);
});

// AddLocationToCard
apiRouter.post('/cards/:cardId/locations', verifyAuth, async (req, res) => {
  const user = req.user;
  const cardId = req.params.cardId;
  const { location, cashback } = req.body;
  // DB.addLocationToCard(user, cardId, location, cashback);
  // const Cards = await DB.getCards(req.user.email)
  // res.send(Cards);
  res.send([]);
});

// RemoveLocationFromCard
apiRouter.delete('/cards/:cardId/locations', verifyAuth, async (req, res) => {
  const user = req.user;
  const cardId = req.params.cardId;
  const { location } = req.body;
  console.log("Info", user, cardId, location);
  // await DB.removeLocationFromCard(user, cardId, { location });
  // const Cards = await DB.getCards(req.user.email)
  // res.send(Cards);
  res.send([]);
});

// AddStore
apiRouter.post('/addStore', verifyAuth, async (req, res) => {
  const { location } = req.body;
  // await DB.addStore({ location });  

  connections.forEach((c) => {
    c.ws.send(JSON.stringify({type: 'update', message: 'Stored added'}));
  })
});

// GetPopularStore
apiRouter.get('/popular-store', verifyAuth, async (req, res) => {
  // const store = await DB.getMostPopularStore();
  // res.send(store);
  res.send([]);
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
    console.error('Error verifying user');
  }
}

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
