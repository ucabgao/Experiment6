/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import freeze from 'deep-freeze';
import timer, { initialState } from '../../../app/reducers/timer';
import { TIMER_START, TIMER_RESET } from '../../../common/action-types/timer';
import { SET_SCHEDULE_INDEX } from '../../../common/action-types/schedule';

let internals;

before(() => {
  freeze(initialState);
});

describe('timer', () => {
  beforeEach(() => {
    internals = {};
    internals.sandbox = sinon.sandbox.create();
    internals.clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    internals.sandbox.restore();
    internals.clock.restore();
  });

  describe('TIMER_START', () => {
    it('sets start to the current time if start is falsy', () => {
      const time = 120000;
      internals.clock.tick(time);
      const result = timer(initialState, { type: TIMER_START });
      expect(result.start).to.equal(time);
    });

    it('sets start to the existing start time if start is already set', () => {
      const time = 120000;
      internals.clock.tick();
      const result = timer({
        ...initialState,
        start: time
      }, { type: TIMER_START });
      expect(result.start).to.equal(time);
    });

    it('sets running to true', () => {
      const result = timer(initialState, { type: TIMER_START });
      expect(result.running).to.equal(true);
    });
  });

  describe('TIMER_RESET', () => {
    it('sets start to the current time', () => {
      const time = 120000;
      internals.clock.tick(time);
      const result = timer(initialState, { type: TIMER_RESET });
      expect(result.start).to.equal(time);
    });

    it('sets current to the current time', () => {
      const time = 120000;
      internals.clock.tick(time);
      const result = timer(initialState, { type: TIMER_RESET });
      expect(result.current).to.equal(time);
    });
  });

  describe('SET_SCHEDULE_INDEX', () => {
    it('sets start to the current time', () => {
      const time = 120000;
      internals.clock.tick(time);
      const result = timer(initialState, { type: SET_SCHEDULE_INDEX });
      expect(result.start).to.equal(time);
    });

    it('sets current to the current time', () => {
      const time = 120000;
      internals.clock.tick(time);
      const result = timer(initialState, { type: SET_SCHEDULE_INDEX });
      expect(result.current).to.equal(time);
    });
  });
});
