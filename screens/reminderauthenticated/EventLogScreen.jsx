import { View, Text, StyleSheet, FlatList } from "react-native";

import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

import FallHistory from "../../components/dashboard/FallHistory";
import TextScreen from "../../components/header/TextScreen";

export default function EventLogScreen() {
  const data = [
    {
      id: 1,
      date: new Date().toLocaleDateString(), // Gets the current date in a readable format
      time: new Date().toLocaleTimeString(), // Gets the current time in a readable format
      falldetails: "Severe fall detected",
    },
    {
      id: 2,
      date: new Date().toLocaleDateString(), // Gets the current date in a readable format
      time: new Date().toLocaleTimeString(), // Gets the current time in a readable format
      falldetails: "Severe fall detected",
    },
    {
      id: 3,
      date: new Date().toLocaleDateString(), // Gets the current date in a readable format
      time: new Date().toLocaleTimeString(), // Gets the current time in a readable format
      falldetails: "Severe fall detected",
    },
    {
      id: 4,
      date: new Date().toLocaleDateString(), // Gets the current date in a readable format
      time: new Date().toLocaleTimeString(), // Gets the current time in a readable format
      falldetails: "Severe fall detected",
    },
    {
      id: 5,
      date: new Date().toLocaleDateString(), // Gets the current date in a readable format
      time: new Date().toLocaleTimeString(), // Gets the current time in a readable format
      falldetails: "Severe fall detected",
    },
  ];

  // useEffect(() => {
  //   const configurePushNotification = async () => {
  //     const { status } = await Notifications.getPermissionsAsync();
  //     let finalStatus = status;

  //     if (finalStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     if (finalStatus !== "granted") {
  //       Alert.alert(
  //         "Important!",
  //         "RemindeRx needs the appropriate permissions"
  //       );
  //       return;
  //     }

  //     const pushTokenData = await Notifications.getExpoPushTokenAsync();
  //     console.log("Push Token:", pushTokenData);

  //     if (Platform.OS === "android") {
  //       Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.DEFAULT,
  //       });
  //     }
  //   };

  //   configurePushNotification();
  // }, []);

  return (
    <View style={styles.root}>
      <View style={styles.textContainer}>
        <TextScreen>Fall Detection History</TextScreen>
      </View>

      <View style={styles.textStyle}>
        <Text style={styles.fall}>Fall Events: {data.length}</Text>
      </View>

      <View style={styles.dataContainer}>
        <Text style={styles.eventText}>List of Events</Text>
        {!data.length < 1 ? (
          <FlatList
            bounces={false}
            overScrollMode="never"
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FallHistory itemData={item} />}
          />
        ) : (
          <View style={styles.history}>
            <Text style={styles.historyText}>
              Please enable Fall Detection System in Dashboard to view the
              history.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.bgColor,
    paddingHorizontal: 18,
  },

  textContainer: {
    marginTop: 20,
  },

  dataContainer: {
    marginTop: 54,
    flex: 1,
    marginBottom: 20,
  },

  textStyle: {
    alignItems: "center",
  },

  eventText: {
    color: "white",
    fontFamily: Fonts.main,
    fontSize: 16,
  },

  fall: {
    fontFamily: Fonts.main,
    color: "white",
    backgroundColor: Color.container,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginTop: 10,
  },

  history: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  historyText: {
    textAlign: "center",
    color: Color.tagLine,
    fontFamily: Fonts.sub,
    fontSize: 13,
  },
});
