import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Timer from '../components/Timer';
import * as TimerActions from '../actions/timer';
import * as ScheduleActions from '../actions/schedule';

function mapStateToProps(state) {
  return {
    timer: state.timer,
    schedule: state.schedule
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TimerActions, ...ScheduleActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
