import { NormalText } from "@/components/StyledText";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";

function getMinutes(s: number) {
  return Math.floor(s / 60);
}

function getDisplayTime(seconds: number) {
  const minutes = getMinutes(seconds);
  const s = seconds % 60;
  return `${minutes}:${s}`;
}

export default function Main() {
  const workTime = 60;
  const breakTime = 30;
  const [time, setTime] = useState(workTime);
  const [workOrBreak, setTimerType] = useState('work')
  const [workTimeLog, setWorkTimeLog] = useState<any>([])
  const [breakTimeLog, setBreakTimeLog] = useState<any>([])
  const [startTime, setStartTime] = useState(dayjs())

  useEffect(() => {
    setInterval(() => { setTime((a) => a > 0 ? a - 1 : a); }, 1000);
  }, []);

  const skipTimer = () => {
    const captureTime = dayjs()
    if (workOrBreak === 'work') {
      setTimerType('break')
      setTime(breakTime)
      setWorkTimeLog([...workTimeLog, { startTime: startTime, endTime: captureTime }])

    }
    else {
      setTimerType('work')
      setTime(workTime)
      setBreakTimeLog([...breakTimeLog, { startTime: startTime, endTime: captureTime }])
    }
    setStartTime(captureTime)
  }

  useEffect(() => {
    if (time === 0) {
      skipTimer()
    }
  }), [time]

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Pressable style={{ margin: "auto" }} onPress={() => { }}>
          <NormalText>{getDisplayTime(time)}</NormalText>
        </Pressable>
        <Pressable style={{ margin: "auto" }} onPress={skipTimer}
        >
          <NormalText>Swipe Left & Right</NormalText>
        </Pressable>
      </View>
    </View>
  );
}
