const express = require('express');
const app = express();

app.use('/elasticsearch', require('./elasticsearch'));

module.exports = app;
