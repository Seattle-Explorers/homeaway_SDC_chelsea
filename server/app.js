const { error } = require('console');
const express = require('express');
const bodyParser = require('body-parser');
const { client } = require('../db/db');
const { convertSQLToJSON } = require('../util/sqlToJson.js');

const app = express();

app.use(bodyParser.json());

app.get('/:id/api/description', (req, res) => {
  const text = `
    SELECT
      listings.listingId, listings.title, listings.body, listings.guests, listings.publicBaths, listings.privateBaths,
      users.name, users.image,
      bedrooms.*,
      amenities_listings.description,
      amenities.type, amenities.amenity
        FROM listings, users, bedrooms, amenities_listings, amenities
          WHERE listingId=$1
          AND user_id = userId
          AND listingId = bedrooms.listing_id
          AND listingId = amenities_listings.listing_id
          AND amenities_listings.amenity_id = amenities.id
  `;
  const values = [req.params.id];
  const query = { text, values };
  client.query(query, (err, results) => {
    if (err) {
      res.sendStatus(500);
      error(err.stack);
    } else if (!results.rows) {
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send(convertSQLToJSON(results.rows));
    }
  });
});

module.exports = app;
