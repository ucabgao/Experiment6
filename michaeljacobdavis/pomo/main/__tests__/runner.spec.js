/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import runner from '../../main/runner';
import { TIMER_START, TIMER_PAUSE } from '../../common/action-types/timer';
import { EventEmitter } from 'events';

let internals;

describe('runner', () => {
  beforeEach(() => {
    internals = {};
    internals.sandbox = sinon.sandbox.create();
    internals.clock = sinon.useFakeTimers();
    internals.ipc = new EventEmitter();
    internals.tick = () => {};
    internals.state = {
      timer: {
        running: true
      },
      settings: {}
    };
  });

  afterEach(() => {
    internals.sandbox.restore();
    internals.clock.restore();
  });

  describe('when TIMER_START is recieved', () => {
    it('starts an interval that calls tick every second', () => {
      const spy = internals.sandbox.spy(internals, 'tick');
      runner(internals.ipc, internals.tick, internals.scheduler);

      expect(spy.callCount).to.equal(0);

      internals.ipc.emit(TIMER_START, {}, internals.state);

      expect(spy.callCount).to.equal(1);
      internals.clock.tick(1000);
      expect(spy.callCount).to.equal(2);
      internals.clock.tick(1000);
      expect(spy.callCount).to.equal(3);
    });
  });

  describe('when TIMER_PAUSE is recieved', () => {
    it('clears the interval', () => {
      const spy = internals.sandbox.spy(internals, 'tick');
      runner(internals.ipc, internals.tick, internals.scheduler);

      expect(spy.callCount).to.equal(0);

      internals.ipc.emit(TIMER_START, {}, internals.state);

      // Starting
      expect(spy.callCount).to.equal(1);
      internals.clock.tick(1000);
      expect(spy.callCount).to.equal(2);

      // Call stop
      internals.ipc.emit(TIMER_PAUSE, {}, internals.state);
      internals.clock.tick(1000);
      expect(spy.callCount).to.equal(2);
    });
  });
});
