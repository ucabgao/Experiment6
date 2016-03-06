'use strict';

const times = require('lodash.times');
const durationActions = require('./action-types/duration-types');

module.exports = function scheduler(options) {
  var schedule = [];

  times(options.setCount, (index) => {
    schedule.push({
      duration: options.workDuration,
      type: durationActions.DURATION_WORK
    });
    schedule.push({
      duration: ((index + 1) >= options.setCount) ? options.longBreakDuration : options.shortBreakDuration,
      type: durationActions.DURATION_BREAK
    });
  });

  return schedule;
};
