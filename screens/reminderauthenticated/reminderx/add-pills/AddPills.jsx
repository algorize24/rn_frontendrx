import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useLayoutEffect, useState } from "react";

// constants
import { Color } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Font";

// components
import MainButton from "../../../../components/buttons/MainButton";
import TextInputs from "../../../../components/Inputs/TextInputs";
import AuthText from "../../../../components/header/AuthText";

// context
import { useReminder } from "../../../../context/reminderContext";

export default function AddPills({ navigation }) {
  const { medicationName, frequency, updateDosages, reminderTime } =
    useReminder();

  // Format reminder time as a string (example: "12:30 PM")
  const formattedReminderTimes = reminderTime.map((time) =>
    time instanceof Date
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "No time set"
  );

  const frequencyMap = {
    "Once a day": 1,
    "Twice a day": 2,
    "3 times a day": 3,
  };

  const [pillCounts, setPillCounts] = useState(
    Array(frequencyMap[frequency] || 1).fill("1")
  );

  const handlePillCountChange = (index, value) => {
    const updatedPillCounts = [...pillCounts];
    updatedPillCounts[index] = value;
    setPillCounts(updatedPillCounts);
  };

  const handleAddPills = () => {
    // Combine reminder times and dosages into an array of objects
    const reminderData = reminderTime.map((time, index) => ({
      time: time.toISOString(),
      dosage: pillCounts[index], // Corresponding dosage for each time
    }));

    // Save to context
    updateDosages(reminderData); // Update with time and dosage pairs
    navigation.navigate("SetReminder");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.title}>{medicationName && medicationName}</Text>
      ),
      headerRight: () => (
        <Pressable onPress={handleAddPills}>
          <Text style={styles.header_right}>Set</Text>
        </Pressable>
      ),
    });
  }, [navigation, medicationName, handleAddPills]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        <AuthText style={styles.text}>How many pill(s) do you take?</AuthText>

        <View style={styles.container}>
          <View style={styles.subContainer}>
            {pillCounts.map((pillCount, index) => (
              <View style={styles.inputView} key={index}>
                <Text style={styles.time}>{formattedReminderTimes[index]}</Text>
                <TextInputs
                  style={styles.input}
                  maxLength={2}
                  keyboardType={"numeric"}
                  value={pillCount}
                  onChangeText={(value) => handlePillCountChange(index, value)}
                />
                <Text style={styles.pills}>Pill(s)</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    marginTop: 50,
    marginHorizontal: 30,
  },

  note: {
    fontFamily: Fonts.main,
    color: "#fff",
  },

  inputView: {
    margin: "auto",
    width: "50%",
    marginVertical: 30,
  },

  input: {
    backgroundColor: Color.bgColor,
    borderRadius: 8,
    color: "#fff",
    width: "screen",
    textAlign: "center",
    marginVertical: 10,
  },

  time: {
    textAlign: "center",
    fontFamily: Fonts.main,
    fontSize: 15,
    color: "#fff",
  },

  pills: {
    textAlign: "center",
    fontFamily: Fonts.main,
    fontSize: 15,
    color: Color.tagLine,
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },
});
