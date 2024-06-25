import { NormalText } from "@/components/ui/StyledText";
import dayjs, { Dayjs } from "dayjs";
import {
    workTimeAtom,
    breakTimeAtom,
    workTimeLogAtom,
    breakTimeLogAtom,
} from "@/store/time";
import { useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";
import {
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Clock from "./Clock";
import { TIMER_ACTIONS, TIMER_NATURE } from "@/utils/constants";

export default function Pomodoro() {
    const workTime = useAtomValue(workTimeAtom);
    const breakTime = useAtomValue(breakTimeAtom);
    const [time, setTime] = useState<number>(workTime);
    const [timerNature, setTimerNature] = useState(TIMER_NATURE.work);
    const [workTimeLog, setWorkTimeLog] = useAtom(workTimeLogAtom);
    const [breakTimeLog, setBreakTimeLog] = useAtom(breakTimeLogAtom);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);

    const logWorkTime = (endTime: Dayjs) => {
        if (startTime) {
            setWorkTimeLog([
                ...workTimeLog,
                { startTime, endTime },
            ]);
        }
    };

    const logBreakTime = (endTime: Dayjs) => {
        if (startTime) {
            setBreakTimeLog([
                ...breakTimeLog,
                { startTime, endTime },
            ]);
        }
    };

    const startTimer = () => {
        setStartTime(dayjs());
    }

    const pauseTimer = (currentTime: Dayjs = dayjs()) => {
        if (timerNature === TIMER_NATURE.work) {
            logWorkTime(currentTime);
        } else {
            logBreakTime(currentTime);
        }
        setStartTime(null)
    }

    const skipTimer = (currentTime: Dayjs = dayjs()) => {
        if (timerNature === TIMER_NATURE.work) {
            setTimerNature(TIMER_NATURE.break);
            setTime(breakTime);
            logWorkTime(currentTime);

        } else {
            setTimerNature(TIMER_NATURE.work);
            setTime(workTime);
            logBreakTime(currentTime);
        }
        if (startTime) setStartTime(currentTime)
    }

    const stopTimer = (currentTime: Dayjs = dayjs()) => {
        setTime(workTime);
        logWorkTime(currentTime);
        setStartTime(null)
    }

    const handleTimerActions = (action: string) => {
        switch (action) {
            case TIMER_ACTIONS.start:
                startTimer()
                break;
            case TIMER_ACTIONS.pause:
                pauseTimer()
                break;
            case TIMER_ACTIONS.skip:
                skipTimer()
                break;
            case TIMER_ACTIONS.stop:
                stopTimer()
                break;
            case TIMER_ACTIONS.warn:
                console.log("1 min remaining warning")
                break;
        }
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
            <Clock time={time} setTime={setTime} handleTimerAction={handleTimerActions} />
        </GestureHandlerRootView>
    );
}
