import {
  View,
  Text,
  StyleSheet,
  Image,
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
import MainButton from "../../../components/buttons/MainButton";
import LoadingModal from "../../../components/loading/LoadingModal";

// axios
import axios from "axios";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android" ? `${android_url}/doctor` : `${ios_url}/doctor`;

export default function EditDoctors({ navigation, route }) {
  // this data is from ListDoctor.jsx
  const id = route.params.doctorId;
  const initialName = route.params.name;
  const initialSpecialty = route.params.specialty;
  const initialEmail = route.params.email;
  const initialNumber = route.params.number;
  const initialAddress = route.params.address;

  // state to add a doctor
  const [name, setName] = useState(initialName);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [email, setEmail] = useState(initialEmail);
  const [number, setNumber] = useState(initialNumber.toString());
  const [address, setAddress] = useState(initialAddress);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // error state
  const [error, setError] = useState("");

  // edit fn
  const handleEditDoctor = async () => {
    setIsLoading(true);

    try {
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

      // request to the backend
      await axios.patch(`${connection}/${id}`, {
        // these are the data i want to edit
        doctor_name: name,
        specialty,
        email,
        mobile_number: number,
        address,
      });

      // show alert message
      Alert.alert(
        "Doctor's Updated",
        `Dr.${name} details were updated successfully.`
      );

      // after go to..
      navigation.navigate("Doctor");
    } catch (error) {
      // if there's an error
      setError(
        `Failed to update Dr.${name} details. Please try again later.`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // delete fn
  const handleDeleteDoctor = async () => {
    // show confirmation dialog
    Alert.alert(
      `Delete Dr.${name}`,
      "Are you sure you want to delete this doctor details? This action cannot be undone.",
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
              await axios.delete(`${connection}/${id}`);

              // show an alert message after deleting
              Alert.alert(
                "Doctor's Deleted",
                `Dr.${name} details was deleted successfully`
              );

              // go to this screen
              navigation.navigate("Doctor");
            } catch (error) {
              // if there's an error
              setError(
                `Failed to delete the Dr.${name} details. Please try again later.`,
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

  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleEditDoctor}>
          <Text style={styles.header_right}>Update</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleEditDoctor]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}

        <View style={styles.doctorView}>
          <View>
            <Image
              style={styles.img}
              source={require("../../../assets/others/user-avatar.png")}
            />
          </View>

          <View style={styles.dataView}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.specialty}>{specialty}</Text>
          </View>
        </View>
        <InputText style={styles.input}>Name</InputText>
        <TextInputs
          style={styles.inputText}
          placeholder={"Doctor's Name"}
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
          placeholder={"Doctor's email"}
          value={email}
          onChangeText={setEmail}
          keyboardType={"email-address"}
          placeholderTextColor={"#fff"}
        />

        <InputText style={styles.input}>Phone number</InputText>
        <TextInputs
          style={styles.inputText}
          placeholder={"Doctor's number"}
          value={number}
          onChangeText={setNumber}
          keyboardType={"numeric"}
          maxLength={11}
          placeholderTextColor={"#fff"}
        />

        <InputText style={styles.input}>Hospital address</InputText>
        <TextInputs
          style={styles.inputText}
          placeholder={"Hospital address "}
          value={address}
          onChangeText={setAddress}
          placeholderTextColor={"#fff"}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.button_container}>
          <MainButton
            onPress={handleDeleteDoctor}
            style={isLoading ? styles.loading_state : styles.deleteButton}
          >
            {isLoading ? "Deleting Doctor..." : "Delete Doctor"}
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

  doctorView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  dataView: {
    marginLeft: 10,
  },

  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
  },

  name: {
    fontFamily: Fonts.main,
    color: "#fff",
    textTransform: "capitalize",
  },

  specialty: {
    fontFamily: Fonts.main,
    color: Color.tagLine,
    textTransform: "capitalize",
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },
});
