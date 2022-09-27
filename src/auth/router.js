'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const basicAuth = require('./middleware/basic-auth.js');
const router = express.Router();
const { UsersModel } = require('../auth/models/index');

router.post('/signup', async (req, res, next) => {
  console.log('I am here');
  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 5);
    let user = await UsersModel.create({
      username,
      password: encryptedPassword,
    });
    console.log('user', user);
    res.status(201).send(user);
  } catch (err) {
    next('signup error occurred');
  }
});

router.post('/signin', basicAuth, async (req, res) => {

  /*
          req.headers.authorization is : "Basic sdkjdsljd="
          To get username and password from this, take the following steps:
            - Turn that string into an array by splitting on ' '
            - Pop off the last value
            - Decode that encoded string so it returns to user:pass
            - Split on ':' to turn it into an array
            - Pull username and password from that array
        */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  /*
          Now that we finally have username and password, let's see if it's valid
          1. Find the user in the database by username
          2. Compare the plaintext password we now have against the encrypted password in the db
             - bcrypt does this by re-encrypting the plaintext password and comparing THAT
          3. Either we're valid or we throw an error
        */
  try {
    const user = await UsersModel.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { res.status(403).send('Invalid Login'); }

});

module.exports = router;
