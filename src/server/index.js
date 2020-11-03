require('dotenv').config();
const path = require('path');
const lti = require('ltijs').Provider;
const { MongoClient } = require('mongodb');
const apiRouter = require('./api');

// Creating a provider instance
let options = {};
if (process.env.MODE === 'production') {
  options = {
    staticPath: path.join(__dirname, '../../dist'), // Path to static files
    cookies: { secure: false },
  };
}

// MongoDB config
const dbName = process.env.DB_DATABASE;
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

const approute = process.env.LTI_APPROUTE ? process.env.LTI_APPROUTE : '';
options.appRoute = approute;
options.loginRoute = `${approute}/login`;
options.keysetRoute = `${approute}/keys`;
options.invalidTokenRoute = `${approute}/invalidtoken`;
options.sessionTimeoutRoute = `${approute}/sessiontimeout`;

lti.setup(
  process.env.SECRET_LTI_KEY,
  // Setting up database configurations
  { url: process.env.DB_URL },
  options
);

// When receiving successful LTI launch redirects to app.
lti.onConnect(async (token, req, res) => {
  // On LTI launch, add the number of class members to the analytics database
  const result = await lti.NamesAndRoles.getMembers(res.locals.token);
  if (!result) {
    console.log('getMembers returned null');
  } else {
    const numMembers = result.members.length;
    await client.connect();
    const dbAnalytics = client.db(dbName);
    // Additionally, add shortname and contextId to analytics database entry
    const contextId = res.locals.context.context.id;
    const shortname = res.locals.context.context.label;
    await dbAnalytics.collection('analytics').updateOne(
      { contextId },
      {
        $set: {
          numMembers,
          shortname,
          lastUpdated: Date.now(),
        },
      },
      { upsert: true }
    );
  }
  if (process.env.MODE === 'production') {
    return res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }

  return lti.redirect(res, `http://localhost:${process.env.CLIENTPORT}`);
});

// Routes
lti.app.use(`${process.env.LTI_APPROUTE}/api`, apiRouter);

/**
 *
 */
async function setup() {
  // Deploying provider, connecting to the database and starting express server.
  const port = process.env.SERVERPORT ? process.env.SERVERPORT : 8080;
  await lti.deploy({ port });

  // Register platform, if needed.
  await lti.registerPlatform({
    url: process.env.PLATFORM_URL,
    name: 'Platform',
    clientId: process.env.SECRET_PLATFORM_CLIENTID,
    authenticationEndpoint: process.env.PLATFORM_ENDPOINT,
    accesstokenEndpoint: process.env.PLATFORM_TOKEN_ENDPOINT,
    authConfig: {
      method: 'JWK_SET',
      key: process.env.PLATFORM_KEY_ENDPOINT,
    },
  });

  // Get the public key generated for that platform.
  const plat = await lti.getPlatform(
    process.env.PLATFORM_URL,
    process.env.SECRET_PLATFORM_CLIENTID
  );
  console.log(await plat.platformPublicKey());
}

setup();
