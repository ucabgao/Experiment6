#!/usr/bin/env node

'use strict';

var express = require('express');
var logger = require('morgan');

var app = express();
app.use(logger('dev'));

// if config.json is missing, use environment variables
var jsonConfig;
try {
  jsonConfig = require('../dist/config.json');
} catch (Error) {
  jsonConfig = {
    api: process.env.CROWD_PULSE_UI_API,
    socket: process.env.CROWD_PULSE_UI_SOCKET,
    index: process.env.CROWD_PULSE_UI_INDEX
  };
}
app.get('/config.json', function (req, res) {
  res.send(jsonConfig);
});
app.use(express.static(__dirname + '/../dist'));

// start server
var server = app.listen(process.env.CROWD_PULSE_UI_PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Web app listening at %s:%s', host, port);
});

// close server on CTRL-C
process.on('SIGINT', function() {
  console.log('\nShutting down...');
  server.close();
  console.log('Clear eyes, full hearts, can\'t lose.');
  process.exit();
});
