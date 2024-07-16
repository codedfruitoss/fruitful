import { Dayjs } from 'dayjs';
import { TIMER_NATURE, TIMER_ACTIONS } from './constants';

export type TIMER_NATURE_TYPE = keyof typeof TIMER_NATURE;
export type TIMER_ACTIONS_TYPE = keyof typeof TIMER_ACTIONS;

export type TIME_OBJECT_TYPE = {
  start: null | Dayjs;
  elapsed: number;
  remaining: number | null;
  nature: string;
  totalTime: number;
};
