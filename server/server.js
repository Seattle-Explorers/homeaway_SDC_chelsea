require('newrelic');
const Console = require('console');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const app = require('./app');

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(compression());

app.get('/:id', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => {
  Console.log(`listening on port ${port}`);
});
