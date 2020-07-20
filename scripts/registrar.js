var axios = require('axios');
var https = require('https'); 
var fs = require('fs'); 
require('dotenv').config();

var data = 'grant_type=client_credentials';
const certFile = process.env.CERT_NAME; 
const keyFile = process.env.PRIVATE_KEY;

const httpsAgent = new https.Agent({
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile), 
  }); 

var config = {
  method: 'post',
  url: 'https://webservicesqa.it.ucla.edu:4443/oauth2/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  auth: {
    username: process.env.CLIENT_ID,
    password: process.env.SECRET
  },
  data : data,
  httpsAgent: httpsAgent
};

const registrar = {
    async newToken() {
        try {
            const response = await axios(config, httpsAgent); 
            const {access_token: token} = response.data; 
            console.log("token generated. ");
            return token; 
        } catch (error) {
            console.log(error); 
        }
    },
    async getShortname(token, term, srs) {
        try {
            var config = {
                method: 'get',
                url: ('https://webservicesqa.it.ucla.edu/sis/api/v1/Dictionary/' + term + '/' 
                    + srs + '/CourseClassIdentifiers'),
                headers: { 
                  'esmAuthnClientToken': token
                }
              };
            const response = await axios(config); 
            if (response.status == 200)
            {
                const {courseClassIdentifiers: [{courseClassIdentifierCollection:[
                    {subjectAreaCode:subArea, courseCatalogNumber:catNum, classSectionNumber:secNum}]}]} = response.data; 
                const updateCatNum = (catNum.charAt(catNum.length - 1) == 'M') ? ('M' + catNum.replace(/\s|M|^0+/g, '')) : (catNum.replace(/\s|^0+/g, ''));
                const shortname = (term + '-' + subArea.replace(/\s|&/g, '') + updateCatNum + '-' + secNum.replace(/^0+/g, '')); 
                console.log(shortname); 
                return shortname;  
            }
        } catch (error) {
            return("-1");  
        }
    }
}; 

module.exports = registrar;