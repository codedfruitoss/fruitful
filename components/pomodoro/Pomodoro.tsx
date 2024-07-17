import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Clock from './Clock';
import { appStates, TIMER_ACTIONS, TIMER_NATURE } from '@/utils/constants';
import { useAtomValue } from 'jotai';
import { breakTimeAtom, workTimeAtom, addTimeAtom } from '@/store/time';
import dayjs, { Dayjs } from 'dayjs';
import { TIME_OBJECT_TYPE } from '@/utils/types';
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from '@/utils/notifications';
import * as Notifications from 'expo-notifications';
import {
  AppState,
  Modal,
  Pressable,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { NormalText } from '../ui/StyledText';

function getSecondsDifference(latest: Dayjs, old: Dayjs) {
  return latest.diff(old, 'seconds');
}

export default function Pomodoro() {
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
  const responseListener = useRef<Notifications.Subscription>();
  const [currentAppState, setCurrentAppState] = useState(AppState.currentState);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();

    //Notification listerner
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          if (
            response.notification.request.identifier ===
            'sessionEndNotification'
          ) {
            await Notifications.dismissNotificationAsync(
              response.notification.request.identifier
            );
          }
        }
      );

    //State to identify if app is in foreground or background
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setCurrentAppState(nextAppState);
    });

    return () => {
      subscription.remove();
      if (responseListener?.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (Number(time.remaining) === 0) {
      clearUpdater();
      setModalVisible(true);
    }
  }, [time]);

  useEffect(() => {
    if (currentAppState === appStates.background) {
      if (time.remaining !== 0) displayNotification();
    }
  }, [currentAppState]);

  const displayNotification = async () => {
    if (time.start) {
      await schedulePushNotification(time);
    }
  };

  const getElapsedTime = (currentTime: Dayjs = dayjs()) => {
    if (time.start) {
      return getSecondsDifference(currentTime, time.start);
    }
    return 0;
  };

  const startWorkOrbreak = (timeNature: string) => {
    if (timeNature === TIMER_NATURE.work) {
      setTime({
        start: dayjs(),
        elapsed: 0,
        nature: TIMER_NATURE.break,
        totalTime: breakTime,
        remaining: breakTime,
      });
    } else if (timeNature === TIMER_NATURE.break) {
      setTime({
        start: dayjs(),
        elapsed: 0,
        nature: TIMER_NATURE.work,
        totalTime: workTime,
        remaining: workTime,
      });
    }
    if (!intervalRef.current) {
      setModalVisible(false);
      startUpdater();
    }
  };

  const getRemainingTime = (timeObject: TIME_OBJECT_TYPE) => {
    const currentTime = dayjs();
    let timeLeft = timeObject.totalTime;

    if (timeObject.start) {
      const diff = getSecondsDifference(currentTime, timeObject.start);
      timeLeft = timeObject.totalTime - diff - timeObject.elapsed;
    }
    return timeLeft >= 0 ? timeLeft : 0;
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
    const updatedTotalTime = {
      ...time,
      totalTime: time.totalTime + addTimeValue,
    };
    const remainingTime = getRemainingTime(updatedTotalTime);
    setTime({ ...updatedTotalTime, remaining: remainingTime });
  };

  const skipSession = () => {
    clearUpdater();
    startWorkOrbreak(time.nature);
  };

  const onStop = () => {
    clearUpdater();
    setTime((a) => {
      return {
        ...a,
        totalTime: workTime,
        remaining: workTime,
        elapsed: 0,
        nature: TIMER_NATURE.work,
      };
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
      <Clock time={time} handleTimerAction={handleTimerActions} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {time.nature === TIMER_NATURE.work
                ? 'Work session is over'
                : 'Break session is over'}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  startWorkOrbreak(time.nature);
                }}
              >
                <NormalText
                  style={styles.textStyle}
                >{`Start ${time.nature === TIMER_NATURE.work ? 'Break' : 'Work'}`}</NormalText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  onStop();
                }}
              >
                <NormalText style={styles.textStyle}>Stop</NormalText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
