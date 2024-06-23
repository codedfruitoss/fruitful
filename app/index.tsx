import { NormalText } from "@/components/ui/StyledText";
import dayjs, { Dayjs } from "dayjs";
import {
	workTimeAtom,
	breakTimeAtom,
	workTimeLogAtom,
	breakTimeLogAtom,
} from "@/store/time";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import {
	Directions,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { Link } from "expo-router";

function getMinutes(s: number) {
	return Math.floor(s / 60);
}

function getDisplayTime(seconds: number) {
	const minutes = getMinutes(seconds);
	const s = seconds % 60;
	return `${minutes}:${s < 10 ? "0" + s : s}`;
}

export default function Main() {
	const workTime = useAtomValue(workTimeAtom);
	const breakTime = useAtomValue(breakTimeAtom);
	const [time, setTime] = useState(workTime);
	const [workOrBreak, setTimerType] = useState("work");
	const [workTimeLog, setWorkTimeLog] = useAtom(workTimeLogAtom);
	const [breakTimeLog, setBreakTimeLog] = useAtom(breakTimeLogAtom);
	const [startTime, setStartTime] = useState<Dayjs>();
	const [isPaused, setIsPaused] = useState(false);
	const [isTimerOn, setIsTimerOnFlag] = useState(false);
	const intervalRef = useRef<any>(null);

	function startTimer() {
		if (!intervalRef.current) {
			const id = setInterval(() => {
				setTime((a) => (a > 0 ? a - 1 : a));
			}, 1000);
			setStartTime(dayjs());
			intervalRef.current = id;
		}
	}

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

	function stopTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
		const currentTime = dayjs();
		if (workOrBreak === "work") {
			setTime(workTime);
			logWorkTime(currentTime);
		} else {
			setTime(breakTime);
			logBreakTime(currentTime);
		}
	}

	function pauseTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
		const currentTime = dayjs();
		if (workOrBreak === "work") {
			logWorkTime(currentTime);
		} else {
			logBreakTime(currentTime);
		}
	}

	const skipTimer = () => {
		const currentTime = dayjs();
		if (workOrBreak === "work") {
			setTimerType("break");
			setTime(breakTime);
			console.log("isPaused", isPaused);
			if (isTimerOn) {
				logWorkTime(currentTime);
			}
		} else {
			setTimerType("work");
			setTime(workTime);
			if (isTimerOn) {
				logBreakTime(currentTime);
			}
		}
		setStartTime(currentTime);
	};

	const singleTap = Gesture.Tap()
		.onEnd(() => {
			if (!isPaused) {
				startTimer();
				setIsTimerOnFlag(true);
			} else {
				pauseTimer();
				setIsTimerOnFlag(false);
			}
			setIsPaused((isPaused) => !isPaused);
		})
		.runOnJS(true);

	const doubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(() => {
			stopTimer();
			setIsPaused(false);
			setIsTimerOnFlag(false);
		})
		.runOnJS(true);

	const swipeUp = Gesture.Fling()
		.direction(Directions.UP)
		.onEnd(() => {
			setTime((a) => (a > 0 ? a + 60 : a));
		})
		.runOnJS(true);

	const swipeLeft = Gesture.Fling()
		.direction(Directions.LEFT | Directions.RIGHT)
		.onEnd(() => {
			skipTimer();
		})
		.runOnJS(true);

	useEffect(() => {
		if (time === 0) {
			skipTimer();
		}
	}, [time]);

	const gestures = Gesture.Exclusive(
		swipeLeft,
		swipeUp,
		doubleTap,
		singleTap
	);

	return (
		<GestureHandlerRootView
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "black",
			}}
		>
			<GestureDetector gesture={gestures}>
				<NormalText
					style={{
						fontSize: 86,
						padding: 86,
					}}
				>
					{getDisplayTime(time)}
				</NormalText>
			</GestureDetector>
			<Link href="/analysis" asChild>
				<Pressable>
					<NormalText>Analysis</NormalText>
				</Pressable>
			</Link>

			<NormalText>{JSON.stringify(workTimeLog)}</NormalText>
			<NormalText>{`is paused: ${isTimerOn}`}</NormalText>
		</GestureHandlerRootView>
	);
}
