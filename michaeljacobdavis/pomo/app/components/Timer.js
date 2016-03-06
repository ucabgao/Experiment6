import React, { PropTypes } from 'react';
import styles from './Timer.module.css';
import titleBarStyles from './TitleBar.module.css';
import formatTime from '../../common/format-time';
import TitleBar from './TitleBar';
import Schedule from './Schedule';
import { Link } from 'react-router';

const Timer = ({schedule, timer, timerStart, timerPause, timerReset, setScheduleIndex}) => {
  const time = formatTime(schedule.list[schedule.current].duration - (timer.current - timer.start));

  return (
    <div className={timer.running ? styles['container-running'] : styles['container-paused']}>
      <TitleBar>
        <div className={titleBarStyles['title-bar-container']}>
          <div className={titleBarStyles['title-bar-left']}>
            {timer.running ?
              <i onClick={() => timerPause()} className={styles['title-bar-pause']}></i> :
              <i onClick={() => timerStart()} className={styles['title-bar-play']}></i>
            }
            <i onClick={() => timerReset()} className={timer.running ? styles['title-bar-reset-running'] : styles['title-bar-reset-paused']}></i>
          </div>
          <div className={titleBarStyles['title-bar-right']}>
            <Link className={timer.running ? styles['title-bar-settings-running'] : styles['title-bar-settings-paused']} to="/settings" query={{ transition: 'slide-left' }} />
          </div>
        </div>
      </TitleBar>
      <div className={styles.timer}>
        {time}
      </div>

      <Schedule schedule={schedule} setScheduleIndex={setScheduleIndex} />
    </div>
  );
};

Timer.propTypes = {
  timerStart: PropTypes.func.isRequired,
  timerPause: PropTypes.func.isRequired,
  timerReset: PropTypes.func.isRequired,
  setScheduleIndex: PropTypes.func.isRequired,
  timer: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired
};

export default Timer;
