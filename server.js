'use strict';
const log = console.log
const path = require('path');

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/pub'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pub/landing/index.html'));
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  log(`Listening on port ${port}...`)
});