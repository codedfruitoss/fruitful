import dayjs, { Dayjs } from 'dayjs';
import {
  workTimeAtom,
  breakTimeAtom,
  workTimeLogAtom,
  breakTimeLogAtom,
} from '@/store/time';
import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Clock from './Clock';
import { CLOCK_ACTION, TIMER_ACTIONS, TIMER_NATURE } from '@/utils/constants';
import { Alert } from 'react-native';
import { AVPlaybackSource, Audio } from 'expo-av';

const sounds = {
  warning: require('../../assets/audio/warning.mp3'),
  stop: require('../../assets/audio/stop.mp3'),
};

export default function Pomodoro() {
  const workTime = useAtomValue(workTimeAtom);
  const breakTime = useAtomValue(breakTimeAtom);
  const [time, setTime] = useState<{ time: number; action?: string }>({
    time: workTime,
  });
  const [timerNature, setTimerNature] = useState(TIMER_NATURE.work);
  const [workTimeLog, setWorkTimeLog] = useAtom(workTimeLogAtom);
  const [breakTimeLog, setBreakTimeLog] = useAtom(breakTimeLogAtom);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const logWorkTime = (endTime: Dayjs) => {
    if (startTime) {
      setWorkTimeLog([...workTimeLog, { startTime, endTime }]);
    }
  };

  const logBreakTime = (endTime: Dayjs) => {
    if (startTime) {
      setBreakTimeLog([...breakTimeLog, { startTime, endTime }]);
    }
  };

  const onStart = () => {
    setStartTime(dayjs());
  };

  const onPause = (currentTime: Dayjs = dayjs()) => {
    if (timerNature === TIMER_NATURE.work) {
      logWorkTime(currentTime);
    } else {
      logBreakTime(currentTime);
    }
    setStartTime(null);
  };

  const onSkip = (currentTime: Dayjs = dayjs()) => {
    if (timerNature === TIMER_NATURE.work) {
      setTimerNature(TIMER_NATURE.break);
      setTime({ time: breakTime });
      logWorkTime(currentTime);
    } else {
      setTimerNature(TIMER_NATURE.work);
      setTime({ time: workTime });
      logBreakTime(currentTime);
    }
    if (startTime) setStartTime(currentTime);
  };

  const onStop = (currentTime: Dayjs = dayjs()) => {
    setTime({ time: workTime });
    logWorkTime(currentTime);
    setStartTime(null);
  };

  const confirmationMessage = () => {
    return Alert.alert(
      `${
        timerNature === TIMER_NATURE.work
          ? 'Work session is over'
          : 'Break session is over'
      }`,
      undefined,
      [
        {
          text: `Start ${timerNature === TIMER_NATURE.work ? 'Break' : 'Work'}`,
          onPress: () => {
            if (timerNature === TIMER_NATURE.work) {
              setTime({
                time: breakTime,
                action: CLOCK_ACTION.start,
              });
              setTimerNature(TIMER_NATURE.break);
            } else if (timerNature === TIMER_NATURE.break) {
              setTime({
                time: workTime,
                action: CLOCK_ACTION.start,
              });
              setTimerNature(TIMER_NATURE.work);
            }
          },
        },
        {
          text: 'Stop',
          onPress: () => {
            onStop();
          },
        },
      ]
    );
  };

  const playSound = async (path: AVPlaybackSource) => {
    if (sound) {
      sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(path, {
      isLooping: true,
    });
    setSound(newSound);
    await newSound.playAsync();
  };

  // const stopSound = async () => {
  //   if (sound) {
  //     await sound.stopAsync();
  //   }
  // };

  const handleTimerActions = (action: string) => {
    switch (action) {
      case TIMER_ACTIONS.start:
        onStart();
        break;
      case TIMER_ACTIONS.pause:
        onPause();
        break;
      case TIMER_ACTIONS.skip:
        onSkip();
        break;
      case TIMER_ACTIONS.stop:
        onStop();
        break;
      case TIMER_ACTIONS.end:
        confirmationMessage();
        break;
      case TIMER_ACTIONS.warn:
        console.log('1 min remaining warning');
        playSound(sounds.warning);
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}
    >
      <Clock time={time} handleTimerAction={handleTimerActions} />
    </GestureHandlerRootView>
  );
}
