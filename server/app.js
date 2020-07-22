const { error } = require('console');
const express = require('express');
const { pool } = require('../db/db');
const { convertSQLToJSON } = require('../util/sqlToJson.js');
const { implicitJoinQuery } = require('../db/queries.js');

const app = express();

app.get('/:id/api/description', (req, res) => {
  const values = [req.params.id];
  const query = {
    name: 'core-query-plan',
    text: implicitJoinQuery,
    values,
  };
  pool
    .query(query)
    .then((results) => {
      if (!results.rows) {
        res.sendStatus(404);
      } else {
        res.status(200);
        res.send(convertSQLToJSON(results.rows));
      }
    })
    .catch((err) => {
      res.sendStatus(500);
      error('Error executing query', err.stack);
    });
});

module.exports = app;
