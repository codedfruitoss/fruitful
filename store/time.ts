import { Dayjs } from "dayjs";
import { atom } from "jotai";

const workTimeAtom = atom(1500);
const breakTimeAtom = atom(300);
const workTimeLogAtom = atom<{ startTime: Dayjs; endTime: Dayjs }[]>([]);
const breakTimeLogAtom = atom<{ startTime: Dayjs; endTime: Dayjs }[]>([]);
const warningTimeAtom = atom(60)

export { workTimeAtom, breakTimeAtom, workTimeLogAtom, breakTimeLogAtom, warningTimeAtom };