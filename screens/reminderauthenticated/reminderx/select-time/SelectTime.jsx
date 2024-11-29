import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLayoutEffect, useState } from "react";

// constants
import { Color } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Font";

// component
import AuthText from "../../../../components/header/AuthText";
import MainButton from "../../../../components/buttons/MainButton";

// context
import { useReminder } from "../../../../context/reminderContext";

// date & time picker expo
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SelectTime({ navigation }) {
  const { medicationName, setReminderTime, frequency } = useReminder();

  const [time, setTime] = useState([new Date(), new Date(), new Date()]);
  const [show, setShow] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);

  const handleTime = () => {
    const filteredTimes =
      frequency === "Once a day"
        ? [time[0]]
        : frequency === "Twice a day"
        ? time.slice(0, 2)
        : time;
    setReminderTime(filteredTimes);
    navigation.navigate("AddPills");
  };

  const handleTimeChange = (event, selectedDate) => {
    if (event.type === "set") {
      const updatedTime = [...time];
      updatedTime[timeIndex] = selectedDate || time[timeIndex];
      setTime(updatedTime);
    }
    setShow(false);
  };

  const handleSwitchTime = () => {
    if (frequency === "Twice a day") {
      setTimeIndex((prevIndex) => (prevIndex === 0 ? 1 : 0)); // Toggle between Dose 1 and Dose 2
    } else if (frequency === "3 times a day") {
      setTimeIndex((prevIndex) => (prevIndex + 1) % 3); // Cycle through 0, 1, 2
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.title}>{medicationName}</Text>,
      headerRight: () => (
        <Pressable onPress={handleTime}>
          <Text style={styles.header_right}>Next</Text>
        </Pressable>
      ),
    });
  }, [navigation, medicationName, handleTime]);

  return (
    <View style={styles.root}>
      <AuthText style={styles.text}>
        When do you need to take the dose?
      </AuthText>

      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Pressable onPress={() => setShow(true)}>
            <Text style={styles.selectTime}>
              Set the time for your {["first", "second", "third"][timeIndex]}{" "}
              dose reminder
            </Text>
          </Pressable>

          {show && (
            <DateTimePicker
              value={time[timeIndex]} // ensure this is a valid Date object
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={handleTimeChange}
              onTouchCancel={() => setShow(false)}
            />
          )}
        </View>

        {frequency === "Twice a day" && timeIndex === 0 && (
          <View style={styles.buttonView}>
            <MainButton onPress={handleSwitchTime} style={styles.setButton}>
              Pick time for Dose 2
            </MainButton>
          </View>
        )}

        {frequency === "3 times a day" && timeIndex < 2 && (
          <View style={styles.buttonView}>
            <MainButton onPress={handleSwitchTime} style={styles.setButton}>
              Pick time for Dose {timeIndex + 2}
            </MainButton>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  title: {
    fontFamily: Fonts.main,
    textTransform: "capitalize",
    color: "#fff",
    fontSize: 14,
  },

  text: {
    textTransform: "none",
    marginHorizontal: 18,
    marginBottom: 20,
    marginTop: 50,
    fontSize: 20,
    width: 320,
  },

  container: {
    flex: 1,
    backgroundColor: Color.container,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  subContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 30,
    justifyContent: "center",
  },

  selectTime: {
    fontSize: 15,
    color: "#fff",
    fontFamily: Fonts.main,
    backgroundColor: Color.textInput,
    padding: 10,
    borderRadius: 6,
    textAlign: "center",
  },

  setButton: {
    width: "90%",
    backgroundColor: Color.textInput,
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },
});
