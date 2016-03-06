/* eslint-env mocha */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import tick from '../tick';
import bus from '../event-bus';
import { TIMER_TICK } from '../../common/action-types/timer';
import { APP_TITLE, APP_NOTIFY } from '../../common/action-types/app';
import { SET_SCHEDULE_INDEX } from '../../common/action-types/schedule';

chai.use(sinonChai);

let internals;

describe('tick', () => {
  beforeEach(() => {
    internals = {};
    internals.sandbox = sinon.sandbox.create();
    internals.clock = sinon.useFakeTimers();
    internals.event = {
      sender: {
        send: () => {}
      }
    };
    internals.state = {
      timer: {
        start: 0,
        running: true
      },
      schedule: {
        current: 0,
        list: [
          {
            type: 'work',
            duration: 10000
          },
          {
            type: 'break',
            duration: 1000
          }
        ]
      }
    };
  });

  afterEach(() => {
    internals.sandbox.restore();
    internals.clock.restore();
  });

  describe('if time is left', () => {
    it('emits an APP_TITLE event on the global bus', (done) => {
      internals.clock.tick(1000);

      bus.once(APP_TITLE, (title) => {
        expect(title).to.equal('00:09');
        done();
      });

      tick(internals.event, internals.state);
    });

    it('emits a TIMER_TICK event on the event.sender', () => {
      const spy = internals.sandbox.spy(internals.event.sender, 'send');
      tick(internals.event, internals.state);

      expect(spy).to.have.been.calledWith(TIMER_TICK, internals.state.timer);
    });
  });

  describe('if no time is left', () => {
    beforeEach(() => {
      internals.clock.tick(10000);
    });

    it('emits a APP_NOTIFY event on the global bus', (done) => {
      bus.once(APP_NOTIFY, (notification) => {
        expect(notification.title).to.equal('Pomo');
        done();
      });

      tick(internals.event, internals.state);
    });

    it('emits a SET_SCHEDULE_INDEX event on the event.sender', () => {
      const spy = internals.sandbox.spy(internals.event.sender, 'send');
      tick(internals.event, internals.state);

      expect(spy).to.have.been.calledWith(SET_SCHEDULE_INDEX, 1);
    });

    describe('if on the last schedule event', () => {
      beforeEach(() => {
        internals.clock.tick(1000);
      });

      it('emits a SET_SCHEDULE_INDEX event with the value of 0 on the event.sender', () => {
        const spy = internals.sandbox.spy(internals.event.sender, 'send');
        internals.state.schedule.current = 1;
        tick(internals.event, internals.state);

        expect(spy).to.have.been.calledWith(SET_SCHEDULE_INDEX, 0);
      });
    });
  });
});
