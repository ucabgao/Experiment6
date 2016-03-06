import { SET_WORK_DURATION, SET_SHORT_BREAK_DURATION, SET_LONG_BREAK_DURATION, SET_SET_COUNT } from '../../common/action-types/settings';
import { setSchedule } from '../actions/schedule';
import scheduler from '../../common/scheduler';

const schedule = (store) => (next) => (action) => {
  const result = next(action);

  switch (action.type) {
  case SET_WORK_DURATION:
  case SET_SHORT_BREAK_DURATION:
  case SET_LONG_BREAK_DURATION:
  case SET_SET_COUNT:
    return store.dispatch(setSchedule(scheduler(store.getState().settings)));
  default:
    return result;
  }
};

export default schedule;
