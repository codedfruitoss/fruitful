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
  const [ptime, setPTime] = useState(1500);
  // const [timerOn, setTimerOn] = useState(false)
  // let myTimer: any


  useEffect(() => {
    setInterval(() => { setPTime((a) => a > 0 ? a - 1 : a); }, 1000);
  }, []);

  // useEffect(() => {
  //   console.log("inside useeee", timerOn)
  //   // const myTimer = setInterval(() => { setPTime((a) => a > 0 ? a - 1 : a); }, 1000);
  //   if (!timerOn) {
  //     clearInterval(myTimer)
  //   }
  //   else {
  //     clearInterval(myTimer)
  //     myTimer = setInterval(() => { setPTime((a) => a > 0 ? a - 1 : a); }, 1000);
  //   }
  // }, [timerOn])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {/* <NormalText style={{ margin: "auto" }}>{getDisplayTime(ptime)}</NormalText> */}
        <Pressable style={{ margin: "auto" }} onPress={() => { }}>
          <NormalText>{getDisplayTime(ptime)}</NormalText>
        </Pressable>
      </View>
    </View>
  );
}
