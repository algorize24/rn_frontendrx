import {
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useLayoutEffect } from "react";

// constants
import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

// components
import MainButton from "../../../components/buttons/MainButton";
import TextScreen from "../../../components/header/TextScreen";
import TextInputs from "../../../components/Inputs/TextInputs";
import InputText from "../../../components/header/InputText";
import LoadingModal from "../../../components/loading/LoadingModal";

// date & time picker expo
import DateTimePicker from "@react-native-community/datetimepicker";

// axios
import axios from "axios";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android"
    ? `${android_url}/inventory/`
    : `${ios_url}/inventory/`;

export default function EditInventory({ navigation, route }) {
  // this data is from ListInventory.jsx
  const _id = route.params.medicineId;
  const initialMedicineName = route.params.medicine;
  const initialDosage = route.params.dosage;
  const initialExpirationDate = route.params.expiration_date;
  const initialStock = route.params.stock;

  // state to edit
  const [medicineName, setMedicineName] = useState(initialMedicineName);
  const [dosage, setDosage] = useState(initialDosage.toString());
  const [expirationDate, setExpirationDate] = useState(
    initialExpirationDate ? new Date(initialExpirationDate) : null
  );
  const [stock, setStock] = useState(initialStock.toString());

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(""); // error state
  const [showDatePicker, setShowDatePicker] = useState(false); // showDatePicker state

  // edit inventory fn
  const handleEditInventory = async () => {
    setIsLoading(true);

    try {
      // check if inputs are empty
      if (!medicineName || !dosage || !expirationDate || !stock) {
        setError("Please ensure that all fields are completed.");
        return;
      }

      // request to the backend
      await axios.patch(`${connection}${_id}`, {
        // these are the data i want to edit
        medicine_name: medicineName,
        dosage,
        expiration_date: expirationDate.toISOString(),
        stock,
      });

      // show alert message
      Alert.alert(
        "Inventory Updated",
        `The ${medicineName} inventory details were updated successfully`
      );
      // after, go to..
      navigation.navigate("Inventory");
    } catch (error) {
      // if there's an error
      setError(
        `Failed to update ${medicineName} inventory. Please try again later.`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // delete inventory fn
  const handleDeleteInventory = () => {
    // show confirmation dialog
    Alert.alert(
      `Delete ${medicineName}`,
      "Are you sure you want to delete this medicine? This action cannot be undone.",
      [
        {
          // cancel
          text: "Cancel",
          style: "cancel",
        },
        {
          // yes
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);

            try {
              // request to the backend
              await axios.delete(`${connection}${_id}`);

              // show an alert message after deleting
              Alert.alert(
                "Inventory Deleted",
                `The ${medicineName} inventory was deleted successfully`
              );

              // go to this screen
              navigation.navigate("Inventory");
            } catch (error) {
              // if there's an error
              setError(
                `Failed to delete the ${medicineName} inventory. Please try again later.`,
                error
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // show and update the date
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the picker once a date is selected
    if (selectedDate) {
      setExpirationDate(selectedDate); // Update the expiration date
    }
  };

  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleEditInventory}>
          <Text style={styles.header_right}>Update</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleEditInventory]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}

        <View>
          <View style={styles.textContainer}>
            <TextScreen style={styles.textScreen}>
              # <Text style={styles.name}>{medicineName || ""}</Text>
            </TextScreen>
          </View>

          <InputText style={styles.input}>Medicine name</InputText>
          <TextInputs
            style={styles.textInput}
            placeholder={"Medicine Name"}
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <InputText style={styles.input}>Dosage</InputText>
          <TextInputs
            inputMode={"numeric"}
            keyboardType={"numeric"}
            style={styles.textInput}
            placeholder={"Dosage"}
            maxLength={3}
            value={dosage}
            onChangeText={setDosage}
          />

          <InputText style={styles.input}>Quantity</InputText>
          <TextInputs
            inputMode={"numeric"}
            keyboardType={"numeric"}
            style={styles.textInput}
            placeholder={"Stock"}
            maxLength={3}
            value={stock}
            onChangeText={setStock}
          />

          <InputText style={styles.input}>Expiration date</InputText>
          <Pressable
            style={[styles.textInput, styles.selectExpirationDate]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.textSelect}>Tap to Select a Date</Text>
          </Pressable>

          {expirationDate && (
            <TextInputs
              style={[styles.selectedDate, styles.textInput]}
              editable={false}
              placeholder={`Selected Date: ${expirationDate.toDateString()}`}
              placeholderTextColor={Color.tagLine}
            />
          )}

          {showDatePicker && (
            <DateTimePicker
              value={expirationDate || new Date()} // Default to current date if none selected
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              style={{
                backgroundColor: Color.container,
                borderRadius: 10,
                color: "#fff",
              }}
            />
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.button_container}>
          <MainButton
            onPress={handleDeleteInventory}
            style={isLoading ? styles.loading_state : styles.deleteButton}
          >
            {isLoading ? "Deleting Contact..." : "Delete Contact"}
          </MainButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 18,
  },

  textContainer: {
    marginTop: 49,
    marginBottom: 20,
    alignItems: "flex-start",
  },

  textInput: {
    backgroundColor: Color.container,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    color: "#fff",
  },

  input: {
    color: Color.tagLine,
    marginBottom: 10,
  },

  button_container: {
    marginTop: 20,
  },

  name: {
    color: Color.greenColor,
  },

  textScreen: {
    color: Color.tagLine,
  },

  selectedDate: {
    opacity: 0.7,
  },

  textSelect: {
    fontFamily: Fonts.main,
    color: "#fff",
  },

  selectExpirationDate: {
    padding: 10,
  },

  errorText: {
    color: Color.redColor,
    fontFamily: Fonts.main,
    fontSize: 13,
    marginVertical: 10,
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },

  deleteButton: {
    backgroundColor: Color.redColor,
  },

  loading_state: {
    opacity: 0.5,
    backgroundColor: Color.redColor,
  },
});
