const { error } = require('console');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { client } = require('../db/db');
const { convertSQLToJSON } = require('../util/sqlToJson.js');
const { explicitJoinQuery, implicitJoinQuery, switchedJoinDirections } = require('../db/queries.js');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/:id/api/description', (req, res) => {
  const values = [req.params.id];
  const query = { text: implicitJoinQuery, values };
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
