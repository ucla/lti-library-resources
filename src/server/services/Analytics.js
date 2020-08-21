require('dotenv').config();

// Mongo setup
const mongourl = process.env.DB_URL;
const dbName = process.env.DB_DATABASE;
const client = require('../models/db');

let analytics = {};

/**
 * Returns Library analytics for a given class.
 *
 * @returns {object}   Analytics
 */
async function getAnalytics() {
  await client.connect(mongourl);
  const dbAnalytics = client.db(dbName);
  const cursor = await dbAnalytics.collection('analytics').find();
  const result = await cursor.toArray();

  result.map(x => {
    x.reserve_clicks =
      x.reserve_clicks === undefined ? 0 : x.reserve_clicks.length;
    x.research_clicks =
      x.research_clicks === undefined ? 0 : x.research_clicks.length;
    x.lib_tour_clicks =
      x.lib_tour_clicks === undefined ? 0 : x.lib_tour_clicks.length;
    x.research_tuts_clicks =
      x.research_tuts_clicks === undefined ? 0 : x.research_tuts_clicks.length;

    x.total_reserve_clicks =
      x.total_reserve_clicks === undefined ? 0 : x.total_reserve_clicks;
    x.total_research_clicks =
      x.total_research_clicks === undefined ? 0 : x.total_research_clicks;
    x.total_lib_tour_clicks =
      x.total_lib_tour_clicks === undefined ? 0 : x.total_lib_tour_clicks;
    x.total_research_tuts_clicks =
      x.total_research_tuts_clicks === undefined
        ? 0
        : x.total_research_tuts_clicks;
    return result;
  });

  return result;
}

/**
 * Adds student to the reserve analytics
 *
 * @param {string} type Type of stat
 * @param {string} contextId Context id from LTI context
 * @param {string} student Student ID
 * @param {string} shortname Class shortname
 * @returns {object}   Update Status
 */
async function addAnalytics(type, contextId, student, shortname) {
  await client.connect(mongourl);
  const dbAnalytics = client.db(dbName);
  const typeField = `${type}_clicks`;
  const totalTypeField = `total_${type}_clicks`;
  const updateStatus = await dbAnalytics.collection('analytics').updateOne(
    { contextId },
    {
      $addToSet: { [typeField]: student },
      $set: { lastUpdated: Date.now(), shortname },
      $inc: { [totalTypeField]: 1 },
    },
    { upsert: true }
  );
  return updateStatus;
}

analytics = {
  getAnalytics,
  addAnalytics,
};

module.exports = analytics;
