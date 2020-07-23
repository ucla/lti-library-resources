const got = require('got');
const { MongoClient } = require('mongodb');
const { parseString } = require('xml2js');
const registrar = require('./registrar');
require('dotenv').config();

// Mongo values
const mongourl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

const client = new MongoClient(mongourl, { useUnifiedTopology: true });

// test with 20S - URLs are empty though
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('ERROR: Bad arguments. Usage: node script.js TERM');
  process.exit();
}
const term = args[0];

(async () => {
  try {
    // connect to mongodb
    await client.connect();
    console.log('Connected correctly to mongodb server');
    const db = client.db(dbName);

    // get dept IDs which have course reserves
    const response = await got(
      `https://webservices.library.ucla.edu/reserves/departments/during/${term}`
    );
    let deptIDs = [];
    parseString(response.body, function(err, result) {
      const {
        departmentList: { department: depts },
      } = result;
      deptIDs = depts.map(dept => dept.departmentID[0]);
    });

    // get courses from the department IDs
    const numDepts = deptIDs.length;
    for (let i = 0; i < numDepts; i += 1) {
      // process.stdout.clearLine();
      // process.stdout.cursorTo(0);
      // const str = (((i + 1)/num_depts * 100).toPrecision(3).toString() + "% complete");
      // process.stdout.write(str);
      const deptResponse = await got(
        `https://webservices.library.ucla.edu/reserves/courses/dept/${deptIDs[i]}/term/${term}`
      );

      let courses = [];
      parseString(deptResponse.body, function(err, result) {
        const {
          courseList: { course: coursesObj },
        } = result;
        courses = coursesObj;
      });

      for (let j = 0; j < courses.length; j += 1) {
        const srs = courses[j].srsNumber[0];
        const url = courses[j].url[0];
        const shortname = await registrar.getShortname(
          `${process.env.REGISTRAR_API_URL}/sis/api/v1/Dictionary/${term}/${srs}/CourseClassIdentifiers`
        );
        console.log(`${srs}: ${shortname}`);
        if (shortname !== null) {
          const exists = await db
            .collection('reserves')
            .countDocuments({ shortname }, { limit: 1 });
          if (exists === 0) {
            await db.collection('reserves').insertOne({ url, shortname });
          }
        }
      }
    }
    client.close();
  } catch (error) {
    console.log(error);
  }
})();
// console.log(util.inspect(dept_IDs, false, null, true));
