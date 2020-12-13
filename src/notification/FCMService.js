import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class FCMService {
  
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
  }

  registerAppWithFCM = async () => {
    if(Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true); 
    }
  }

  checkPermission = (onRegister) => {
    messaging().hasPermission()
    .then(enabled => {
      if(enabled)
        this.getToken(onRegister);
      else
        this.requestPermission(onRegister);
    }).catch(error => console.log('[FCMService] Permission rejected ', error));
  }

  getToken = (onRegister) => {
    messaging().getToken()
    .then(token => {
      if(token)
        onRegister(token);
      else
        console.log('[FCMService] User does not have a device token');
    }).catch(error => console.log('[FCMService] getToken rejected ', error));
  }

  deleteToken = () => {
    console.log('[FCMService] deleteToken ');
    messaging().deleteToken()
    .catch(error => console.log('[FCMService] Delete token error ', error));
  }

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {

    // When the app is running, but in the background
    messaging()
    .onNotificationOpenedApp(message => {
      console.log('[FCMService] onNotificationOpenedApp Notification caused app to open');
      if(message) {
        onOpenNotification(message);
      }
    });

    // When the app is opened from a quit state
    messaging()
    .getInitialNotification()
    .then(message => {
      console.log('[FCMService] getInitialNotification Notification caused app to open');
      if(message) {
        onOpenNotification(message);
      }
    });

    this.messageListener = messaging().onMessage(async message => {
      console.log('[FCMService] A new FCM message arrived!', message);
      if(message) {
        let notification = null;
        if(Platform.OS === 'ios') 
          notification = message.data.notification;
        else
          notification = message.notification;
        
        onNotification(notification);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh(token => {
      console.log('[FCMService] New token refresh: ', token);
      onRegister(token);
    });
  }

  unRegister = () => {
    this.messageListener();
  }
}

export const fcmService = new FCMService();



