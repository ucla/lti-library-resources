const axios = require('axios');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const data = 'grant_type=client_credentials';
const certFile = process.env.CERT_NAME;
const keyFile = process.env.PRIVATE_KEY;

const httpsAgent = new https.Agent({
  cert: fs.readFileSync(certFile),
  key: fs.readFileSync(keyFile),
});

const tokenConfig = {
  method: 'post',
  url: `${process.env.REGISTRAR_API_URL}:4443/oauth2/token`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  auth: {
    username: process.env.CLIENT_ID,
    password: process.env.SECRET,
  },
  data,
  httpsAgent,
};

async function getToken() {
  try {
    const response = await axios(tokenConfig, httpsAgent);
    const { access_token: token } = response.data;
    return token;
  } catch (error) {
    console.log(error);
  }
}
async function cacheToken(token) {
  try {
    process.env.reg_token = token;
  } catch (error) {
    console.log(error);
  }
}
async function refreshToken() {
  try {
    const token = await registrar.getToken();
    await registrar.cacheToken(token);
    return token;
  } catch (error) {
    console.log(error);
  }
}
async function call(url, method) {
  try {
    const config = {
      method,
      url,
      headers: {
        esmAuthnClientToken:
          process.env.reg_token === undefined
            ? await registrar.refreshToken()
            : process.env.reg_token,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      // Token may have expired
      const config = {
        method,
        url,
        headers: {
          esmAuthnClientToken: await registrar.refreshToken(),
        },
      };
      const retryResponse = await axios(config);
      if (retryResponse.status === 200) {
        return retryResponse.data;
      }
    }
    return null;
  }
}
async function getShortname(url) {
  try {
    const response = await registrar.call(url, 'get');
    if (response === null) return null;
    const {
      courseClassIdentifiers: [
        {
          courseClassIdentifierCollection: [
            {
              subjectAreaCode: subArea,
              courseCatalogNumber: catNum,
              classSectionNumber: secNum,
            },
          ],
        },
      ],
    } = response;
    const updateCatNum =
      catNum.charAt(catNum.length - 1) === 'M'
        ? `M${catNum.replace(/\s|M|^0+/g, '')}`
        : catNum.replace(/\s|^0+/g, '');
    const shortname = `${'20S'}-${subArea.replace(
      /\s|&/g,
      ''
    )}${updateCatNum}-${secNum.replace(/^0+/g, '')}`;
    return shortname;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const registrar = {
  getShortname,
  call,
  getToken,
  cacheToken,
  refreshToken,
};

module.exports = registrar;
