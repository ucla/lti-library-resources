const { MongoClient } = require('mongodb');
const util = require('util');
require('dotenv').config();

// Mongo setup
const mongourl = process.env.MONGO_URL;
const dbName = process.env.DB_DATABASE;

const client = new MongoClient(mongourl, { useUnifiedTopology: true });

let stats = {};

/**
 * Returns Library stats for a given class.
 *
 * @returns {object}   Stats
 */
async function getStats() {
  await client.connect();

  const dbStats = client.db(dbName);
  const cursor = await dbStats.collection('stats').find();
  const result = await cursor.toArray();
  result.map(
    x =>
      (x.reserve_clicks =
        x.reserve_clicks === undefined ? 0 : x.reserve_clicks.length)
  );
  result.map(
    x =>
      (x.research_clicks =
        x.research_clicks === undefined ? 0 : x.research_clicks.length)
  );
  return result;
}

/**
 * Adds student to the reserve stats
 *
 * @param {string} srs SRS number
 * @param {string} type Type of stat
 * @param {string} student Student ID
 * @param {string} shortname Class shortname
 * @returns {object}   Update Status
 */
async function addStat(type, srs, student, shortname) {
  await client.connect();
  const dbStats = client.db(dbName);
  const typeField = `${type}_clicks`;
  const totalTypeField = `total_${type}_clicks`;
  const updateStatus = await dbStats.collection('stats').update(
    { srs },
    {
      $addToSet: { [typeField]: student },
      $set: { lastUpdated: Date.now(), shortname },
      $inc: { [totalTypeField]: 1 },
    },
    { upsert: true }
  );
  return updateStatus;
}

stats = {
  getStats,
  addStat,
};

module.exports = stats;
