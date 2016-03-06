import { SET_WORK_DURATION, SET_SHORT_BREAK_DURATION, SET_LONG_BREAK_DURATION, SET_SET_COUNT } from '../../common/action-types/settings';

export function setWorkDuration(payload) {
  return { type: SET_WORK_DURATION, payload };
}

export function setShortBreakDuration(payload) {
  return { type: SET_SHORT_BREAK_DURATION, payload };
}

export function setLongBreakDuration(payload) {
  return { type: SET_LONG_BREAK_DURATION, payload };
}

export function setSetCount(payload) {
  return { type: SET_SET_COUNT, payload };
}
