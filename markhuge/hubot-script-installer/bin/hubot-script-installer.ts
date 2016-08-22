#!/usr/bin/env node

var program = require('commander'),
  fs = require('fs'),
  path = require('path'),
  installer = require('../');

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .option('-u, --uninstall', 'Uninstalls script')
  .parse(process.argv);

var externalScripts, packageJson;

//tests if this repo is installed as dependency on some other module 
if (/node_modules/.test(__dirname)) {
  // this should work if run from postInstall script
  // shit will break otherwise(cuz of process.cwd())
  externalScripts = path.join(process.cwd(),'external-scripts.json');
  packageJson = path.join(process.cwd(),'package.json');
} else {
  //for development
  externalScripts = path.join(__dirname, '../test/fixtures/external-scripts.json');
  packageJson = path.join(__dirname, '../test/fixtures/package.json');;
}

if (program.uninstall) {
  installer.uninstall(externalScripts, packageJson, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log("Hubot script uninstalled")
    }
  });
}

else {
  installer.install(externalScripts, packageJson, function (err) {
    if (err) {
        console.log(err)
      } else {
        console.log("Hubot script installed")
      }
  });
}