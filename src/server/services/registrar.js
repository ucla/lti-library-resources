const axios = require('axios');
const xml2js = require('xml2js');
const registrarDebug = require('debug')('registrar:api');
require('dotenv').config();

let registrar = {};

/**
 * Retrieves token from web service.
 *
 * @returns {string} token
 */
async function getToken() {
  registrarDebug('getToken called');

  const authToken = Buffer.from(
    `${process.env.SECRET_REG_WS_CLIENT_ID}:${process.env.SECRET_REG_WS_PASSWORD}`
  ).toString('base64');

  const tokenConfig = {
    method: 'post',
    url: `${process.env.REG_WS_API_URL}/oauth/client_credential/accesstoken?grant_type=client_credentials`,
    headers: {
      Authorization: `Basic ${authToken}`,
    },
  };

  try {
    const response = await axios(tokenConfig);
    const { access_token: token } = response.data;
    registrarDebug(`getToken returning ${token}`);
    return token;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Stores token in environment variable.
 *
 * @param {string} token Token to cache.
 */
async function cacheToken(token) {
  registrarDebug('cacheToken called');
  try {
    process.env.reg_token = token;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Called when token is invalid. Gets new token and stores it.
 *
 * @returns {string}    Returns cached token.
 */
async function refreshToken() {
  registrarDebug('refreshToken called');
  try {
    const token = await registrar.getToken();
    await registrar.cacheToken(token);
    return token;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Makes call to Registrar web service endpoint.
 *
 * @param {object} params   Should have relative path url set. Passed to axios.
 * @returns {?string}       JSON with data from web service.
 * @throws Exception if server returns 400 or 500 error.
 */
async function call(params) {
  registrarDebug(`call called with ${JSON.stringify(params)}`);
  try {
    const token =
      process.env.reg_token === undefined
        ? await registrar.refreshToken()
        : process.env.reg_token;

    if (params.headers === undefined) {
      params.headers = { Authorization: `Bearer ${token}` };
    } else {
      params.headers.Authorization = `Bearer ${token}`;
    }

    params.baseURL = process.env.REG_WS_API_URL;

    const response = await axios(params);
    registrarDebug(`call returning with ${response.data}`);
    return response.data;
  } catch (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      // Token may have expired
      registrarDebug('call: Token may have expired, retrying');
      params.headers.Authorization = await registrar.refreshToken();
      const retryResponse = await axios(params);
      if (retryResponse.status === 200) {
        registrarDebug(`call returning with ${retryResponse.data}`);
        return retryResponse.data;
      }
    } else if (error.response.status === 429 || error.response.status === 500) {
      registrarDebug(
        error.response.status === 429
          ? 'call: Rate limit reached, retrying'
          : 'call: Server error, retrying'
      );
      const retryResponse = await axios(params);
      if (retryResponse.status === 200) {
        registrarDebug(`call returning with ${retryResponse.data}`);
        return retryResponse.data;
      }
    } else if (error.response.status === 404) {
      registrarDebug('call returning null (404 response)');
      return null;
    }
    registrarDebug(`call throwing error ${error}`);
    const errorObject = new Error(error.message);
    errorObject.code = error.response.status;
    throw errorObject;
  }
}

/**
 * Converts a given offeredTermCode and classSectionID to the following
 * shortname format:
 *
 *  Strip spaces/ampersands from subject areas.
 *      <3 char term>-<subject area><display course number>-<display section number>
 *
 * @param {string} offeredTermCode  Term.
 * @param {string} classSectionID   ClassID aka SRS.
 * @returns {?string}   Returns shortname if CourseClassIdentifiers were found.
 */
async function getShortname(offeredTermCode, classSectionID) {
  registrarDebug(
    `getShortname: called with ${offeredTermCode}|${classSectionID}`
  );
  let term = offeredTermCode;
  try {
    let response = await registrar.call({
      url: `/sis/dictionary/${offeredTermCode}/${classSectionID}/courseclassidentifiers/v1`,
    });
    if (response === null) {
      registrarDebug('getShortname: CourseClassIdentifiers is null');
      return null;
    }
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

    // Check if course is summer sessions.
    if (offeredTermCode.slice(-1) === '1') {
      registrarDebug('getShortname: Handling Summer session');
      // Get session group.
      response = await registrar.call({
        url: `/sis/api/v1/Classes/${offeredTermCode}`,
        params: {
          subjectAreaCode: subArea,
          courseCatalogNumber: catNum,
          classNumber: secNum,
        },
      });

      if (response === null) {
        registrarDebug('getShortname: Classes is null');
        return null;
      }

      // Find the session that matches the class number.
      let sessionGroup = '';
      response.classes[0].termSessionGroupCollection.forEach((groupItem) => {
        groupItem.classCollection.forEach((classItem) => {
          if (classItem.classNumber === secNum) {
            sessionGroup = groupItem.termsessionGroupCode;
          }
        });
      });

      registrarDebug(`getShortname: using sessionGroup ${sessionGroup}`);
      term += sessionGroup;
    }

    // Format catNum from 0000SSPP to PP . int(0000) . SS.
    // SS are section letters. PP is C(oncurrent) and/or M(ultilisted).
    const formattedCatNum =
      catNum.substr(6, 2).trim() +
      parseInt(catNum.substr(0, 4)) +
      catNum.substr(4, 2).trim();

    // Remove spaces and ampersands.
    const shortname = `${term}-${subArea.replace(
      /\s|&/g,
      ''
    )}${formattedCatNum}-${secNum.replace(/^0+/g, '')}`;

    registrarDebug(`getShortname: returning ${shortname}`);
    return shortname;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Get crosslisted courses from the registrar (stored as an array of shortnames)
 *
 * @param {string} offeredTermCode  Term.
 * @param {string} classSectionID   ClassID aka SRS.
 * @returns {Array}   Returns a list of crosslisted courses.
 */
async function getCrosslists(offeredTermCode, classSectionID) {
  const crosslistXml = await axios(
    `https://webservices.registrar.ucla.edu/SRDB/SRDBWeb.asmx/getConSched?user=${process.env.SECRET_REG_SECRET_DB_USER}&pass=${process.env.SECRET_REG_SECRET_DB_PASS}&term=${offeredTermCode}&SRS=${classSectionID};`
  );

  const crosslists = [];
  xml2js.parseString(crosslistXml.data, (err, result) => {
    result.ArrayOfGetConSchedData.getConSchedData.forEach(async (crosslist) => {
      if (!crosslist.term[0] || !crosslist.srs[0]) {
        return;
      }
      const crosslistShortname = await registrar.getShortname(
        crosslist.term[0],
        crosslist.srs[0]
      );
      if (crosslistShortname) {
        crosslists.push({
          term: crosslist.term[0],
          srs: crosslist.srs[0],
          shortname: crosslistShortname,
        });
      } else {
        crosslists.push({
          term: crosslist.term[0],
          srs: crosslist.srs[0],
          shortname: '',
        });
        registrarDebug(
          `getShortname returned null for term ${crosslist.term[0]} and SRS ${crosslist.srs[0]}`
        );
      }
    });
  });

  registrarDebug(`Crosslists found: ${crosslists}`);
  return crosslists;
}

registrar = {
  getShortname,
  getCrosslists,
  call,
  getToken,
  cacheToken,
  refreshToken,
};

module.exports = registrar;
