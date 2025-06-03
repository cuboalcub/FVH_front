import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se obtuvo permiso para las notificaciones push.');
      return;
    }
  } else {
    alert('Las notificaciones push solo funcionan en dispositivos físicos.');
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo push token:", token);
  return token;
}