import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useEffect, useRef } from 'react';
import { TIMER_ACTIONS } from '@/utils/constants';
import { getDisplayTime } from '@/utils/time';
import { TIME_OBJECT_TYPE } from '@/utils/types';
import { Animated } from 'react-native';

interface clockProps {
  time: TIME_OBJECT_TYPE;
  handleTimerAction: (action: string) => void;
  isPaused: boolean;
}
const maxValue = 1;
const minValue = 0.3;

const timerStyle = { color: 'white', fontSize: 86, padding: 86 };

export default function Clock({
  time,
  handleTimerAction,
  isPaused,
}: clockProps) {
  const fadeAnim = useRef(new Animated.Value(minValue)).current;

  const singleTap = Gesture.Tap()
    .onEnd(() => {
      handleTimerAction(TIMER_ACTIONS.tap);
    })
    .runOnJS(true);

  const swipeDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      handleTimerAction(TIMER_ACTIONS.swipeDown);
    })
    .runOnJS(true);

  const swipeUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      handleTimerAction(TIMER_ACTIONS.swipeUp);
    })
    .runOnJS(true);

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT | Directions.RIGHT)
    .onEnd(() => {
      handleTimerAction(TIMER_ACTIONS.swipeLeftOrRight);
    })
    .runOnJS(true);

  const gestures = Gesture.Exclusive(swipeLeft, swipeUp, swipeDown, singleTap);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: maxValue,
          useNativeDriver: true,
          duration: 1000,
        }),
        Animated.timing(fadeAnim, {
          toValue: minValue,
          useNativeDriver: true,
          duration: 1000,
        }),
      ])
    ).start();
  }, [isPaused]);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.Text
        style={
          isPaused ? { ...timerStyle, opacity: fadeAnim } : { ...timerStyle }
        }
      >
        {time.remaining ? getDisplayTime(time.remaining) : '0.00'}
      </Animated.Text>
    </GestureDetector>
  );
}
