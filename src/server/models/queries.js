require('dotenv').config();
const client = require('./db');

const mongourl = process.env.DB_URL;
const dbName = process.env.DB_DATABASE;

module.exports.getReservesByTerm = async (dbCollection, academicTerm) => {
  client.connect(mongourl);
  let query = {};
  if (academicTerm) {
    query = { term: academicTerm };
  }

  const recordsForTerm = await client
    .db(dbName)
    .collection(dbCollection)
    .find(query)
    .toArray();
  return recordsForTerm;
};

module.exports.getCrosslistsByShortname = async (dbCollection, shortname) => {
  client.connect(mongourl);

  const course = await client
    .db(dbName)
    .collection(dbCollection)
    .findOne({ shortname });
  if (!course) {
    return [];
  }
  const result = [];
  course.crosslists.forEach(crosslist => {
    result.push(crosslist.shortname);
  });
  return result;
};

module.exports.getReserveByShortname = async (dbCollection, shortname) => {
  client.connect(mongourl);
  const query = { shortname };

  const reserve = await client
    .db(dbName)
    .collection(dbCollection)
    .findOne(query);
  if (!reserve) {
    return '';
  }
  return reserve.url;
};
