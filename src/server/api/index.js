const express = require('express');

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

module.exports = router;
