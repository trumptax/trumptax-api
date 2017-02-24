'use strict';
const Nightmare = require('nightmare');

module.exports = (callback) => {
  const nightmare = Nightmare({ show: false });
  let amount, data;

  nightmare
    .goto('http://trumptax.me')
    .wait(500)
    .evaluate(() => {
      return document.querySelector('.dollars').textContent;
    })
    .then((result) => {
      amount = result;

      nightmare
        .screenshot()
        .end()
        .then((result) => {
          data = result.toString('base64');
          callback(null, amount, data);
        })
        .catch((error) => {
          console.error(error);
          callback(error);
        })
    })
    .catch((error) => {
      console.error(error);
      callback(error);
    })
}
