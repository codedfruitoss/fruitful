import { Dayjs } from 'dayjs';
import { atom } from 'jotai';

const workTimeAtom = atom(10);
const breakTimeAtom = atom(3);
const addTimeAtom = atom(60);
const workTimeLogAtom = atom<{ startTime: Dayjs; endTime: Dayjs }[]>([]);
const breakTimeLogAtom = atom<{ startTime: Dayjs; endTime: Dayjs }[]>([]);
const warningTimeAtom = atom(2);

export {
  addTimeAtom,
  workTimeAtom,
  breakTimeAtom,
  workTimeLogAtom,
  breakTimeLogAtom,
  warningTimeAtom,
};
