import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Clock2 from './Clock2';
import { TIMER_ACTIONS, TIMER_NATURE } from '@/utils/constants';
import { useAtomValue } from 'jotai';
import { breakTimeAtom, workTimeAtom, addTimeAtom } from '@/store/time';
import dayjs, { Dayjs } from 'dayjs';
import { TIME_OBJECT_TYPE } from '@/utils/types';

function getSecondsDifference(latest: Dayjs, old: Dayjs) {
  return latest.diff(old, 'seconds');
}

export default function Pomodoro2() {
  const workTime = useAtomValue(workTimeAtom);
  const breakTime = useAtomValue(breakTimeAtom);
  const addTimeValue = useAtomValue(addTimeAtom);
  const intervalRef = useRef<any>(null);
  const [time, setTime] = useState<TIME_OBJECT_TYPE>({
    start: null,
    elapsed: 0,
    remaining: workTime,
    nature: TIMER_NATURE.work,
    totalTime: workTime,
  });

  const getElapsedTime = (currentTime: Dayjs = dayjs()) => {
    if (time.start) {
      return getSecondsDifference(currentTime, time.start);
    }
    return 0;
  };

  const getRemainingTime = (timeObject: TIME_OBJECT_TYPE) => {
    const currentTime = dayjs();
    let timeLeft = timeObject.totalTime;

    if (timeObject.start) {
      const diff = getSecondsDifference(currentTime, timeObject.start);
      timeLeft = timeObject.totalTime - diff - timeObject.elapsed;
      console.log(
        'timeleft',
        timeLeft,
        'diff',
        diff,
        'latest',
        currentTime,
        'old',
        timeObject.start,
        'elapsed time',
        timeObject.elapsed
      );
    }
    return timeLeft;
  };

  const startUpdater = () => {
    if (!intervalRef.current) {
      const id = setInterval(() => {
        setTime((a) => {
          const remaining = getRemainingTime(a);
          return { ...a, remaining };
        });
      }, 1000);
      intervalRef.current = id;
    }
  };

  const clearUpdater = () => {
    clearInterval(intervalRef?.current);
    intervalRef.current = null;
  };

  const onStartOrResume = () => {
    setTime({ ...time, start: dayjs() });
    startUpdater();
  };

  const onPause = () => {
    setTime({ ...time, elapsed: time.elapsed + getElapsedTime() });
    clearUpdater();
  };

  const onTap = () => {
    if (!time.start || !intervalRef.current) {
      onStartOrResume();
    } else if (intervalRef.current) {
      onPause();
    }
  };

  const addTime = () => {
    setTime({ ...time, totalTime: time.totalTime + addTimeValue });
  };

  const skipSession = () => {
    clearUpdater();
    if (time.nature === TIMER_NATURE.work) {
      setTime({
        start: dayjs(),
        elapsed: 0,
        nature: TIMER_NATURE.break,
        totalTime: breakTime,
        remaining: breakTime,
      });
    } else if (time.nature === TIMER_NATURE.break) {
      setTime({
        ...time,
        start: dayjs(),
        elapsed: 0,
        nature: TIMER_NATURE.work,
        totalTime: workTime,
        remaining: workTime,
      });
    }
    if (!intervalRef.current) {
      startUpdater();
    }
  };

  const onStop = () => {
    clearUpdater();
    setTime({
      ...time,
      totalTime: workTime,
      remaining: workTime,
      elapsed: 0,
      nature: TIMER_NATURE.work,
    });
  };

  const handleTimerActions = (action: string) => {
    switch (action) {
      case TIMER_ACTIONS.tap:
        onTap();
        break;
      case TIMER_ACTIONS.swipeUp:
        addTime();
        break;
      case TIMER_ACTIONS.swipeLeftOrRight:
        skipSession();
        break;
      case TIMER_ACTIONS.swipeDown:
        onStop();
        break;
    }
  };

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}
    >
      <Clock2 time={time} handleTimerAction={handleTimerActions} />
    </GestureHandlerRootView>
  );
}
