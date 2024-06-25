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

    const handleTimerActions = (action: string) => {
        const currentTime = dayjs();
        switch (action) {
            case TIMER_ACTIONS.start:
                setStartTime(dayjs());
                break;
            case TIMER_ACTIONS.pause:
                if (timerNature === TIMER_NATURE.work) {
                    logWorkTime(currentTime);
                } else {
                    logBreakTime(currentTime);
                }
                setStartTime(null)
                break;
            case TIMER_ACTIONS.skip:
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
                break;
            case TIMER_ACTIONS.stop:
                if (timerNature === TIMER_NATURE.work) {
                    setTime(workTime);
                    logWorkTime(currentTime);
                }
                setStartTime(null)
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
