import {
  View,
  StyleSheet,
  Alert,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useLayoutEffect, useState } from "react";

// constants
import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

// components
import TextInputs from "../../../components/Inputs/TextInputs";
import TextScreen from "../../../components/header/TextScreen";
import InputText from "../../../components/header/InputText";
import LoadingModal from "../../../components/loading/LoadingModal";

// axios
import axios from "axios";

// firebase
import { auth } from "../../../firebase/firebase";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android"
    ? `${android_url}/contact/createcontact`
    : `${ios_url}/contact/createcontact`;

export default function AddContact({ navigation }) {
  // state to add a contact
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false); // loading state for main button

  // error state
  const [error, setError] = useState("");

  // function to create a contact
  const handleAddContact = async () => {
    // set the loading to true
    setIsLoading(true);

    try {
      // get the currentUser
      const currentUser = auth.currentUser;

      // if currentUser
      if (currentUser) {
        // check if inputs are empty
        if (!name || !phoneNumber) {
          setError("Please complete all fields. Thank you!");
          return;
        }

        // Validate other fields
        if (!name) {
          setError("Please ensure the name field is filled out.");
          setIsLoading(false); // Stop loading if validation fails
          return; // Prevent further execution
        }

        // check if phone number contain 11 digits
        if (phoneNumber.length < 11) {
          setError("The phone number must contain 11 digits.");
          setIsLoading(false);
          return;
        }

        // get the token to pass in the backend
        const token = await currentUser.getIdToken();

        // contactData structure this is what we send in backend
        const contactData = {
          name,
          phone_number: phoneNumber,
        };

        // post request to this api
        const response = await axios.post(connection, contactData, {
          headers: {
            Authorization: `Bearer ${token}`, // header authorization to create a contact
          },
        });

        // handle successful response
        if (response.status === 201) {
          Alert.alert("Contact Created", "New contact created successfully!");

          // reset the form
          setName("");
          setPhoneNumber("");

          // go to...
          navigation.navigate("Contact");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleAddContact}>
          <Text style={styles.header_right}>Save</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleAddContact]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}

        <TextScreen style={styles.text_style}>Add Contact</TextScreen>

        <InputText style={styles.input}>Name</InputText>
        <TextInputs
          style={styles.textInput}
          placeholder={"e.g., Juan Dela Cruz"}
          value={name}
          onChangeText={setName}
          placeholderTextColor={"#fff"}
        />
        <InputText style={styles.input}>Phone number</InputText>
        <TextInputs
          style={styles.textInput}
          placeholder="e.g., 0912-345-6789"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="number-pad"
          maxLength={11}
          placeholderTextColor={"#fff"}
        />
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

  inputContainer: {
    marginTop: 49,
  },

  input: {
    color: Color.tagLine,
    marginBottom: 10,
  },

  textInput: {
    backgroundColor: Color.container,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    color: "#fff",
  },

  errorText: {
    color: Color.redColor,
    fontFamily: Fonts.main,
    fontSize: 13,
    marginTop: 10,
    marginBottom: 20,
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },
});
