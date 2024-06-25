import { T_TIMER_ACTIONS } from "@/utils/types";
import React, { useEffect, useRef, useState } from "react";
import Clock from "./Clock";
import { TIMER_ACTIONS, TIMER_NATURE } from "@/utils/constants";
import { useAtom, useAtomValue } from "jotai";
import {
	workTimeAtom,
	breakTimeAtom,
	workTimeLogAtom,
	breakTimeLogAtom,
} from "@/store/time";
import dayjs, { Dayjs } from "dayjs";

function Pomodoro() {
	const [timerNature, setTimerNature] = useState(TIMER_NATURE.work);
	const workTime = useAtomValue(workTimeAtom);
	const breakTime = useAtomValue(breakTimeAtom);
	const [clockTime, setClockTime] = useState(workTime);
	const [workTimeLog, setWorkTimeLog] = useAtom(workTimeLogAtom);
	const [breakTimeLog, setBreakTimeLog] = useAtom(breakTimeLogAtom);
	const [startTime, setStartTime] = useState<Dayjs>();
	const intervalRef = useRef<any>(null);

	function startTimer() {
		if (!intervalRef.current) {
			const id = setInterval(() => {
				setClockTime((a) => (a > 0 ? a - 1 : a));
			}, 1000);
			intervalRef.current = id;
		}
	}

	function clearTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
	}

	function stopTimer() {
		clearTimer();
		const currentTime = dayjs();
		if (timerNature === TIMER_NATURE.work) {
			setClockTime(workTime);
			logWorkTime(currentTime);
		} else {
			setClockTime(breakTime);
			logBreakTime(currentTime);
		}
	}
	const skipTimer = () => {
		const currentTime = dayjs();
		if (timerNature === TIMER_NATURE.work) {
			setTimerNature(TIMER_NATURE.break);
			setClockTime(breakTime);
		} else {
			setTimerNature(TIMER_NATURE.work);
			setClockTime(workTime);
		}
		setStartTime(currentTime);
	};

	const incrementTimer = () => {
		setClockTime((a) => (a > 0 ? a + 60 : a));
	};

	const logWorkTime = (currentTime: Dayjs) => {
		if (startTime) {
			setWorkTimeLog([
				...workTimeLog,
				{ startTime: startTime, endTime: currentTime },
			]);
		}
	};

	const logBreakTime = (currentTime: Dayjs) => {
		if (startTime) {
			setBreakTimeLog([
				...breakTimeLog,
				{ startTime: startTime, endTime: currentTime },
			]);
		}
	};
	const handleTimerAction = (action: T_TIMER_ACTIONS) => {
		switch (action) {
			case "start":
				startTimer();
			case "pause":
				clearTimer();
				break;
			case "stop":
				stopTimer();
				break;
			case "skip":
				skipTimer();
				break;
			case "increment":
				incrementTimer();
				break;
		}
	};

	useEffect(() => {
		if (clockTime === 0) {
			handleTimerAction(TIMER_ACTIONS.skip);
		}
	}, [clockTime]);

	return (
		<div>
			<Clock time={clockTime} handleTimerAction={handleTimerAction} />
		</div>
	);
}

export default Pomodoro;
