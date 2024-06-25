import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { NormalText } from "../ui/StyledText";
import { useEffect, useRef, useState } from "react";
import { TIMER_ACTIONS } from "@/utils/constants";

interface clockProps {
    time: number,
    setTime: (value: (a: number) => number) => void,
    handleTimerAction: (action: string) => void
}

function getMinutes(s: number) {
    return Math.floor(s / 60);
}

function getDisplayTime(seconds: number) {
    const minutes = getMinutes(seconds);
    const s = seconds % 60;
    return `${minutes}:${s < 10 ? "0" + s : s}`;
}

export default function Clock({ time, setTime, handleTimerAction }: clockProps) {
    const intervalRef = useRef<any>(null);

    const isRunning = Boolean(intervalRef.current)
    useEffect(() => {
        if (time === 0) {
            handleTimerAction(TIMER_ACTIONS.skip)
        }
    }, [time])

    function startTimer() {
        if (!intervalRef.current) {
            const id = setInterval(() => {
                setTime((a: number) => a > 0 ? a - 1 : a);
            }, 1000);
            intervalRef.current = id;
        }
    }

    function pauseTimer() {
        clearInterval(intervalRef?.current);
        intervalRef.current = null;
    }


    const singleTap = Gesture.Tap()
        .onEnd(() => {
            if (isRunning) {
                pauseTimer()
                handleTimerAction(TIMER_ACTIONS.pause)
            } else {
                startTimer()
                handleTimerAction(TIMER_ACTIONS.start)
            }
        })
        .runOnJS(true);

    const swipeDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onEnd(() => {
            pauseTimer()
            handleTimerAction(TIMER_ACTIONS.stop)
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
            handleTimerAction(TIMER_ACTIONS.skip)
            startTimer()
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