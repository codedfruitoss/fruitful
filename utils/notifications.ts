import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { TIMER_NATURE } from './constants';
import { TIME_OBJECT_TYPE } from './types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// export async function persistentNotificationButtons(timerNature: string) {
//   const timerLabel = timerNature === TIMER_NATURE.work ? 'Break' : 'Work';
//   await Notifications.setNotificationCategoryAsync('sessionEndNotification', [
//     {
//       buttonTitle: `Start ${timerLabel}`,
//       identifier: `start${timerLabel}`,
//     },
//     {
//       identifier: 'stopTimer',
//       buttonTitle: 'Stop',
//     },
//   ]);
// }

export async function schedulePushNotification(time: TIME_OBJECT_TYPE) {
  // persistentNotificationButtons(time.nature);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${time.nature} session is over`,
      // sticky: true,
      categoryIdentifier: 'sessionEndNotification',
    },
    trigger:
      time.remaining && time.remaining > 1
        ? {
            seconds: time.remaining,
          }
        : null,
    identifier: 'sessionEndNotification',
  });
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('token', token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
