import { NormalText } from "@/components/StyledText";
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


  useEffect(() => {
    setInterval(() => { setTime((a) => a > 0 ? a - 1 : a); }, 1000);
  }, []);

  const skipTimer = () => {
    if (workOrBreak === 'work') {
      setTimerType('break')
      setTime(breakTime)
    }
    else {
      setTimerType('work')
      setTime(workTime)
    }
  }

  useEffect(() => {
    if (time === 0) {
      skipTimer()
    }
  }), [time]


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {/* <NormalText style={{ margin: "auto" }}>{getDisplayTime(ptime)}</NormalText> */}
        <Pressable style={{ margin: "auto" }} onPress={() => { }}>
          <NormalText>{getDisplayTime(time)}</NormalText>
        </Pressable>
        <Pressable style={{ margin: "auto" }} onPress={skipTimer}
        >
          <NormalText>Swipe right</NormalText>
        </Pressable>
        {/* <Pressable style={{ margin: "auto" }} onPress={() => { }}>
          <NormalText>Swipe left</NormalText>
        </Pressable> */}
      </View>
    </View>
  );
}
