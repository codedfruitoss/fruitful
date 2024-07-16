import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { NormalText } from '../ui/StyledText';
import { useEffect, useRef, useState } from 'react';
import { CLOCK_ACTION, TIMER_ACTIONS } from '@/utils/constants';
import { warningTimeAtom } from '@/store/time';
import { useAtomValue } from 'jotai';
import { getDisplayTime } from '@/utils/time';
import { TIME_OBJECT_TYPE } from '@/utils/types';

interface clockProps {
  time: TIME_OBJECT_TYPE;
  handleTimerAction: (action: string) => void;
}

export default function Clock2({ time, handleTimerAction }: clockProps) {
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

  return (
    <GestureDetector gesture={gestures}>
      <NormalText
        style={{
          fontSize: 86,
          padding: 86,
        }}
      >
        {time.remaining ? getDisplayTime(time.remaining) : ''}
      </NormalText>
    </GestureDetector>
  );
}
