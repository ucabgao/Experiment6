import { SCHEDULE, SET_SCHEDULE_INDEX } from '../../common/action-types/schedule';

export function setSchedule(payload) {
  return { type: SCHEDULE, payload };
}

export function setScheduleIndex(payload) {
  return { type: SET_SCHEDULE_INDEX, payload };
}
