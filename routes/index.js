'use strict';
const express = require('express');
const snapshot = require('../lib/snapshot');

const router = module.exports = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/snapshot', (req, res, next) => {
  res.json({
    foo: 'bar'
  });
});

router.get('/snapshot.png', (req, res, next) => {
  snapshot((error, amount, data) => {
    if (error) {
      next(error);
      return;
    }

    res.type('image/png');
    res.end(data, 'base64');
  });
});
