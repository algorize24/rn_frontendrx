import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";

// constants
import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

// components
import TextInputs from "../../../components/Inputs/TextInputs";
import InputText from "../../../components/header/InputText";
import LoadingModal from "../../../components/loading/LoadingModal";

// axios
import axios from "axios";

// context
import { useAuth } from "../../../context/authContext";

// connection of android and ios
import { android_url, ios_url } from "../../../constants/Url";

const connection =
  Platform.OS === "android" ? `${android_url}/user` : `${ios_url}/user`;

export default function EditProfile({ navigation }) {
  // context
  const { user } = useAuth();

  // user state
  const [userInfo, setUserInfo] = useState(null);

  // editing state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // error state
  const [error, setError] = useState("");

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(null);

  // fetch the user from mongo database
  useEffect(() => {
    const fetchUser = async () => {
      // identify who user is logged in.
      if (user) {
        try {
          const response = await axios.get(`${connection}/${user.email}`);
          setUserInfo(response.data);
        } catch (error) {
          console.log("Error fetching user info", error);
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  // edit the name, address
  const handleEditProfile = async () => {
    setIsLoading(true);

    // Only include fields that have values to avoid overwriting
    const updatedData = {};
    if (name) updatedData.name = name;
    if (address) updatedData.address = address;

    try {
      // send the updated data to the backend
      await axios.patch(`${connection}/${userInfo._id}`, updatedData);

      // on success, navigate back to the profile screen
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error updating profile", error);
      setError("Error updating your profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // add a header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleEditProfile}>
          <Text style={styles.header_right}>Update</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleEditProfile]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        {isLoading && <LoadingModal visible={isLoading} />}

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <InputText style={styles.input}>Email Address</InputText>
            <TextInputs
              style={[styles.inputs, styles.email]}
              value={userInfo ? userInfo.email : "Email Address"}
              editable={false}
            />

            <InputText style={styles.input}>Name</InputText>
            <TextInputs
              style={styles.inputs}
              placeholder={userInfo ? userInfo.name : "Name"}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"#fff"}
            />
            <InputText style={styles.input}>Address</InputText>

            <TextInputs
              style={styles.inputs}
              placeholder={userInfo ? userInfo.address : "Address"}
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholderTextColor={"#fff"}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
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

  container: {
    marginTop: 30,
  },

  inputContainer: {
    marginTop: 20,
    marginBottom: 15,
  },

  inputs: {
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

  email: {
    opacity: 0.5,
  },

  errorText: {
    color: Color.redColor,
    fontFamily: Fonts.main,
    fontSize: 13,
    marginBottom: 40,
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },
});
