import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import timer from '../middleware/timer';
import schedule from '../middleware/schedule';
import rootReducer from '../reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk, schedule, timer)
)(createStore);

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
}
