import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class LocalNotificationService {

    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: (token) => {
                console.log('[LocalNotificationService] onRegister: ', token);
            },

            onNotification: (notification) => {
                console.log('[LocalNotificationService] onNotification: ' , notification);
            },

            onAction: (notification) => {
                console.log('[LocalNotificationService] onAction: ' , notification);
            },

            onRegistrationError: (error) => {
                console.log('[LocalNotificationService] onRegistrationError: ' , error);
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            popInitialNotification: true,

            requestPermissions: true
        });
    }

    createChannels = () => {
        PushNotification.createChannel(
            {
              channelId: "PoolOff-Alarm", // (required)
              channelName: "PoolOff-Alarm", // (required)
              channelDescription: "PoolOff-Alarm", // (optional) default: undefined.
              soundName: "alarm", // (optional) See `soundName` parameter of `localNotification` function
              importance: 4, // (optional) default: 4. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
            {
                channelId: "PoolOff-Message", // (required)
                channelName: "PoolOff-Message", // (required)
                channelDescription: "PoolOff-Message", // (optional) default: undefined.
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }

    deleteChannel = () => {
        PushNotification.deleteChannel('Miscellaneous');
        PushNotification.deleteChannel('PoolOff-Alarm');
        PushNotification.deleteChannel('PoolOff-Message');
    }

    unregister = () => {
        PushNotification.unregister();
    }

    showNotification = (notification) => {
        console.log('showNotification');
        PushNotification.localNotification({
            channelId: notification.android.channelId,
            autoCancel: true,
            largeIcon: notification.android.smallIcon || 'ic_launcher',
            smallIcon: notification.android.smallIcon || 'ic_launcher',
            bigText: notification.body || '',
            subText: notification.title || '',
            title: notification.title || '',
            message: notification.body || '',
            bigPictureUrl: notification.bigPictureUrl,
            vibate : true,
            vibration: 5000,
            priority: 'max',
            playSound: true,
            soundName: notification.android.sound,
            userInteraction: false,
            messageId: notification.messageId,
            largeIconUrl: notification.android.imageUrl,
        });
    }

    buildAndroidNotification = (title, message, bigPictureUrl) => {
        return {
            channelId: 'PoolOff',
            autoCancel: true,
            largeIcon: 'ic_launcher',
            smallIcon: 'ic_launcher',
            bigText: message || '',
            subText: title || '',
            bigPictureUrl: bigPictureUrl,
            vibate : true,
            vibration: 5000,
            priority: 'high'
        }
    }

    cancelAllLocalNotifications = () => {
        if(Platform.OS === 'ios')
            PushNotification.removeAllDeliveredNotifications();
        else
            PushNotification.cancelAllLocalNotifications();
    }

    removeDeliverdNotificationID = (notificationId) => {
        console.log('[LocalNotificationService] removeDeliverdNotificationID: ', notificationId);
        PushNotification.cancelLocalNotifications({ id: `${notificationId}`});
    }
}

export const localNotificationService = new LocalNotificationService();