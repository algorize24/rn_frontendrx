import { View, StyleSheet, FlatList, Platform, Alert } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";

// image empty
import EmptyImage from "../../assets/others/reminder.png";

// constants
import { Color } from "../../constants/Color";

// component
import CalendarList from "../../components/dashboard/CalendarList";
import MainButton from "../../components/buttons/MainButton";
import ReminderContainer from "../../components/dashboard/ReminderContainer";
import IsEmpty from "../../components/dashboard/isEmpty";
import ErrorComponent from "../../components/dashboard/ErrorComponent";
import LoadingReminder from "../../components/loading/LoadingReminder";

// axios
import axios from "axios";

// auth context
import { useAuth } from "../../context/authContext";

// firebase
import { auth } from "../../firebase/firebase";

// moment
import moment from "moment";

// connection of android and ios
import { android_url, ios_url } from "../../constants/Url";

// notification
import * as Notifications from "expo-notifications";

// import Calendar for calendar access
import * as Calendar from "expo-calendar";

// connection path
const connection =
  Platform.OS === "android" ? `${android_url}/reminder` : `${ios_url}/reminder`;

// notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ReminderScreen({ navigation }) {
  // context
  const { user } = useAuth();

  // state for displaying reminder
  const [displayReminder, setDisplayReminder] = useState([]);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // error state
  const [error, setError] = useState("");

  // track the reminders if its alr updated
  const [remindersUpdated, setRemindersUpdated] = useState(false);

  // track the reminder added in calendar
  const [addedReminders, setAddedReminders] = useState(new Set());

  // state to select a date in calendar
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // add the reminder we created to built in calendar
  const addReminderToCalendar = async (reminder) => {
    try {
      const reminderId = `${reminder.medicineName}-${reminder.time}`;
      if (addedReminders.has(reminderId)) {
        return; // skip if reminder has already been added
      }

      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log("Available Calendars:", calendars);

        if (!calendars || calendars.length === 0) {
          throw new Error("No calendars found on this device.");
        }

        const editableCalendar = calendars.find(
          (calendar) => calendar.allowsModifications
        );

        if (!editableCalendar) {
          throw new Error("No editable calendar found.");
        }

        const reminderTime = reminder.time ? new Date(reminder.time) : null;
        if (!reminderTime || isNaN(reminderTime.getTime())) {
          throw new Error("Invalid time format.");
        }

        // access dosage properly from the nested object
        const dosage = reminder.dosage.dosage || 0;

        const startDate = reminderTime;
        const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minute event duration

        // if `specificDays` is empty, add reminder for the rest of the week
        const specificDays = reminder.specificDays.length
          ? reminder.specificDays
          : [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ];
        const today = new Date();
        const dayOfWeek = today.getDay(); // Get the current day (0-6, Sunday-Saturday)

        // use a `for` loop to await asynchronous operations
        for (const day of specificDays) {
          const dayIndex = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].indexOf(day);
          const daysToAdd = (dayIndex - dayOfWeek + 7) % 7; // Calculate days from today to the target day
          const eventDate = new Date(
            today.getTime() + daysToAdd * 24 * 60 * 60 * 1000
          ); // Add the days to today

          const eventStartDate = new Date(
            eventDate.setHours(
              startDate.getHours(),
              startDate.getMinutes(),
              startDate.getSeconds()
            )
          );
          const eventEndDate = new Date(eventStartDate.getTime() + 30 * 60000); // Event duration of 30 minutes

          // Create the event in the calendar and wait for it to complete
          await Calendar.createEventAsync(editableCalendar.id, {
            title: reminder.medicineName,
            startDate: eventStartDate,
            endDate: eventEndDate,
            notes: `Dosage: ${dosage}`,
            alarms: [
              { relativeOffset: -10, method: Calendar.AlarmMethod.ALERT },
            ],
          });
        }

        // add reminderId to the set to prevent future additions
        setAddedReminders(
          (prevAddedReminders) => new Set(prevAddedReminders.add(reminderId))
        );
      } else {
        Alert.alert("Permission Denied", "Calendar access is required.");
      }
    } catch (error) {
      setError("Error adding event to calendar:", error);
    }
  };

  // fetch all the data from reminder collection, also specified by day.
  const fetchReminder = async () => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken();
        const response = await axios.get(connection, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const selectedDay = moment(selectedDate).format("dddd");

        const filteredReminders = response.data.reminder.filter((reminder) => {
          if (reminder.specificDays.length === 0) {
            return true; // No specific days, so show every day
          }
          return reminder.specificDays.includes(selectedDay); // only include the selected day if in specificDays
        });

        const flattenedReminders = filteredReminders
          .flatMap((reminder) => {
            const reminderTimes =
              Array.isArray(reminder.times) && reminder.times.length > 0
                ? reminder.times
                : [reminder.time];

            return reminderTimes.map((time, index) => ({
              _id: reminder._id, // Ensure the _id is included
              time: new Date(time),
              medicineName: reminder.medicineName,
              dosage: reminder.dosage[index] || 0,
              specificDays: reminder.specificDays, // Add specificDays here
            }));
          })
          .sort((a, b) => a.time - b.time);

        // Add each reminder to the calendar
        flattenedReminders.forEach((reminder) => {
          if (reminder.time) {
            addReminderToCalendar(reminder);
          }
        });

        setDisplayReminder(flattenedReminders);
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
      fetchReminder();
    }, [user, selectedDate, remindersUpdated])
  );

  // configure push Notifications, ask them to allow the notification.
  useEffect(() => {
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

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    configurePushNotification();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <CalendarList
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {error ? (
          <View style={styles.error}>
            <ErrorComponent message={error} />
          </View>
        ) : isLoading ? (
          <LoadingReminder />
        ) : displayReminder && displayReminder.length > 0 ? (
          <FlatList
            alwaysBounceVertical={false}
            bounces={false}
            overScrollMode="never"
            data={displayReminder}
            keyExtractor={(item, index) =>
              `${item.time}-${item.medicineName}-${index}`
            }
            renderItem={({ item }) => (
              <ReminderContainer
                itemData={item}
                setRemindersUpdated={setRemindersUpdated}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.empty}>
            <IsEmpty
              image={EmptyImage}
              message={"No upcoming reminders for today"}
            />
          </View>
        )}
      </View>

      <MainButton
        onPress={() => navigation.navigate("AddReminder")}
        style={styles.button}
      >
        Add Reminder
      </MainButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.bgColor,
    paddingHorizontal: 18,
    justifyContent: "space-between",
  },

  container: {
    flex: 1,
  },

  textContainer: {
    marginTop: 20,
  },

  dataContainer: {
    marginTop: 54,
    flex: 1,
    marginBottom: 20,
  },

  button: {
    marginTop: 30,
    marginBottom: 40,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
  },

  error: {
    flex: 1,
    justifyContent: "center",
  },
});
