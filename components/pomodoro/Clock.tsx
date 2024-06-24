import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { NormalText } from "../ui/StyledText";
import { useEffect, useRef, useState } from "react";

interface clockProps {
    time: { time: number },
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


export default function Clock({ time, handleTimerAction }: clockProps) {

    console.log("time", time)
    const [clockTime, setClockTime] = useState(time.time);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<any>(null);


    useEffect(() => {
        if (clockTime === 0) {
            handleTimerAction('skipTimer')// skipTimer();
        }
    }, [clockTime]);

    useEffect(() => {
        setClockTime(time.time)
        startTimer()
    }, [time])

    function startTimer() {
        if (!intervalRef.current) {
            const id = setInterval(() => {
                setClockTime((a) => (a > 0 ? a - 1 : a));
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
            if (!isPaused) {
                startTimer()
                handleTimerAction('startTimer')// startTimer();
                // setIsTimerOnFlag(true)
            } else {
                pauseTimer()
                handleTimerAction('pauseTimer') // pauseTimer();
                // setIsTimerOnFlag(false)
            }
            setIsPaused((isPaused) => !isPaused);
        })
        .runOnJS(true);

    const swipeDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onEnd(() => {
            pauseTimer()
            handleTimerAction('stopTimer')// stopTimer();
            setIsPaused(false);
            // setIsTimerOnFlag(false)
        })
        .runOnJS(true);

    const swipeUp = Gesture.Fling()
        .direction(Directions.UP)
        .onEnd(() => {
            setClockTime((a) => (a > 0 ? a + 60 : a));
        })
        .runOnJS(true);

    const swipeLeft = Gesture.Fling()
        .direction(Directions.LEFT | Directions.RIGHT)
        .onEnd(() => {
            handleTimerAction('skipTimer')// skipTimer();
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
                {getDisplayTime(clockTime)}
            </NormalText>
        </GestureDetector>

    );
}