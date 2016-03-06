'use strict';
const durationTypes = require('./action-types/duration-types');

module.exports = function workTypeDisplay(type) {
  switch (type) {
  case durationTypes.DURATION_WORK:
    return 'work';
  case durationTypes.DURATION_BREAK:
    return 'break';
  default:
    return '';
  }
};
