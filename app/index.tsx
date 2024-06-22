import { NormalText } from "@/components/StyledText";
import React, { useRef, useState } from "react";
import { View, Pressable } from "react-native";
import {
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

	const tap = Gesture.Tap().onEnd(() => {
		startTimer();
	});

	function startTimer() {
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
		clearInterval(intervalRef.current);
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
			<GestureDetector gesture={tap}>
				<NormalText
					style={{
						fontSize: 86,
					}}
				>
					{getDisplayTime(ptime)}
				</NormalText>
			</GestureDetector>
			<View>
				<Pressable onPress={() => startTimer()}>
					<NormalText style={{ fontSize: 24 }}>Start</NormalText>
				</Pressable>
			</View>
			<View>
				<Pressable onPress={() => stopTimer()}>
					<NormalText style={{ fontSize: 24, marginTop: 24 }}>
						Stop
					</NormalText>
				</Pressable>
			</View>
			<View>
				<Pressable onPress={() => pauseTimer()}>
					<NormalText style={{ fontSize: 24, marginTop: 24 }}>
						Pause
					</NormalText>
				</Pressable>
			</View>
		</GestureHandlerRootView>
	);
}
