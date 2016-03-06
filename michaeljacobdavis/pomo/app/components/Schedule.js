import React, { PropTypes } from 'react';
import styles from './Schedule.module.css';
import formatTime from '../../common/format-time';
import workTypeDisplay from '../../common/work-type-display';

const Schedule = ({schedule, setScheduleIndex}) => {
  return (
    <div>
      {schedule.list.map((event, index) => {
        return (
          <div
            className={ (schedule.current === index) ? styles.current : styles.event }
            onClick={setScheduleIndex.bind(null, index)}
            key={index}>
            {formatTime(event.duration)} {workTypeDisplay(event.type)}
          </div>
        );
      })}
    </div>
  );
};

Schedule.propTypes = {
  setScheduleIndex: PropTypes.func.isRequired,
  schedule: PropTypes.object.isRequired
};

export default Schedule;
