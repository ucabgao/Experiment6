import { SET_WORK_DURATION, SET_SHORT_BREAK_DURATION, SET_LONG_BREAK_DURATION, SET_SET_COUNT } from '../../common/action-types/settings';

export const initialState = {
  workDuration: 25 * 60 * 1000,
  shortBreakDuration: 3 * 60 * 1000,
  longBreakDuration: 15 * 60 * 1000,
  setCount: 4
};

export default function counter(state = initialState, action) {
  switch (action.type) {
  case SET_WORK_DURATION:
    return {
      ...state,
      workDuration: action.payload
    };
  case SET_SHORT_BREAK_DURATION:
    return {
      ...state,
      shortBreakDuration: action.payload
    };
  case SET_LONG_BREAK_DURATION:
    return {
      ...state,
      longBreakDuration: action.payload
    };
  case SET_SET_COUNT:
    return {
      ...state,
      setCount: action.payload
    };
  default:
    return state;
  }
}
