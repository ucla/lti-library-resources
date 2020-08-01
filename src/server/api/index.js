const express = require('express');
const stats = require('../services/stats');

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
router.get('/stats/:srs', (req, res) => {
  try {
    stats.getStats(req.params.srs).then(result => {
      console.log(`RESULT${result}`);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Adds research view
router.get('/addresearchview/:srs/:student', (req, res) => {
  try {
    stats.addReserveStat(req.params.srs, req.params.student);
    res.send();
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Adds reserves view
router.get('/addreserveview/:srs/:student', (req, res) => {
  try {
    stats.addResearchStat(req.params.srs, req.params.student);
    res.send();
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
