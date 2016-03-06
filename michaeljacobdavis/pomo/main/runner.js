'use strict';

const bus = require('./event-bus');
const timerActions = require('../common/action-types/timer');
const scheduleActions = require('../common/action-types/schedule');
const appActions = require('../common/action-types/app');

module.exports = function schedule(ipc, tick) {
  let interval;

  function handleEvent(event, state) {
    if (state.timer.running) {
      const ticker = tick.bind(null, event, state);

      // Init
      ticker();

      // Cancel any existing interval
      handlePause();

      // Set Interval
      interval = setInterval(ticker, 1000);
    }
  }

  function handlePause() {
    bus.emit(appActions.APP_TITLE, '');
    clearInterval(interval);
  }

  ipc.on(timerActions.TIMER_START, handleEvent);
  ipc.on(timerActions.TIMER_RESET, handleEvent);
  ipc.on(scheduleActions.SCHEDULE, handleEvent);

  ipc.on(timerActions.TIMER_PAUSE, handlePause);
};
