require('dotenv').config();
const express = require('express');
const oauth = require('oauth-sign');
const btoa = require('btoa');

const LibraryServices = require('../services/LibraryServices');

const router = express.Router();

// ID Token route
router.get('/idtoken', (req, res) => {
  try {
    res.send(res.locals.token);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Platform context route
router.get('/platformcontext', (req, res) => {
  try {
    res.send(res.locals.context);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// LTI Launch params route
router.get('/ltilaunch', (req, res) => {
  try {
    const action = process.env.RG_LTI_LAUNCH;
    const method = 'POST';
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      // LTI Required Parameters
      lti_message_type: 'basic-lti-launch-request',
      lti_version: 'LTI-1p0',
      resource_link_id: `resource-${req.query.resourceId}-${req.query.contextId}`,
      // OAuth 1.0a Required Parameters
      oauth_consumer_key: process.env.RG_LTI_CONSUMER_KEY,
      oauth_nonce: btoa(timestamp),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_version: '1.0',
      // Other Parameters
      context_id: req.query.contextId,
      context_label: req.query.shortname,
    };
    const signature = oauth.hmacsign(
      method,
      action,
      params,
      process.env.RG_LTI_SECRET
    );
    params.oauth_signature = signature;

    res.send({
      launch: action,
      params,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Course reserves route
router.get('/getreserves', (req, res) => {
  try {
    LibraryServices.getReserveListings(req.query.term).then(reserves =>
      res.send(reserves)
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
