const express = require('express');
const stats = require('../services/stats');
const util = require('util');
const lti = require('ltijs').Provider;

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

module.exports = router;
