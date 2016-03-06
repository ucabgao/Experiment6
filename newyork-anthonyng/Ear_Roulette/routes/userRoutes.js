'use strict'

const express  = require('express');
const app      = express();
const router   = express();
const User     = require('../models/user');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const config   = require('../config');

app.set('secret', config.secret);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'get user/' });
});

router.post('/new', (req, res) => {
  let name     = req.body.name;
  let password = req.body.password;

  let myUser = new User({
    name:     name,
    password: password
  });

  myUser.save((err) => {
    if(err) {
      console.log('User not saved.');
      res.json({ success: false });
    } else {
      console.log('User saved successfully');
      res.json({ success: true, name: name, password: password });
    }
  });
});

router.post('/authenticate', (req, res) => {
  User.findOne({
    name: req.body.name
  }, (err, user) => {
    if(err) throw err;

    // user doesn't exist in our database
    if(!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(err) throw err;

        if(isMatch) {
          let token = jwt.sign(user, app.get('secret'), { expiresIn: 3600 });

          res.json({
            user:    user,
            success: true,
            message: 'Enjoy your token.',
            token:   token
          });
        } else {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        }
      });
    }
  });
});

// route middleware to verify token
router.use((req, res, next) => {
  let token = req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, app.get('secret'), (err, decoded) => {

      if(err) {
        return res.json({
            success: false,
            message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// test route to show all users
router.get('/all', (req, res) => {
  User.find({}, (err, users) => {
    if(err) throw err;

    res.json({ success: true, users: users });
  });
});

module.exports = router;
