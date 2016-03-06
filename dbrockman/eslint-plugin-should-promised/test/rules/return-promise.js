'use strict';

var RuleTester = require('eslint').RuleTester;
var rule = require('../../lib/rules/return-promise.js');
var tester = new RuleTester();
var expectedErrorMessage = 'Promise assertion must return.';


tester.run('return-promise', rule, {

  valid: [
    'var test = function() { return fn().should.be.Promise(); }',
    'var test = function() { return fn().should.be["Promise"](); }',
    'var test = function() { return fn().should.be.fulfilled(); }',
    'var test = function() { return fn().should.be["fulfilled"](); }',
    'var test = function() { return fn().should.fulfilledWith(1); }',
    'var test = function() { return fn().should["fulfilledWith"](1); }',
    'var test = function() { return fn().should.be.rejected(); }',
    'var test = function() { return fn().should.be["rejected"](); }',
    'var test = function() { return fn().should.rejectedWith(1); }',
    'var test = function() { return fn().should["rejectedWith"](1); }',
    'var test = function() { return fn().should.finally.eql(1); }',
    'var test = function() { return fn().should["finally"].eql(1); }',
    'var test = function() { return fn().should.eventually.eql(1); }',
    'var test = function() { return fn().should["eventually"].eql(1); }',
    'var test = function() { return fn().then(function(){}).should.be.fulfilled(); }',
  ],

  invalid: [
    {
      code: 'var test = function() { fn().should.be.Promise(); }',
      errors: [{ message: expectedErrorMessage, column: 40, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.be["Promise"](); }',
      errors: [{ message: expectedErrorMessage, column: 40, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.be.fulfilled(); }',
      errors: [{ message: expectedErrorMessage, column: 40, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.be["fulfilled"](); }',
      errors: [{ message: expectedErrorMessage, column: 40, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.fulfilledWith(1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should["fulfilledWith"](1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.be.rejected(); }',
      errors: [{ message: expectedErrorMessage, column: 40, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.be["rejected"](); }',
      errors: [{ message: expectedErrorMessage, column: 40, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.rejectedWith(1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should["rejectedWith"](1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.finally.eql(1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should["finally"].eql(1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should.eventually.eql(1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'var test = function() { fn().should["eventually"].eql(1); }',
      errors: [{ message: expectedErrorMessage, column: 37, line: 1 }]
    },
    {
      code: 'fn().should.be.fulfilled();',
      errors: [{ message: expectedErrorMessage, column: 16, line: 1 }]
    }
  ]

});
