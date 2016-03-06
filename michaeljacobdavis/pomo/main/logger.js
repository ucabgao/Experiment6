const Winston = require('winston');
const Loggly = require('winston-loggly').Loggly;
const pkg = require('../package.json');
const electron = require('electron');

const app = electron.app;

const logger = new Winston.Logger({
  transports: [
    new (Winston.transports.Console)(),
    new Loggly(pkg.loggly)
  ],
  rewriters: [ (level, msg, meta) => {
    meta.version = app.getVersion();
    return meta;
  }]
});

module.exports = logger;
