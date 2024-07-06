import dayjs, { Dayjs } from 'dayjs';
import {
  workTimeAtom,
  breakTimeAtom,
  workTimeLogAtom,
  breakTimeLogAtom,
} from '@/store/time';
import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Clock from './Clock';
import {
  CLOCK_ACTION,
  TIMER_ACTIONS,
  TIMER_NATURE,
  appStates,
  notificationIdentifiers,
} from '@/utils/constants';
import { Alert, AppState } from 'react-native';
import { AVPlaybackSource, Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from '@/utils/notifications';
import { NormalText } from '../ui/StyledText';

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
  const [currentAppState, setCurrentAppState] = useState(AppState.currentState);
  const [sessionEndNotificationId, setSessionEndNotificationId] = useState('');
  const responseListener = useRef<Notifications.Subscription>();

  const displayNotification = async () => {
    if (startTime) {
      await schedulePushNotification(timerNature, setSessionEndNotificationId);
    }
  };

  const startWorkOrbreak = (timeNature?: string) => {
    let ongoingTimeNature = timeNature;
    if (!ongoingTimeNature) {
      ongoingTimeNature =
        timerNature === TIMER_NATURE.work
          ? notificationIdentifiers.startBreak
          : notificationIdentifiers.startWork;
    }

    if (ongoingTimeNature === notificationIdentifiers.startWork) {
      setTimerNature(TIMER_NATURE.work);
      setTime({
        time: workTime,
        action: CLOCK_ACTION.start,
      });
    } else if (ongoingTimeNature === notificationIdentifiers.startBreak) {
      setTimerNature(TIMER_NATURE.break);
      setTime({
        time: breakTime,
        action: CLOCK_ACTION.start,
      });
    }
  };

  const startWorkOrBreakHandler = async (timeNature: string, id: string) => {
    await Notifications.dismissNotificationAsync(id);
    startWorkOrbreak(timeNature);
  };

  const stopTimerHandler = async (id: string) => {
    await Notifications.dismissNotificationAsync(id);
    onStop();
  };

  useEffect(() => {
    registerForPushNotificationsAsync();

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          if (response.actionIdentifier === 'stopTimer') {
            stopTimerHandler(response?.notification?.request?.identifier);
          } else if (
            response.actionIdentifier === notificationIdentifiers.startBreak ||
            response.actionIdentifier === notificationIdentifiers.startWork
          ) {
            startWorkOrBreakHandler(
              response?.actionIdentifier,
              response?.notification?.request?.identifier
            );
          }
        }
      );
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setCurrentAppState(nextAppState);
    });

    return () => {
      if (responseListener?.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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

  const onSkip = async (currentTime: Dayjs = dayjs()) => {
    if (sessionEndNotificationId) {
      await Notifications.dismissNotificationAsync(sessionEndNotificationId);
    }
    if (timerNature === TIMER_NATURE.work) {
      setTimerNature(TIMER_NATURE.break);
      setTime({ time: breakTime, action: CLOCK_ACTION.start });
      logWorkTime(currentTime);
    } else {
      setTimerNature(TIMER_NATURE.work);
      setTime({ time: workTime, action: CLOCK_ACTION.start });
      logBreakTime(currentTime);
    }
    setStartTime(currentTime);
  };

  const onStop = async (currentTime: Dayjs = dayjs()) => {
    setTime({ time: workTime });
    logWorkTime(currentTime);
    setStartTime(null);
    setTimerNature(TIMER_NATURE.work);
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
            console.log('timer nature', timerNature);
            startWorkOrbreak();
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
        if (currentAppState === appStates.active) {
          confirmationMessage();
        } else {
          displayNotification();
        }
        break;
      case TIMER_ACTIONS.warn:
        playSound(sounds.warning);
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
      <Clock time={time} handleTimerAction={handleTimerActions} />
      <NormalText>{timerNature}</NormalText>
    </GestureHandlerRootView>
  );
}
