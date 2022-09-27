'use strict';

const express = require('express');
const app = express();
const router = require('./auth/router.js');
const PORT = process.env.PORT || 3002;
const notFound = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
require('dotenv').config();

app.use(express.json());
app.use(router);

app.get('/hello', (req, res, next) => {
  let { name } = req.query;
  res.status(200).send(`Greetings ${name}! this route is now secured by Basic AUth!!!`);
});

app.use('*', notFound);

app.use(errorHandler);

function start() {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

module.exports = {app, start};
