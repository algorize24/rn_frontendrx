import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";

import { useState } from "react";

// components
import FeatureText from "../../components/header/FeatureText";
import MainButton from "../../components/buttons/MainButton";
import TextPolicy from "../../components/header/TextPolicy";
import Button from "../../components/buttons/Button";

// constants
import { Fonts } from "../../constants/Font";
import { Color } from "../../constants/Color";

export default function ReminderMedScreen({ navigation }) {
  // loading state for handleNext
  const [isLoading, setIsLoading] = useState(false);

  // track image loading
  const [imageLoading, setImageLoading] = useState(true);

  // invoke in mainbutton
  const handleNext = () => {
    setIsLoading(true); // Set loading state to true when the button is pressed
    setTimeout(() => {
      setIsLoading(false); // Reset loading state after delay
      navigation.navigate("ReminderAuthenticated");
    }, 1000);
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FeatureText style={styles.featureText} />
        {imageLoading && <ActivityIndicator color={Color.purpleColor} />}

        <Image
          style={styles.img}
          source={require("../../assets/feature/reminder.png")}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />

        <TextPolicy style={styles.textPolicy}>
          Smart Medication Reminder System
        </TextPolicy>

        <Text style={styles.mainText}>
          Stay on track with timely <Text style={styles.rxText}>reminders</Text>{" "}
          for your medications, ensuring you never miss a dose and manage your
          health with ease.
        </Text>

        <View style={styles.buttonContainer}>
          {!isLoading ? (
            <MainButton onPress={handleNext}>Get Started</MainButton>
          ) : (
            <Button isEnable={false}>
              <ActivityIndicator color={"#fff"} />
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingVertical: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 25,
  },

  container: {
    flex: 1,
    justifyContent: "center",
  },

  buttonContainer: {
    marginTop: 60,
    marginHorizontal: Platform.OS === "android" ? 0 : 20,
  },

  featureText: {
    marginBottom: 10,
  },

  img: {
    width: "screen",
    height: 220,
    marginHorizontal: Platform.OS === "android" ? 0 : 20,
  },

  textPolicy: {
    fontSize: 22,
    marginTop: 10,
    paddingHorizontal: 10,
    marginHorizontal: Platform.OS === "android" ? 0 : 20,
  },

  mainText: {
    paddingHorizontal: 10,
    fontFamily: Fonts.sub,
    fontSize: 16,
    color: Color.tagLine,
    marginHorizontal: Platform.OS === "android" ? 0 : 20,
  },
  rxText: {
    color: Color.purpleColor,
    fontFamily: Fonts.main,
  },
});
