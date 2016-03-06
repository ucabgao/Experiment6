import { combineReducers } from 'redux';
import timer from './timer';
import schedule from './schedule';
import settings from './settings';

const rootReducer = combineReducers({
  timer,
  schedule,
  settings
});

export default rootReducer;
