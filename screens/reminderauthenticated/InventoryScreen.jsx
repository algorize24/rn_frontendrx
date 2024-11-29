import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

// empty image
import EmptyImage from "../../assets/others/inventoryempty.png";

// constant
import { Color } from "../../constants/Color";

// components
import ListInventory from "../../components/desc/ListInventory";
import Label from "../../components/dashboard/Label";
import ErrorComponent from "../../components/dashboard/ErrorComponent";
import IsEmpty from "../../components/dashboard/isEmpty";
import SortingContainer from "../../components/inventory/SortingContainer";
import LoadingInventory from "../../components/loading/LoadingInventory";

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

// import calendar for calendar access
import * as Calendar from "expo-calendar";

// connection path
const connection =
  Platform.OS === "android"
    ? `${android_url}/inventory`
    : `${ios_url}/inventory`;

// notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function InventoryScreen({ navigation }) {
  // context
  const { user } = useAuth();

  // state for displaying inventory
  const [displayInventory, setDisplayInventory] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // error state

  // track the current sort
  const [sortCriteria, setSortCriteria] = useState("default");

  // handle sort change
  const handleSortChange = (newCriteria) => {
    setSortCriteria(newCriteria); // Update the state for future reference
    fetchInventory(newCriteria); // Pass the new criteria directly
  };

  // display inventory by certain user
  const fetchInventory = async (criteria = sortCriteria) => {
    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken();

        const response = await axios.get(connection, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let inventoryData = response.data.inventory;

        // Apply sorting based on the provided criteria
        if (criteria === "ascend") {
          inventoryData.sort((a, b) =>
            a.medicine_name.localeCompare(b.medicine_name)
          );
        } else if (criteria === "descend") {
          inventoryData.sort((a, b) =>
            b.medicine_name.localeCompare(a.medicine_name)
          );
        } else if (criteria === "expDate") {
          inventoryData.sort(
            (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date)
          );
        }

        setDisplayInventory(inventoryData);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // auto re-fetch
  useFocusEffect(
    useCallback(() => {
      fetchInventory();
    }, [user])
  );

  // configure Push Notifications, ask them to allow the notification.

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
    <View style={styles.root}>
      <View style={styles.dataContainer}>
        <Label
          onPress={() => {
            navigation.navigate("AddMedicine");
          }}
        >
          Medicine Inventory
        </Label>

        <SortingContainer onSortChange={handleSortChange} />

        {error ? (
          <View style={styles.error}>
            <ErrorComponent message={error} />
          </View>
        ) : isLoading ? (
          <LoadingInventory />
        ) : displayInventory && displayInventory.length > 0 ? (
          <FlatList
            overScrollMode="never"
            bounces={false}
            data={displayInventory}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <ListInventory itemData={item} />}
            numColumns={1}
            key={1}
          />
        ) : (
          <View style={styles.isEmpty}>
            <IsEmpty
              image={EmptyImage}
              message={"You haven’t added any medicine yet"}
            />
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

  dataContainer: {
    marginTop: 54,
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
