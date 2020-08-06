const axios = require('axios');
const { MongoClient } = require('mongodb');
const winston = require('winston');
const registrar = require('../services/registrar');
require('dotenv').config();

// Winston setup
const logger = winston.createLogger({
  format: winston.format.prettyPrint(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `logs/get_reserves-${Date.now}.log`,
    }),
  ],
});

// Mongo values
const mongourl = process.env.DB_URL;
const dbName = process.env.DB_DATABASE;

const client = new MongoClient(mongourl, { useUnifiedTopology: true });

// Test with 20S - URLs are empty though
const args = process.argv.slice(2);
if (args.length !== 1) {
  logger.error('ERROR: Bad arguments. Usage: node script.js TERM');
  process.exit();
}
const term = args[0];

(async () => {
  try {
    // Connect to mongodb
    await client.connect();
    logger.info({ message: 'Connected correctly to mongodb server', term });
    const db = client.db(dbName);
    const srsArray = [];

    // Get dept IDs which have course reserves
    const response = await axios(
      `https://webservices.library.ucla.edu/reserves/departments/during/${term}`
    );
    // Console.log(response.data);
    const { department: depts } = response.data;

    const deptIDs = depts.map(dept => dept.departmentID);
    const deptCodes = depts.map(dept => dept.departmentCode);
    const deptNames = depts.map(dept => dept.departmentName);

    // Get courses from the department IDs
    const numDepts = deptIDs.length;
    for (let i = 0; i < numDepts; i += 1) {
      const deptResponse = await axios(
        `https://webservices.library.ucla.edu/reserves/courses/dept/${deptIDs[i]}/term/${term}`
      );

      const { course: courses } = deptResponse.data;

      for (let j = 0; j < courses.length; j += 1) {
        const srs = courses[j].srsNumber;
        const { courseName } = courses[j];
        const { courseNumber } = courses[j];
        const { url } = courses[j];
        logger.info({ message: 'Processing', srs, term });
        srsArray.push(srs);
        const shortname = await registrar.getShortname(term, srs);
        if (shortname !== null) {
          const updateStatus = await db.collection('reserves').update(
            { srs },
            {
              url,
              srs,
              shortname,
              courseName,
              courseNumber,
              term,
              lastUpdated: Date.now(),
              deptCode: deptCodes[i],
              deptName: deptNames[i],
            },
            { upsert: true }
          );
          logger.info({
            message: updateStatus.nUpserted
              ? 'Insert DB entry'
              : 'Update DB entry',
            url,
            srs,
            shortname,
            courseName,
            courseNumber,
            term,
            lastUpdated: Date.now(),
            deptCode: deptCodes[i],
            deptName: deptNames[i],
          });
        } else {
          logger.error({ message: 'Registrar returned null', srs, term });
        }
      }
    }
    // Do the collection cleanup here
    const deleteStatus = await db
      .collection('reserves')
      .deleteMany({ $and: [{ term }, { srs: { $nin: srsArray } }] });
    logger.info({
      message: 'Delete DB entry',
      count: deleteStatus.deletedCount,
      term,
    });
    client.close();
  } catch (error) {
    logger.error({ message: error, term });
  }
})();
