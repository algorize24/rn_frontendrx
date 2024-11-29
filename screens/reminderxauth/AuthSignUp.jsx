import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";

// constants
import { Fonts } from "../../constants/Font";
import { Color } from "../../constants/Color";

// components
import MainButton from "../../components/buttons/MainButton";
import TextInputs from "../../components/Inputs/TextInputs";
import AuthText from "../../components/header/AuthText";
import Button from "../../components/buttons/Button";

// icon
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

// context
import { useAuth } from "../../context/authContext";

// axios
import axios from "axios";

// connection of android and ios
import { android_url, ios_url } from "../../constants/Url";

const connection =
  Platform.OS === "android"
    ? `${android_url}/user/signup`
    : `${ios_url}/user/signup`;

export default function AuthSignUp({ navigation }) {
  // sign up state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // error state
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false); // loading state
  const [showPassword, setShowPassword] = useState(false); // show password icon...

  const { signUp } = useAuth();

  // fn for show password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // go to sign in screen
  const handleSignIn = () => {
    navigation.navigate("Signin");
  };

  // sign up function
  const handleSignUp = async () => {
    setError("");

    // check if inputs are empty
    if (!email || !password || !name || !address) {
      setError("Please enter your details. The input fields cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      // sign up with firebase auth
      const firebaseUser = await signUp(email, password);

      // send user details to the backend
      await axios.post(connection, {
        firebaseUid: firebaseUser.user.uid,
        email,
        name,
        address,
      });

      navigation.navigate("CreatingAccount", { emailSent: true }); // Navigate to next screen
    } catch (error) {
      // error message
      if (error.code === "auth/email-already-in-use") {
        setEmailError(
          "This email address is already in use. Please use a different email."
        );
      } else if (error.code === "auth/weak-password") {
        setPasswordError(
          "Password is too weak. Please choose a stronger password (minimum 6 characters)."
        );
      } else if (error.response) {
        const serverError = error.response.data.errors
          ? error.response.data.errors.map((err) => err.msg).join("\n")
          : "Sign Up failed. Please check your details and try again.";
        setError(serverError);
      } else if (error.message) {
        setError("Network error, please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        <View style={styles.textContainer}>
          <AuthText style={styles.authText}>Create an Account</AuthText>
          <Text style={styles.text}>
            We will send you an email to this address for verification.
          </Text>
        </View>

        <ScrollView>
          <View style={styles.inputView}>
            <MaterialIcons name="person" size={24} color="#B3B3B3" />
            <View style={styles.input}>
              <TextInputs
                style={styles.inputText}
                placeholder={"Name"}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputView}>
            <Fontisto name="email" size={20} color="#B3B3B3" />
            <View style={styles.input}>
              <TextInputs
                style={styles.inputText}
                keyboardType={"email-address"}
                placeholder={"Email Address"}
                onChangeText={setEmail}
              />
            </View>
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <View style={styles.inputView}>
            <Feather name="lock" size={20} color="#B3B3B3" />

            <View style={styles.input}>
              <TextInputs
                style={styles.inputText}
                placeholder={"Password"}
                secure={showPassword ? false : true}
                onChangeText={setPassword}
              />
            </View>

            <Pressable onPress={handleShowPassword}>
              <Entypo
                name={showPassword ? "eye" : "eye-with-line"}
                size={20}
                color="#B3B3B3"
              />
            </Pressable>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <View style={styles.inputView}>
            <FontAwesome6 name="location-dot" size={20} color="#B3B3B3" />
            <View style={styles.input}>
              <TextInputs
                style={styles.inputText}
                placeholder={"Address"}
                onChangeText={setAddress}
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.viewKey}>
            {!isLoading ? (
              <MainButton onPress={handleSignUp}>Sign Up</MainButton>
            ) : (
              <Button isEnable={false}>
                <View style={styles.loadingView}>
                  <Text style={styles.loadingText}>Signing Up</Text>
                  <ActivityIndicator size={"small"} color={"#fff"} />
                </View>
              </Button>
            )}
            <Text style={styles.subText}>
              Already a member?{" "}
              <Text onPress={handleSignIn} style={styles.signInText}>
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 5,
  },

  textContainer: {
    marginBottom: 32,
  },

  text: {
    fontFamily: Fonts.sub,
    color: Color.tagLine,
    marginTop: 14,
    maxWidth: 320,
  },

  authText: {
    textTransform: "none",
  },

  inputView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.container,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 22,
  },

  input: {
    flex: 1,
  },

  viewKey: {
    flex: 1,
    justifyContent: "center",
    marginTop: 50,
  },

  subText: {
    fontFamily: Fonts.main,
    color: "white",
    textAlign: "center",
    marginTop: 18,
  },
  signInText: {
    color: Color.purpleColor,
    textDecorationLine: "underline",
  },

  errorText: {
    color: Color.redColor,
    fontFamily: Fonts.main,
    fontSize: 13,
    marginVertical: 10,
  },

  loadingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginRight: 5,
    color: "white",
    fontFamily: Fonts.main,
    fontSize: 16,
  },

  inputText: {
    paddingVertical: 15,
  },
});
