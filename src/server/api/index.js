require('dotenv').config();
const express = require('express');
const oauth = require('oauth-sign');
const btoa = require('btoa');
const analytics = require('../services/analytics');
const CheckRoleServices = require('../services/CheckRole.js');

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

// Course reserves route
router.get('/getreserves', (req, res) => {
  try {
    if (!CheckRoleServices.isAdmin(res.locals.token.roles)) {
      return res.status(403).send(new Error('Unauthorized role'));
    }
    LibraryServices.getReserveListings().then(reserves => {
      const terms = new Set();
      for (let i = 0; i < reserves.length; i += 1) {
        terms.add(reserves[i].term);
      }
      res.send({ terms: Array.from(terms), reserves });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Gets library view analytics
router.get('/analytics', (req, res) => {
  try {
    if (!CheckRoleServices.isAdmin(res.locals.token.roles)) {
      return res.status(403).send(new Error('Unauthorized role'));
    }
    analytics.getAnalytics().then(result => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Adds research or reserve view
router.get('/addview/:type', (req, res) => {
  try {
    if (!CheckRoleServices.isStudent(res.locals.token.roles)) {
      return;
    }
    console.log(req.locals);
    analytics.addAnalytics(
      req.params.type,
      res.locals.context.context.id,
      res.locals.token.user,
      res.locals.context.context.label
    );
    res.send();
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Makes and downloads analytics filename
router.get('/statfile', (req, res) => {
  try {
    analytics.getAnalytics().then(result => {
      // Make result into excel file
      res.sendFile('/lib-stats.txt', function(err) {
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
