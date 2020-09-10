require('dotenv').config();
const express = require('express');
const oauth = require('oauth-sign');
const btoa = require('btoa');
const json2xls = require('json2xls');
const fs = require('fs');
const tmp = require('tmp');

const CheckRoleServices = require('../services/CheckRole');
const LibraryServices = require('../services/LibraryServices');
const Analytics = require('../services/Analytics');

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

// Course reserve listings route
router.get('/getreserves', (req, res) => {
  try {
    if (!CheckRoleServices.isAdmin(res.locals.context.roles)) {
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

// Get course reserve URL route
router.get('/getreserveurl', (req, res) => {
  try {
    LibraryServices.getReserveUrl(req.query.shortname).then(reserve => {
      res.send({ reserve });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Crosslists route
router.get('/crosslists', (req, res) => {
  try {
    LibraryServices.getCrosslists(req.query.shortname).then(crosslists => {
      res.send({ crosslists });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Analytics routes
router.get('/getanalytics', (req, res) => {
  try {
    if (!CheckRoleServices.isAdmin(res.locals.context.roles)) {
      return res.status(403).send(new Error('Unauthorized role'));
    }
    Analytics.getAnalytics().then(result => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Adds research or reserve view
router.get('/addanalytics/:type', (req, res) => {
  try {
    if (!CheckRoleServices.isStudent(res.locals.context.roles)) {
      return;
    }
    Analytics.addAnalytics(
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

router.get('/analyticsfile', (req, res) => {
  try {
    if (!CheckRoleServices.isAdmin(res.locals.context.roles)) {
      return res.status(403).send(new Error('Unauthorized role'));
    }
    Analytics.getAnalytics().then(result => {
      const excel = json2xls(result);
      const tmpobj = tmp.fileSync();
      fs.writeFileSync(tmpobj.name, excel, 'binary');
      res.download(tmpobj.name, 'analytics.xlsx');
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
