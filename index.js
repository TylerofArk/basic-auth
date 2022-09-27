'use strict';

let { start } = require('./src/server');
let { sequelizeDatabase } = require('./src/auth/models');

sequelizeDatabase.sync()
  .then(() => {
    console.log('successfully connected');
    start();
  })
  .catch((e) => console.error(e));

start();
