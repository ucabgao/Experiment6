'use strict';
let babel = require('babel');

module.exports = function() {
  return {
    files: [
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
      'src/**/*.js',
      '!src/**/__tests__/*.test.js'
    ],

    tests: [
      'src/**/__tests__/*.test.js'
    ],

    debug: false,

    preprocessors: {
      '**/*.js': [
        file => babel.transform(file.content, {sourceMaps: true})
      ]
    },

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'mocha@2.1.0'
  };
};
