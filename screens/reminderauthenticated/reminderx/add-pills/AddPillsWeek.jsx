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

export default function AddPillsWeek({ navigation, route }) {
  const { medicationName, updateDosages } = useReminder();
  const { specificDay, selectedTime } = route.params; // Get specific day and time

  const [pillCount, setPillCount] = useState("1"); // Default pill count

  const handleAddPills = () => {
    const reminderData = {
      day: specificDay,
      time: selectedTime, // Pass the time from `route.params`
      dosage: Number(pillCount), // Ensure dosage is a number
    };

    updateDosages((prevDosages) => {
      if (Array.isArray(prevDosages)) {
        return [...prevDosages, reminderData];
      }
      return [reminderData];
    });

    navigation.navigate("SetReminder");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.title}>{medicationName}</Text>,
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
        <AuthText style={styles.text}>
          How many pill(s) do you take on {specificDay} at{" "}
          {new Date(selectedTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // This ensures 12-hour format with AM/PM
          })}
          ?
        </AuthText>

        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInputs
              style={styles.input}
              maxLength={2}
              keyboardType={"numeric"}
              value={pillCount}
              onChangeText={(value) => setPillCount(value)}
            />
            <Text style={styles.pills}>Pill(s)</Text>
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
