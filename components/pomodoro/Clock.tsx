import {
	Directions,
	Gesture,
	GestureDetector,
} from "react-native-gesture-handler";
import { NormalText } from "../ui/StyledText";
import { useState } from "react";
import { T_TIMER_ACTIONS } from "@/utils/types";
import { TIMER_ACTIONS } from "@/utils/constants";

interface clockProps {
	time: number;
	handleTimerAction: (action: T_TIMER_ACTIONS) => void;
}

function getMinutes(s: number) {
	return Math.floor(s / 60);
}

function getDisplayTime(seconds: number) {
	const minutes = getMinutes(seconds);
	const s = seconds % 60;
	return `${minutes}:${s < 10 ? "0" + s : s}`;
}

export default function Clock({ time, handleTimerAction }: clockProps) {
	const [isPaused, setIsPaused] = useState(false);

	const singleTap = Gesture.Tap()
		.onEnd(() => {
			if (!isPaused) {
				handleTimerAction(TIMER_ACTIONS.start);
			} else {
				handleTimerAction(TIMER_ACTIONS.pause);
			}
			setIsPaused((isPaused) => !isPaused);
		})
		.runOnJS(true);

	const swipeDown = Gesture.Fling()
		.direction(Directions.DOWN)
		.onEnd(() => {
			handleTimerAction(TIMER_ACTIONS.stop);
			setIsPaused(false);
		})
		.runOnJS(true);

	const swipeUp = Gesture.Fling()
		.direction(Directions.UP)
		.onEnd(() => {
			handleTimerAction(TIMER_ACTIONS.increment);
		})
		.runOnJS(true);

	const swipeLeft = Gesture.Fling()
		.direction(Directions.LEFT | Directions.RIGHT)
		.onEnd(() => {
			handleTimerAction(TIMER_ACTIONS.stop);
		})
		.runOnJS(true);

	const gestures = Gesture.Exclusive(
		swipeLeft,
		swipeUp,
		swipeDown,
		singleTap
	);

	return (
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
	);
}
