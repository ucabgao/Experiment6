/* eslint-env mocha */

import { expect } from 'chai';
import { miliToMin, minToMili } from '../conversion';

describe('conversion', () => {
  describe('miliToMin', () => {
    it('converts miliseconds to minutes', () => {
      expect(miliToMin(60000)).to.equal(1);
    });

    it('rounds down', () => {
      expect(miliToMin(100000)).to.equal(1);
    });
  });

  describe('minToMili', () => {
    it('converts minutes to miliseconds', () => {
      expect(minToMili(1)).to.equal(60000);
    });
  });
});
