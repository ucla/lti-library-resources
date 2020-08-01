const { MongoClient } = require('mongodb');
require('dotenv').config();

// Mongo setup
const mongourl = process.env.MONGO_URL;
const dbResearchName = process.env.DB_RESEARCH_STATS;
const dbReservesName = process.env.DB_RESERVES_STATS;

const client = new MongoClient(mongourl, { useUnifiedTopology: true });

let stats = {};

/**
 * Returns Library stats for a given class.
 *
 * @param {string} srs SRS number
 * @returns {object}   Stats
 */
async function getStats(srs) {
  await client.connect();
  console.log('Connected correctly to mongodb server - addResearchStat');

  const dbResearch = client.db(dbResearchName);
  const dbReserves = client.db(dbReservesName);
  const reservesCount = await dbReserves.collection(srs).countDocuments({});
  const researchCount = await dbResearch.collection(srs).countDocuments({});
  console.log(reservesCount);
  return { reservesCount, researchCount };
}

/**
 * Adds student to the reserve stats
 *
 * @param {string} srs SRS number
 * @param {string} student Student ID
 * @returns {object}   Update Status
 */
async function addReserveStat(srs, student) {
  await client.connect();
  console.log('Connected correctly to mongodb server - addReserveStat');
  const dbReserves = client.db(dbReservesName);
  const updateStatus = await dbReserves.collection(srs).update(
    { student },
    {
      student,
      lastUpdated: Date.now(),
    },
    { upsert: true }
  );
  return updateStatus;
}

/**
 * Adds student to the research stats
 *
 * @param {string} srs SRS number
 * @param {string} student Student ID
 * @returns {object}   Update Status
 */
async function addResearchStat(srs, student) {
  await client.connect();
  console.log('Connected correctly to mongodb server');
  const dbResearch = client.db(dbResearchName);
  const updateStatus = await dbResearch.collection(srs).update(
    { student },
    {
      student,
      lastUpdated: Date.now(),
    },
    { upsert: true }
  );
  return updateStatus;
}

stats = {
  getStats,
  addResearchStat,
  addReserveStat,
};

module.exports = stats;
