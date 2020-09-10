require('dotenv').config();

// Mongo setup
const mongourl = process.env.DB_URL;
const dbName = process.env.DB_DATABASE;
const client = require('../models/db');

let analytics = {};

/**
 * Get percentage from data
 *
 * @param {object} clicks Array of clicks
 * @param {number} members Total members
 * @returns {string}   Percentage who clicked
 */
function percentOf(clicks, members) {
  return `${((clicks.length * 100) / members).toPrecision(3)}%`;
}

/**
 * Returns Library analytics for a given class.
 *
 * @param {object} collName For testing
 * @returns {object}   Analytics
 */
async function getAnalytics(collName = 'analytics') {
  await client.connect(mongourl);
  const dbAnalytics = client.db(dbName);
  const cursor = await dbAnalytics.collection(collName).find();
  const result = await cursor.toArray();
  result.forEach(function(x) {
    delete x._id;
    delete x.lastUpdated;
  });
  result.map(x => {
    x.reserveClicks =
      x.reserveClicks === undefined
        ? '0%'
        : percentOf(x.reserveClicks, x.numMembers);
    x.researchClicks =
      x.researchClicks === undefined
        ? '0%'
        : percentOf(x.researchClicks, x.numMembers);
    x.libTourClicks =
      x.libTourClicks === undefined
        ? '0%'
        : percentOf(x.libTourClicks, x.numMembers);
    x.researchTutsClicks =
      x.researchTutsClicks === undefined
        ? '0%'
        : percentOf(x.researchTutsClicks, x.numMembers);

    x.reserveClicksTotal =
      x.reserveClicksTotal === undefined ? 0 : x.reserveClicksTotal;
    x.researchClicksTotal =
      x.researchClicksTotal === undefined ? 0 : x.researchClicksTotal;
    x.libTourClicksTotal =
      x.libTourClicksTotal === undefined ? 0 : x.libTourClicksTotal;
    x.researchTutsClicksTotal =
      x.researchTutsClicksTotal === undefined ? 0 : x.researchTutsClicksTotal;
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
 * @param {string} collName For testing
 * @returns {object}   Update Status
 */
async function addAnalytics(
  type,
  contextId,
  student,
  shortname,
  collName = 'analytics'
) {
  await client.connect(mongourl);
  const dbAnalytics = client.db(dbName);
  const typeField = `${type}Clicks`;
  const typeFieldTotal = `${type}ClicksTotal`;
  const updateStatus = await dbAnalytics.collection(collName).updateOne(
    { contextId },
    {
      $addToSet: { [typeField]: student },
      $set: { lastUpdated: Date.now(), shortname },
      $inc: { [typeFieldTotal]: 1 },
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
