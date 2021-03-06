require('newrelic');
const path = require('path');
const express = require('express');
const compression = require('compression');
const app = require('./app');

const port = process.env.PORT || 3000;

app.get('/loaderio-f9e39372748a8c0c265c512ed081554a', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'loaderio.txt'));
});

app.use('/:id', express.static(path.join(__dirname, '../client/dist')));

app.use(compression());

app.get('/description/main.js/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'main.js'));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
