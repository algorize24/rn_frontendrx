import {
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";

import { useState } from "react";

// constants
import { Color } from "../../constants/Color";

// components
import MainButton from "../../components/buttons/MainButton";
import TextInputs from "../../components/Inputs/TextInputs";
import AuthText from "../../components/header/AuthText";
import Button from "../../components/buttons/Button";

// icons
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

export default function SetPassword({ navigation }) {
  // loading state for handleSignUp
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    setIsLoading(true); // Set loading state to true when the button is pressed
    setTimeout(() => {
      setIsLoading(false); // Reset loading state after delay
      navigation.navigate("CreatingAccount");
    }, 2000);
  };
  return (
    <View style={styles.root}>
      <AuthText style={styles.authText}>set password</AuthText>

      <View style={styles.inputView}>
        <Feather name="lock" size={20} color="#B3B3B3" />

        <View style={styles.input}>
          <TextInputs
            placeholder={"Password"}
            secure={showPassword ? false : true}
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

      <View style={styles.inputView}>
        <Feather name="lock" size={20} color="#B3B3B3" />

        <View style={styles.input}>
          <TextInputs
            placeholder={"Confirm Password"}
            secure={showPassword ? false : true}
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

      <KeyboardAvoidingView style={styles.keyboard}>
        <View style={styles.viewKey}>
          {!isLoading ? (
            <MainButton onPress={handleSignUp}>Sign Up</MainButton>
          ) : (
            <Button isEnable={false}>Signing Up...</Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 5,
  },

  inputView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.textInput,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
  },

  authText: {
    marginBottom: 32,
  },

  keyboard: {
    flex: 2,
    justifyContent: "flex-end",
  },

  viewKey: {
    marginBottom: 50,
  },
});
