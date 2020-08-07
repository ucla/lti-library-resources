require('dotenv').config();
const express = require('express');
const stats = require('../services/stats');
const util = require('util');
const lti = require('ltijs').Provider;
const oauth = require('oauth-sign');
const btoa = require('btoa');

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

// Gets library view stats
router.get('/stats', (req, res) => {
  try {
    console.log('api received getstats request');
    stats.getStats().then(result => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Adds research or reserve view
router.get('/addview/:type/:srs/:student', (req, res) => {
  try {
    console.log('api received addview request');
    stats.addStat(
      req.params.type,
      req.params.srs,
      req.params.student,
      res.locals.context.context.label
    );
    res.send();
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Makes and downloads stats filename
router.get('/statfile', (req, res) => {
  try {
    console.log('getting file');
    stats.getStats().then(result => {
      // make result into excel file
      res.sendFile(__dirname + '/lib-stats.txt', function(err) {
        if (err) {
          // Handle error, but keep in mind the response may be partially-sent
          // so check res.headersSent
          console.log(err);
        } else {
          console.log('OK');
        }
      });
    });
  } catch (err) {
    console.log(err);
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

module.exports = router;
