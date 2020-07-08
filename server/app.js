const { error } = require('console');
const express = require('express');
const bodyParser = require('body-parser');
const Listing = require('../db/Listing');

const app = express();

app.use(bodyParser.json());

app.get('/api/description/:id', (req, res) => {
  Listing.findOne({ listingId: req.params.id })
    .then((listing) => {
      if (listing === null) {
        res.sendStatus(404);
      } else {
        res.send(listing);
      }
    })
    .catch((err) => {
      res.sendStatus(500);
      error(err);
    });
});

module.exports = app;
