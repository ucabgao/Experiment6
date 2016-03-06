'use strict';

const bus = require('./event-bus');
const timerActions = require('../common/action-types/timer');
const scheduleActions = require('../common/action-types/schedule');
const appActions = require('../common/action-types/app');
const formatTime = require('../common/format-time');
const workTypeDisplay = require('../common/work-type-display');

module.exports = function tick(event, state) {
  state.timer.current = new Date().getTime();
  const timeLeft = state.schedule.list[state.schedule.current].duration - (state.timer.current - state.timer.start);

  // If there is still time on the clock
  if (timeLeft > 0) {
    event.sender.send(timerActions.TIMER_TICK, state.timer);
    bus.emit(appActions.APP_TITLE, formatTime(timeLeft));
  } else {
    state.schedule.current = state.schedule.current === (state.schedule.list.length - 1) ? 0 : state.schedule.current + 1;
    event.sender.send(scheduleActions.SET_SCHEDULE_INDEX, state.schedule.current);
    bus.emit(appActions.APP_NOTIFY, {
      title: 'Pomo',
      message: 'Time for ' + workTypeDisplay(state.schedule.list[state.schedule.current].type) + '!'
    });
    state.timer.start = new Date().getTime();

    tick(event, state);
  }
};
