[![NPM Version](https://img.shields.io/npm/v/eslint-plugin-should-promised.svg?style=flat)](https://www.npmjs.org/package/eslint-plugin-should-promised)
[![Build Status](https://img.shields.io/travis/dbrockman/eslint-plugin-should-promised.svg?style=flat)](https://travis-ci.org/dbrockman/eslint-plugin-should-promised)
[![Coverage Status](https://img.shields.io/coveralls/dbrockman/eslint-plugin-should-promised.svg?style=flat)](https://coveralls.io/r/dbrockman/eslint-plugin-should-promised)
[![Peer Dependencies](http://img.shields.io/david/peer/dbrockman/eslint-plugin-should-promised.svg?style=flat)](https://david-dm.org/dbrockman/eslint-plugin-should-promised#info=peerDependencies&view=table)


# eslint-plugin-should-promised

Eslint rule for checking that should-promised assertions return


## Install

```
$ npm i -D eslint-plugin-should-promised
```


## Configure

```json
{
  "plugins": [
    "should-promised"
  ],
  "rules": {
    "should-promised/return-promise": 2
  }
}
```


## Rules

### Require promise assertions to return (return-promise)

This rule is intended to be used with the [should-promised](https://www.npmjs.com/package/should-promised) plugin for the [should](https://www.npmjs.com/package/should) assertion library.

When testing an async function by returning a promise to [mocha](https://www.npmjs.com/package/mocha) it is important to remember to actually return the promise. Forgetting to return will not cause the test case to fail.

This rule will point out when a [should-promised](https://www.npmjs.com/package/should-promised) assertion is made without returning.

#### Rule Details

This rule looks for any of the properties `Promise`, `fulfilled`, `fulfilledWith`, `rejected`, `rejectedWith`, `finally` and `eventually`.

The following patterns are considered warnings:

```js
describe('forgot to return the promise', function() {
  it('warn when not returning the promise from should.be.fulfilled', function() {
    thing.fn().should.be.fulfilled();
  });

  it('warn when not returning the promise from should.eventually', function() {
    thing.fn().should.eventually.eql(1);
  });
});
```

These patterns would not be considered warnings:

```js
describe('forgot to return the promise', function() {
  it('warn when not returning the promise from should.be.fulfilled', function() {
    return thing.fn().should.be.fulfilled();
  });

  it('warn when not returning the promise from should.eventually', function() {
    return thing.fn().should.eventually.eql(1);
  });
});
```

#### Further Reading

- The [should](https://www.npmjs.com/package/should) assertion library
- The [should-promised](https://www.npmjs.com/package/should-promised) plugin
