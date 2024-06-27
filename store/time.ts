import { Dayjs } from "dayjs";
import { atom } from "jotai";

const workTimeAtom = atom(20);
const breakTimeAtom = atom(10);
const workTimeLogAtom = atom<{ startTime: Dayjs; endTime: Dayjs }[]>([]);
const breakTimeLogAtom = atom<{ startTime: Dayjs; endTime: Dayjs }[]>([]);
const warningTimeAtom = atom(3)

export { workTimeAtom, breakTimeAtom, workTimeLogAtom, breakTimeLogAtom, warningTimeAtom };