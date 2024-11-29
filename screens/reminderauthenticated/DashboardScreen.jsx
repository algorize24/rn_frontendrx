import {
  StyleSheet,
  FlatList,
  View,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";

// constants
import { Color } from "../../constants/Color";

// components
import Userprofile from "../../components/dashboard/Userprofile";
import HealthOverview from "../../components/dashboard/HealthOverview";
import NewsArticle from "../../components/dashboard/NewsArticle";

// notification
import * as Notifications from "expo-notifications";

// import Calendar for calendar access
import * as Calendar from "expo-calendar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function DashboardScreen() {
  // state to store calendar permission status
  const [calendarPermission, setCalendarPermission] = useState(false);

  useEffect(() => {
    // ask to allow the notification
    const configurePushNotification = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Important!",
          "RemindeRx needs the appropriate permissions"
        );
        return;
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log("Push Token:", pushTokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    configurePushNotification();

    // check and request Calendar permission only if it's not already granted
    checkCalendarPermission();
  }, []);

  // check the current Calendar permission status
  const checkCalendarPermission = async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync();

    if (status === "granted") {
      setCalendarPermission(true); // Set permission state to granted
    } else {
      // If permission is not granted, request permission
      requestCalendarPermission();
    }
  };

  // request Calendar permissions and handle syncing
  const requestCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === "granted") {
      setCalendarPermission(true); // Set permission state to granted
      Alert.alert("Success", "Calendar access granted and synced.");
    } else {
      setCalendarPermission(false); // Set permission state to denied
      Alert.alert("Permission Denied", "Calendar access is required to sync.", [
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  // avoid virtualizedLists error
  const sections = [
    { key: "UserProfile", component: <Userprofile /> },
    { key: "HealthOverview", component: <HealthOverview /> },
    { key: "NewsArticle", component: <NewsArticle /> },
  ];
  return (
    <FlatList
      overScrollMode="never"
      bounces={false}
      style={styles.root}
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => <View>{item.component}</View>}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.bgColor,
    paddingHorizontal: 18,
  },
});
