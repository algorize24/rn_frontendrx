import {
  View,
  StyleSheet,
  Text,
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
import MainButton from "../../../components/buttons/MainButton";
import TextInputs from "../../../components/Inputs/TextInputs";
import TextScreen from "../../../components/header/TextScreen";
import InputText from "../../../components/header/InputText";
import LoadingModal from "../../../components/loading/LoadingModal";

// axios
import axios from "axios";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android" ? `${android_url}/contact` : `${ios_url}/contact`;

export default function EditContact({ navigation, route }) {
  // this data is from ListContact.jsx
  const _id = route.params.contactId;
  const initialName = route.params.name;
  const initialPhoneNumber = route.params.number;

  // state to edit
  const [name, setName] = useState(initialName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber.toString());

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // error state
  const [error, setError] = useState("");

  // Handler to edit contact
  const handleEditingContact = async () => {
    setIsLoading(true);

    try {
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

      // send the updated data to the backend
      await axios.patch(`${connection}/${_id}`, {
        name,
        phone_number: phoneNumber,
      });

      // on success, navigate back to the contact list
      Alert.alert(
        "Contact Updated",
        "The contact details were updated successfully."
      );
      navigation.navigate("Contact");
    } catch (error) {
      setError("Failed to update contact. Please try again later", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDeletingContact = () => {
    // Show confirmation dialog
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true); // Set loading state to true when the button is pressed

            try {
              // Send DELETE request to the backend
              await axios.delete(`${connection}/${_id}`);

              // On success, navigate back to the contact list
              Alert.alert(
                "Contact deleted",
                "The contact was deleted successfully."
              );
              navigation.navigate("Contact");
            } catch (error) {
              setError(
                "Failed to delete the contact. Please try again later",
                error
              );
            } finally {
              setIsLoading(false); // Reset loading state
            }
          },
        },
      ],
      { cancelable: true } // allows the alert to be dismissed by tapping outside
    );
  };

  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleEditingContact}>
          <Text style={styles.header_right}>Update</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleEditingContact]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}

        <View style={styles.textContainer}>
          <TextScreen style={styles.textScreen}>
            # <Text style={styles.name}>{name || ""}</Text>
          </TextScreen>
        </View>

        <InputText style={styles.input}>Name</InputText>
        <TextInputs
          style={styles.textInput}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <InputText style={styles.input}>Phone number</InputText>
        <TextInputs
          keyboardType="numeric"
          style={styles.textInput}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={11}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.button_container}>
          <MainButton
            onPress={handleDeletingContact}
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
    alignItems: "flex-start",
    marginTop: 50,
    marginBottom: 20,
  },

  textInput: {
    backgroundColor: Color.container,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    color: "#fff",
  },

  button_container: {
    marginTop: 20,
  },

  deleteButton: {
    backgroundColor: Color.redColor,
  },

  loading_state: {
    opacity: 0.5,
    backgroundColor: Color.redColor,
  },

  name: {
    color: Color.greenColor,
    textTransform: "capitalize",
  },

  textScreen: {
    color: Color.tagLine,
    textTransform: "capitalize",
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

  input: {
    color: Color.tagLine,
    marginBottom: 10,
  },
});
