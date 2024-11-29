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

export default function RealTimeScreen({ navigation }) {
  // track image loading
  const [imageLoading, setImageLoading] = useState(true);

  // invoke in mainbutton
  const handleNext = () => {
    navigation.navigate("RealTimeNews");
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FeatureText style={styles.featureText} />
        {imageLoading && <ActivityIndicator color={Color.purpleColor} />}

        <Image
          style={styles.img}
          source={require("../../assets/feature/health_overview.png")}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        <TextPolicy style={styles.textPolicy}>
          Track Real-Time Health Stats
        </TextPolicy>

        <Text style={styles.mainText}>
          Monitor your <Text style={styles.rxText}>heart rate</Text> and{" "}
          <Text style={styles.rxText}>oxygen saturation</Text> in real-time,
          ensuring up-to-the-minute insights into your health. Stay informed
          with live updates for better health management.
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
