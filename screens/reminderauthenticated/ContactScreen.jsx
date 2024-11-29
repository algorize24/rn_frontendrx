import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";

// image
import EmptyImage from "../../assets/others/contactempty.png";

// constant
import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

// components
import ErrorComponent from "../../components/dashboard/ErrorComponent";
import ListContact from "../../components/desc/ListContact";
import Label from "../../components/dashboard/Label";
import IsEmpty from "../../components/dashboard/isEmpty";
import LoadingContact from "../../components/loading/LoadingContact";

// axios
import axios from "axios";

// auth context
import { useAuth } from "../../context/authContext";

// firebase
import { auth } from "../../firebase/firebase";

// connection of android and ios
import { android_url, ios_url } from "../../constants/Url";

// notification
import * as Notifications from "expo-notifications";

// import Calendar for calendar access
import * as Calendar from "expo-calendar";

// connection path
const connection =
  Platform.OS === "android" ? `${android_url}/contact ` : `${ios_url}/contact`;

// notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ContactScreen({ navigation }) {
  // context
  const { user } = useAuth();

  // state for displaying contact
  const [displayContact, setDisplayContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // loading state

  // search state
  const [searchContact, setSearchContact] = useState([]);
  const [search, setSearch] = useState("");

  // error state
  const [error, setError] = useState("");

  // display contact by certain user
  const fetchContact = async () => {
    setIsLoading(true);

    // get the currentUser
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken(); // get the token

        // send a request to the backend
        const response = await axios.get(connection, {
          headers: {
            Authorization: `Bearer ${token}`, // pass the firebase token to verify.
          },
        });

        setDisplayContact(response.data.contacts);
        setSearchContact(response.data.contacts);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearch(query); // update the search query state
    if (query === "") {
      setSearchContact(displayContact); // if the search is empty, show all contacts
    } else {
      const filtered = displayContact.filter(
        (contact) => contact.name.toLowerCase().includes(query.toLowerCase()) // case-insensitive filter
      );
      setSearchContact(filtered);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchContact(); // Refetch contact list when the screen is focused
    }, [user])
  );

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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        <TextInput
          style={styles.textInput}
          placeholder="Search Contact..."
          placeholderTextColor={Color.tagLine}
          value={search}
          onChangeText={handleSearch}
        />

        <View style={styles.dataContainer}>
          <Label
            onPress={() => {
              navigation.navigate("AddContact");
            }}
          >
            All Contact
          </Label>

          {error ? (
            <View style={styles.error}>
              <ErrorComponent message={error} />
            </View>
          ) : isLoading ? (
            <LoadingContact />
          ) : searchContact.length > 0 ? (
            <FlatList
              overScrollMode="never"
              bounces={false}
              data={searchContact} // display filtered contacts
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => <ListContact itemData={item} />}
            />
          ) : (
            <View style={styles.isEmpty}>
              <IsEmpty
                image={EmptyImage}
                message={"You haven’t added any contact yet"}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.bgColor,
    paddingHorizontal: 18,
  },

  textInput: {
    backgroundColor: Color.container,
    borderColor: Color.tagLine,
    marginTop: 54,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: Color.tagLine,
    fontFamily: Fonts.main,
  },

  dataContainer: {
    marginTop: 40,
    flex: 1,
    marginBottom: 20,
  },

  isEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  error: {
    flex: 1,
    justifyContent: "center",
  },
});
