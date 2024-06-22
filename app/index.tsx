import { NormalText } from "@/components/StyledText";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import {
	Directions,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";

function getMinutes(s: number) {
	return Math.floor(s / 60);
}

function getDisplayTime(seconds: number) {
	const minutes = getMinutes(seconds);
	const s = seconds % 60;
	return `${minutes}:${s < 10 ? "0" + s : s}`;
}

export default function Main() {
	const workTime = 1500;
	const breakTime = 300;
	const [time, setTime] = useState(workTime);
	const [workOrBreak, setTimerType] = useState("work");
	const [workTimeLog, setWorkTimeLog] = useState<any>([]);
	const [breakTimeLog, setBreakTimeLog] = useState<any>([]);
	const [startTime, setStartTime] = useState(dayjs());
	const [isPaused, setIsPaused] = useState(false);
	const intervalRef = useRef<any>(null);

	function startTimer() {
		if (!intervalRef.current) {
			const id = setInterval(() => {
				setTime((a) => (a > 0 ? a - 1 : a));
			}, 1000);
			intervalRef.current = id;
		}
	}

	function stopTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
		if (workOrBreak === "work") {
			setTime(workTime);
		} else {
			setTime(breakTime);
		}
	}

	function pauseTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
	}

	const skipTimer = () => {
		const captureTime = dayjs();
		if (workOrBreak === "work") {
			setTimerType("break");
			setTime(breakTime);
			setWorkTimeLog([
				...workTimeLog,
				{ startTime: startTime, endTime: captureTime },
			]);
		} else {
			setTimerType("work");
			setTime(workTime);
			setBreakTimeLog([
				...breakTimeLog,
				{ startTime: startTime, endTime: captureTime },
			]);
		}
		setStartTime(captureTime);
	};

	const singleTap = Gesture.Tap()
		.onEnd(() => {
			if (!isPaused) {
				startTimer();
			} else {
				pauseTimer();
			}
			setIsPaused((isPaused) => !isPaused);
		})
		.runOnJS(true);

	const doubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(() => {
			stopTimer();
			setIsPaused(false);
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
		</GestureHandlerRootView>
	);
}
