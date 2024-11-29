import {
  View,
  StyleSheet,
  Alert,
  Pressable,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useLayoutEffect } from "react";

// constants
import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

// components
import TextScreen from "../../../components/header/TextScreen";
import TextInputs from "../../../components/Inputs/TextInputs";
import InputText from "../../../components/header/InputText";
import LoadingModal from "../../../components/loading/LoadingModal";

// date & time picker expo
import DateTimePicker from "@react-native-community/datetimepicker";

// axios
import axios from "axios";

// firebase
import { auth } from "../../../firebase/firebase";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android"
    ? `${android_url}/inventory/createinventory`
    : `${ios_url}/inventory/createinventory`;

export default function AddMedicine({ navigation }) {
  // states to add a inventory
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [stock, setStock] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false); // showDatePicker state
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error state

  const handleAddMedicine = async () => {
    setIsLoading(true);

    try {
      // get the currentUser
      const currentUser = auth.currentUser;

      // if there's a currentUser
      if (currentUser) {
        // get the token
        const token = await currentUser.getIdToken();

        // check if inputs are empty
        if (!medicineName || !dosage || !expirationDate || !stock) {
          setError("Please ensure that all fields are completed.");
          return;
        }

        // create an object to send to database
        const inventoryData = {
          medicine_name: medicineName,
          dosage,
          expiration_date: expirationDate.toISOString(),
          stock,
        };

        // request to the backend together with object we created
        const response = await axios.post(
          // "http://10.0.2.2:5000/api/inventory/createinventory",
          connection,
          inventoryData,
          {
            headers: {
              // send the token to backend for verification
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if successfully created
        if (response.status === 201) {
          Alert.alert(
            "Inventory Created",
            "New inventory created successfully"
          );

          // clear the input fields
          setMedicineName("");
          setDosage("");
          setExpirationDate("");
          setStock("");

          // after that, go to this screen.
          navigation.navigate("Inventory");
        }
      }
    } catch (error) {
      setError("Failed to create an inventory.", error);
    } finally {
      setIsLoading(false);
    }
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
        <Pressable onPress={handleAddMedicine}>
          <Text style={styles.header_right}>Save</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleAddMedicine]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}
        <TextScreen style={styles.text_style}>Add Medicine</TextScreen>

        <InputText style={styles.input}>Medicine name</InputText>
        <TextInputs
          style={styles.textInput}
          placeholder={"e.g., paracetamol"}
          value={medicineName}
          onChangeText={setMedicineName}
          placeholderTextColor={"#fff"}
        />

        <InputText style={styles.input}>Dosage</InputText>

        <TextInputs
          inputMode={"numeric"}
          keyboardType={"numeric"}
          style={styles.textInput}
          placeholder={"e.g., 100mg"}
          maxLength={3}
          value={dosage}
          onChangeText={setDosage}
          placeholderTextColor={"#fff"}
        />

        <InputText style={styles.input}>Quantity</InputText>
        <TextInputs
          inputMode={"numeric"}
          keyboardType={"numeric"}
          style={styles.textInput}
          placeholder={"e.g, 10 "}
          maxLength={3}
          value={stock}
          onChangeText={setStock}
          placeholderTextColor={"#fff"}
        />

        <InputText style={styles.input}>Expiration date</InputText>
        <Pressable
          style={[styles.textInput, styles.selectExpirationDate]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.textSelect}>
            Tap to select an expiration date
          </Text>
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 18,
  },

  text_style: {
    textAlign: "left",
    marginTop: 50,
    marginBottom: 30,
  },

  textInput: {
    backgroundColor: Color.container,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    color: "#fff",
  },

  input: {
    color: Color.tagLine,
    marginBottom: 10,
  },

  selectExpirationDate: {
    padding: 10,
  },

  textSelect: {
    fontFamily: Fonts.main,
    color: "#fff",
  },

  selectedDate: {
    opacity: 0.7,
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
});
