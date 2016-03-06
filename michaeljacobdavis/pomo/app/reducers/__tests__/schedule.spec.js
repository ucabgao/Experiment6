/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import freeze from 'deep-freeze';
import schedule, { initialState } from '../../../app/reducers/schedule';
import { SCHEDULE, SET_SCHEDULE_INDEX } from '../../../common/action-types/schedule';
let internals;

before(() => {
  freeze(initialState);
});

describe('schedule reducer', () => {
  beforeEach(() => {
    internals = {};
    internals.sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    internals.sandbox.restore();
  });

  describe('SCHEDULE', () => {
    it('sets `list` to payload', () => {
      const list = [ { type: 'work', duration: 10 }];
      const result = schedule(initialState, { type: SCHEDULE, payload: list });
      expect(result.list).to.equal(list);
    });
  });

  describe('SET_SCHEDULE_INDEX', () => {
    it('sets `current` to payload', () => {
      const current = 5;
      const result = schedule(initialState, { type: SET_SCHEDULE_INDEX, payload: current });
      expect(result.current).to.equal(current);
    });
  });
});
