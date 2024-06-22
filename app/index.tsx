import { NormalText } from "@/components/StyledText";
import React, { useRef, useState } from "react";
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
	return `${minutes}:${s}`;
}

const intialPTime = 1500;

export default function Main() {
	const [ptime, setPTime] = useState(intialPTime);
	const intervalRef = useRef<any>(null);
	const [isPaused, setIsPaused] = useState(false);

	const singleTap = Gesture.Tap()
		.onEnd(() => {
			if (!isPaused) {
				startPauseTimer();
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
			console.log("asd");
			setPTime((a) => a + 60);
		})
		.runOnJS(true);

	const gestures = Gesture.Exclusive(swipeUp, doubleTap, singleTap);

	function startPauseTimer() {
		if (!intervalRef.current) {
			const id = setInterval(() => {
				setPTime((a) => (a > 0 ? a - 1 : a));
			}, 1000);
			intervalRef.current = id;
		}
	}

	function stopTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
		setPTime(intialPTime);
	}

	function pauseTimer() {
		clearInterval(intervalRef?.current);
		intervalRef.current = null;
	}

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
					{getDisplayTime(ptime)}
				</NormalText>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}
