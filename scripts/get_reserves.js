const got = require('got'); 
const MongoClient = require('mongodb').MongoClient;
var parseString = require('xml2js').parseString;
const registrar = require("./registrar"); 
require('dotenv').config(); 

// Mongo values
const mongourl = 'mongodb://localhost:27017';
const dbName = 'course_reserves';

const client = new MongoClient(mongourl);

// test with 20S - URLs are empty though
const args = process.argv.slice(2);
if (args.length != 1) {
    console.log("Usage: node script.js TERM");
}
let term = args[0];  

(async () => {
	try {
        let DBentries = []; 

        // get token to query registrar
        const token = await registrar.newToken(); 
        console.log(token); 

        // connect to mongodb 
        await client.connect();
        console.log("Connected correctly to mongodb server");
        const db = client.db(dbName);
        
        // get dept IDs which have course reserves
        const response = await got('https://webservices.library.ucla.edu/reserves/departments/during/' + term);
        let dept_IDs = [];
        parseString(response.body, function (err, result) {
            const {departmentList: {department: depts}} = result; 
            dept_IDs = depts.map(dept => dept.departmentID[0]); 
        }); 

        // get courses from the department IDs 
        const num_depts = dept_IDs.length; 
        for (let i = 0; i < num_depts; i++) {
            //process.stdout.clearLine();
            //process.stdout.cursorTo(0);
            //const str = (((i + 1)/num_depts * 100).toPrecision(3).toString() + "% complete"); 
            //process.stdout.write(str);
            const dept_response = await got('https://webservices.library.ucla.edu/reserves/courses/dept/' 
                + dept_IDs[i] + '/term/' + term);

            let courses = []; 
            parseString(dept_response.body, function (err, result) { 
                const {courseList: {course: courses_obj}} = result; 
                courses = courses_obj; 
            });

            for (let j = 0; j < courses.length; j++) {
                const srs = courses[j].srsNumber[0];
                const url = courses[j].url[0]; 
                const shortname = await registrar.getShortname(token, term, srs);  
                if (shortname != "-1") {
                    exists = await db.collection('reserves').countDocuments({"shortname": shortname}, { limit: 1 });   
                    if (exists == 0) {
                        await db.collection('reserves').insertOne({url: url, shortname: shortname});
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