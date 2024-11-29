import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

// constants
import { Fonts } from "../../constants/Font";
import { Color } from "../../constants/Color";

// components
import AuthText from "../../components/header/AuthText";
import MainButton from "../../components/buttons/MainButton";

export default function CreatingAccount({ navigation, route }) {
  const handleButton = () => {
    navigation.reset({
      // to not go back to previous screen, focus only on one route.
      index: 0,
      routes: [{ name: "Signin" }],
    });
  };

  const { emailSent } = route.params;
  return (
    <SafeAreaView style={styles.root}>
      <AuthText style={styles.authText}>Creating an Account</AuthText>

      {emailSent && (
        <>
          <View style={styles.content}>
            <Image
              style={styles.img}
              source={require("../../assets/others/successful.png")}
            />
            <Text style={styles.text}>
              Email sent successfully. Please check your email for verification.
            </Text>
          </View>

          <View style={styles.button_container}>
            <MainButton style={styles.button} onPress={handleButton}>
              Get Started
            </MainButton>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    marginTop: 30,
  },

  authText: {
    textTransform: "none",
    marginLeft: Platform.OS === "android" ? 0 : 20,
    marginTop: Platform.OS === "android" ? 0 : 20,
  },

  text: {
    fontFamily: Fonts.sub,
    color: Color.tagLine,
    textAlign: "center",
    marginBottom: 100,
    paddingHorizontal: 10,
  },

  button_container: {
    alignItems: "center",
  },

  button: {
    width: "90%",
  },

  content: {
    marginTop: 89,
    alignItems: "center",
  },

  img: {
    width: 300,
    height: 300,
  },
});
