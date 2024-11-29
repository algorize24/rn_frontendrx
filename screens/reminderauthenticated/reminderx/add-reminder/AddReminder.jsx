import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useState, useLayoutEffect } from "react";

// component
import MainButton from "../../../../components/buttons/MainButton";
import TextInputs from "../../../../components/Inputs/TextInputs";
import AuthText from "../../../../components/header/AuthText";

// constants
import { Color } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Font";

// context
import { useReminder } from "../../../../context/reminderContext";

export default function AddReminder({ navigation }) {
  // from ReminderContext
  const { medicationName, setMedicationName } = useReminder();

  // state for inputs
  const [medName, setMedName] = useState(medicationName);

  // error state
  const [error, setError] = useState("");

  // fn for MainButton
  const handleMedicationName = () => {
    // reset the error
    setError("");

    // check if medName is not empty or whitespace
    if (medName.trim()) {
      setMedicationName(medName);
      navigation.navigate("OftenTake");

      // reset the field
      setMedName("");
    } else {
      setError("Medication name cannot be empty.");
    }
  };

  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleMedicationName}>
          <Text style={styles.header_right}>Next</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleMedicationName]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        <AuthText style={styles.text}>
          What medicine would you like to add?
        </AuthText>

        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.medText}>Type your medication name</Text>

            <TextInputs
              style={styles.inputs}
              placeholder={error || "e.g., Paracetamol"}
              placeholderTextColor={error ? Color.redColor : "#fff"} // Red color for error
              value={medName}
              onChangeText={(text) => setMedName(text)}
            />
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
    marginTop: 30,
    marginHorizontal: 20,
  },

  medText: {
    fontFamily: Fonts.main,
    color: "#fff",
  },

  inputs: {
    backgroundColor: Color.bgColor,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    color: "#fff",
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },
});
