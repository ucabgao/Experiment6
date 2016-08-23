#! /usr/bin/env node
var cc: any; //  = require('./lib/utils')
var join: any; // = require('path').join
var deepExtend: any; // = require('deep-extend')
var etc = '/etc'

interface processShim {
  env : any
  platform : any
  argv : any
}

var process: processShim = {
  env: "",
  platform: "win128",
  argv: "arguments"
}

var win = process.platform === "win32"

var home: string|null = win
           ? process.env.USERPROFILE
           : process.env.HOME

interface moduleShim {
  exports : any
}

var module = {
  exports: ""
}

module.exports = function (name, defaults, argv: string) {
  if(!name)
    throw new Error('nameless configuration fail')
    /*
  if(!argv)
    argv = require('optimist').argv
    */
  defaults = (
      'string' === typeof defaults
    ? cc.json(defaults) : defaults
    ) || {}

  var local = cc.find('.'+name+'rc')

  return deepExtend.apply(null, [
    defaults,
    win ? {} : cc.json(join(etc, name, 'config')),
    win ? {} : cc.json(join(etc, name + 'rc')),
    cc.json(join(home, '.config', name, 'config')),
    cc.json(join(home, '.config', name)),
    cc.json(join(home, '.' + name, 'config')),
    cc.json(join(home, '.' + name + 'rc')),
    cc.json(local || argv.config),
    local ? {config: local} : null,
    cc.env(name + '_'),
    argv
  ])
}

if(!module.parent) {
  console.log(
    JSON.stringify(module.exports(process.argv[2]), false, 2)
  )
}
