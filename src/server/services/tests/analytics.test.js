// To run: yarn test
import Analytics from '../Analytics.js';

const mongourl = process.env.DB_URL;
const dbName = process.env.DB_DATABASE;
const client = require('../../models/db');

require('dotenv').config();

// Sets the class size
beforeAll(async done => {
  await client.connect(mongourl);
  const dbAnalytics = client.db(dbName);
  await dbAnalytics.collection('test-analytics').updateOne(
    { contextId: '0000' },
    {
      $set: {
        numMembers: 100,
        shortname: 'Class',
      },
    },
    { upsert: true }
  );
  done();
});

// User's db entry is empty
test('User db entry empty', async done => {
  const response = await Analytics.getAnalytics('test-analytics');
  expect(response[0].research_clicks).toEqual(undefined);
  done();
});

// Add first view
test('Add first view', async done => {
  await Analytics.addAnalytics(
    'research',
    '0000',
    'Stu Dent',
    'Class',
    'test-analytics'
  );
  const response = await Analytics.getAnalytics('test-analytics');
  expect(response[0].researchClicks).toEqual('1.00%');
  done();
});

// Percentage unaffected by subsequent clicks
test('Percentage unaffected', async done => {
  await Analytics.addAnalytics(
    'research',
    '0000',
    'Stu Dent',
    'Class',
    'test-analytics'
  );
  const response = await Analytics.getAnalytics('test-analytics');
  expect(response[0].researchClicks).toEqual('1.00%');
  done();
});

// Empties out the test-analytics collection
afterAll(async done => {
  const dbAnalytics = client.db(dbName);
  await dbAnalytics.collection('test-analytics').drop();
  await client.close();
  done();
});
