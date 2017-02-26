'use strict';
const express = require('express');
const Twitter = require('twitter');
const calculator = require('trumptax-calculator');
const snapshot = require('../lib/snapshot');

const router = module.exports = express.Router();
const calculate = calculator.calculate;
const usdollars = calculator.usdollars;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/snapshot', (req, res, next) => {
  res.json({
    foo: 'bar'
  });
});

/**
 * Get a snapshot of the current amount
 *
 * TODO:
 * - Cache image for 5 minutes
 * - Allow a query param to specify timestamp to calculate amount at time
 */
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

router.get('/respond', (req, res, next) => {
  const tweetUrl = req.query.to;
  if (!tweetUrl) {
    res.status(404).end();
    return;
  }

  // TODO: move this into ENV
  const twitter = new Twitter({
    // config via `now secret`
  });

  const statusId = tweetUrl.match(/\w+$/)[0];
  const amount = usdollars(calculate());

  twitter.post(
    'statuses/update',
    {
      status: `@realDonaldTrump Meanwhile, you've cost taxpayers ${amount} to support your fancy lifestyle. http://trumptax.me`,
      in_reply_to_status_id: statusId
    },
    (error, tweet, response) => {
      if (error) {
        console.error(error)
        next(error);
        return;
      }
      console.log(tweet);
      console.log(response);
      res.json({ 'done': true })
    }
  )
});
