import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useState, useLayoutEffect } from "react";

// constants
import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

// components
import InputText from "../../../components/header/InputText";
import TextInputs from "../../../components/Inputs/TextInputs";
import LoadingModal from "../../../components/loading/LoadingModal";

// firebase
import { auth } from "../../../firebase/firebase";

// axios
import axios from "axios";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android"
    ? `${android_url}/doctor/createdoctor`
    : `${ios_url}/doctor/createdoctor`;

export default function AddDoctor({ navigation }) {
  // state to add a doctor
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error state

  // fn to add doctor
  const handleAddDoctor = async () => {
    setIsLoading(true);

    try {
      // get the currentUser
      const currentUser = auth.currentUser;

      // if there's a currentUser
      if (currentUser) {
        // check if inputs are empty
        if (!name || !specialty || !email || !number || !address) {
          setError("Please complete all fields. Thank you!");
          return;
        }

        // check if phone number contain 11 digits
        if (number.length < 11) {
          setError("The phone number must contain 11 digits.");
          setIsLoading(false);
          return;
        }

        // check if the email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          setError("Please enter a valid email address.");
          setIsLoading(false);
          return;
        }

        // get the token
        const token = await currentUser.getIdToken();

        // create an object to send to database
        const doctorData = {
          doctor_name: name,
          specialty,
          email,
          mobile_number: number,
          address,
        };

        // request to the backend together with object we created
        const response = await axios.post(connection, doctorData, {
          headers: {
            // send the token to backend for verification
            Authorization: `Bearer ${token}`,
          },
        });

        // if successfully created
        if (response.status === 201) {
          Alert.alert("Doctor Created", "New Doctor created successfully");

          // clear the input fields
          setName("");
          setSpecialty("");
          setEmail("");
          setNumber("");
          setAddress("");

          // after that, go to this screen.
          navigation.navigate("Doctor");
        }
      }
    } catch (error) {
      setError("Failed to create a Doctor.", error);
    } finally {
      setIsLoading(false);
    }
  };

  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleAddDoctor}>
          <Text style={styles.header_right}>Save</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleAddDoctor]);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}

        <View style={styles.inputContainer}>
          <InputText style={styles.input}>Name</InputText>
          <TextInputs
            style={styles.inputText}
            placeholder={"e.g., Juan Dela Cruz"}
            value={name}
            onChangeText={setName}
            placeholderTextColor={"#fff"}
          />

          <InputText style={styles.input}>Specialty</InputText>
          <TextInputs
            style={styles.inputText}
            placeholder={"e.g., neurologist "}
            value={specialty}
            onChangeText={setSpecialty}
            placeholderTextColor={"#fff"}
          />

          <InputText style={styles.input}>Email Address</InputText>
          <TextInputs
            style={styles.inputText}
            placeholder={"e.g., juandelacruz@gmail.com"}
            value={email}
            onChangeText={setEmail}
            keyboardType={"email-address"}
            placeholderTextColor={"#fff"}
          />

          <InputText style={styles.input}>Phone number</InputText>
          <TextInputs
            style={styles.inputText}
            placeholder={"e.g., 0912-345-6789"}
            value={number}
            onChangeText={setNumber}
            keyboardType={"numeric"}
            maxLength={11}
            placeholderTextColor={"#fff"}
          />

          <InputText style={styles.input}>Hospital address</InputText>
          <TextInputs
            style={styles.inputText}
            placeholder={"e.g., Mandaluyong City "}
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={"#fff"}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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

  inputContainer: {
    marginTop: 50,
  },

  inputText: {
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
