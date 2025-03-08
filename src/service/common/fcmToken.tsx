import { PermissionsAndroid, Platform } from "react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { navigationRef } from "../../navigation/service/navigationService";

export async function getFcmPushToken() {
  try {
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        const authStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (authStatus == "granted") {
          const pushToken = await messaging().getToken();
          // console.log("🚀 ~ getFcmPushToken ~ pushToken:", pushToken);
          return pushToken;
        }
      } else {
        const pushToken = await messaging().getToken();
        // console.log("🚀 ~ getFcmPushToken ~ pushToken:", pushToken);
        return pushToken;
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const pushToken = await messaging().getToken();
        // console.log("🚀 ~ getFcmPushToken ~ pushToken:", pushToken);
        return pushToken;
      } else {
        console.error("Permission Denined");
      }
    }
  } catch (error) {
    console.error("FCM Token Error", error);
  }
}

export const notifcationServices = () => {
  // console.log("notifcationServices called");

  // Background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // console.log("Message handled in the background!", remoteMessage);
    handleNotification(remoteMessage);
  });

  // When the app is opened from a background state
  messaging().onNotificationOpenedApp((remoteMessage) => {
    // console.log(
    //   "Notification caused app to open in background state----",
    //   remoteMessage
    // );
    handleNotification(remoteMessage);
  });

  // Foreground message handle
  messaging().onMessage(async (remoteMessage) => {
    // console.log(
    //   "A new FCM message in Foreground---------",
    //   JSON.stringify(remoteMessage)
    // );
    handleNotification(remoteMessage);
  });

  // Get the initial notification if the app was opened from a quit state
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        // console.log(
        //   "notifications caused app to open from quit state----",
        //   remoteMessage
        // );
        handleNotification(remoteMessage);
      }
    });
};

const handleNotification = (remoteMessage: any) => {
  const notificationType = remoteMessage?.data?.notificationtype;

  if (notificationType === "Credit" || "Debit") {
    navigationRef.current?.navigate("ProfileStack");
  }
};
