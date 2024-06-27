import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { NormalText } from "../ui/StyledText";
import { useEffect, useRef, useState } from "react";
import { CLOCK_ACTION, TIMER_ACTIONS } from "@/utils/constants";
import { warningTimeAtom } from "@/store/time";
import { useAtomValue } from "jotai";

interface clockProps {
    time: { time: number, action?: string },
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
    const intervalRef = useRef<any>(null);
    const warningTime = useAtomValue(warningTimeAtom)
    const [clockTime, setClockTime] = useState(time.time)

    useEffect(() => {
        console.log("time clock", time.time)
        setClockTime(time.time)
        if (time.action === CLOCK_ACTION.start) {
            startTimer()
        }
    }, [time])

    const isRunning = Boolean(intervalRef.current)
    useEffect(() => {
        if (clockTime === 0) {
            pauseTimer()
            handleTimerAction(TIMER_ACTIONS.end)
        }
        else if (clockTime === warningTime) {
            handleTimerAction(TIMER_ACTIONS.warn)
        }

    }, [clockTime])

    function startTimer() {
        if (!intervalRef.current) {
            const id = setInterval(() => {
                setClockTime((a: number) => a > 0 ? a - 1 : a);
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
            setClockTime((a) => (a > 0 ? a + 60 : a));
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
                {getDisplayTime(clockTime)}
            </NormalText>
        </GestureDetector>

    );
}