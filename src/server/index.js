require('dotenv').config();
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const apiRouter = require('./api');

// MongoDB config
const mongourl = process.env.MONGO_URL;
const dbName = process.env.DB_LIB_STATS;

const client = new MongoClient(mongourl, { useUnifiedTopology: true });

// Requiring LTIJS provider
const Lti = require('ltijs').Provider;

// Creating a provider instance
let options = {};
if (process.env.MODE === 'production') {
  options = {
    staticPath: path.join(__dirname, '../../dist'), // Path to static files
    cookies: { secure: false },
  };
}
const lti = new Lti(
  process.env.LTI_KEY,
  // Setting up database configurations
  {
    url: `mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
    connection: { user: process.env.DB_USER, pass: process.env.DB_PASS },
  },
  options
);

// When receiving successful LTI launch redirects to app.
lti.onConnect(async (token, req, res) => {
  if (process.env.MODE === 'production') {
    return res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }
  const result = await lti.NamesAndRoles.getMembers(res.locals.token);
  const numMembers = result.members.length;
  await client.connect();
  console.log('Connected correctly to mongodb server - addMembers');
  const dbStats = client.db(dbName);
  const srs = res.locals.context.context.id;
  console.log(srs);
  const updateStatus = await dbStats
    .collection('stats')
    .update({ srs }, { $set: { numMembers } });
  return lti.redirect(res, 'http://localhost:3000');
});

// Routes
lti.app.use('/api', apiRouter);

async function setup() {
  // Deploying provider, connecting to the database and starting express server.
  await lti.deploy({ port: 8080 });

  // Register platform, if needed.
  await lti.registerPlatform({
    url: process.env.PLATFORM_URL,
    name: 'Platform',
    clientId: process.env.PLATFORM_CLIENTID,
    authenticationEndpoint: process.env.PLATFORM_ENDPOINT,
    accesstokenEndpoint: process.env.PLATFORM_TOKEN_ENDPOINT,
    authConfig: {
      method: 'JWK_SET',
      key: process.env.PLATFORM_KEY_ENDPOINT,
    },
  });

  // Get the public key generated for that platform.
  const plat = await lti.getPlatform(process.env.PLATFORM_URL);
  console.log(await plat.platformPublicKey());
}

setup();

module.exports = lti;
