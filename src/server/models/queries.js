require('dotenv').config();
const client = require('./db');

const mongourl = process.env.DB_URL;
const dbName = process.env.DB_DATABASE;

module.exports.getReservesByTerm = async (dbCollection, academicTerm) => {
  client.connect(mongourl);
  const query = { term: academicTerm };

  const recordsForTerm = await client
    .db(dbName)
    .collection(dbCollection)
    .find(query)
    .toArray();
  return recordsForTerm;
};
