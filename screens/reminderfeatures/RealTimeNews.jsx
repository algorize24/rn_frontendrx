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

// constants
import { Fonts } from "../../constants/Font";
import { Color } from "../../constants/Color";

export default function RealTimeNews({ navigation }) {
  // track image loading
  const [imageLoading, setImageLoading] = useState(true);

  // invoke in mainbutton
  const handleNext = () => {
    navigation.navigate("MedicineReminder");
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FeatureText style={styles.featureText} />
        {imageLoading && <ActivityIndicator color={Color.purpleColor} />}

        <Image
          style={styles.img}
          source={require("../../assets/feature/realtime_news.png")}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        <TextPolicy style={styles.textPolicy}>
          Real-Time Health & Medicine News
        </TextPolicy>

        <Text style={styles.mainText}>
          Stay ahead with the latest breakthroughs, trends, and updates in{" "}
          <Text style={styles.rxText}>health </Text> and{" "}
          <Text style={styles.rxText}>medicine</Text>. Access real-time news on
          medical advancements, wellness tips, and healthcare innovations,
          ensuring you're always informed and empowered.
        </Text>

        <View style={styles.buttonContainer}>
          <MainButton onPress={handleNext}>Next</MainButton>
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
    marginTop: 50,
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
