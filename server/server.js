require('newrelic');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const app = require('./app');

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/description/:id', express.static(path.join(__dirname, '../client/dist')));
app.use(compression());

app.get('/description', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
