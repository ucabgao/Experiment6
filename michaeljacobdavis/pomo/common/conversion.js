exports.miliToMin = function miliToMin(miliseconds) {
  return Math.floor(miliseconds / 60000);
};

exports.minToMili = function minToMili(min) {
  return min * 60000;
};
