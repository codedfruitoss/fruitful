import React from 'react';
import Pomodoro from './Pomodoro';
import { View } from 'react-native';
import ChangeLabel from './ChangeLabel';
import Settings from './Settings';

export default function Dashboard() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <Pomodoro />
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Settings />
        <ChangeLabel />
      </View>
    </View>
  );
}
