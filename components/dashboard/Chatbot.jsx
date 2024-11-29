import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

export default function Chatbot({ onPress }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Pressable onPress={onPress} style={styles.pressContainer}>
      <View style={styles.chatbot}>
        {/* {imageLoaded && (
          <Text style={styles.robotText}>Hi! What can I do for you?</Text>
        )} */}
        <Image
          style={styles.img}
          source={require("../../assets/others/chatbot.png")}
          onLoad={() => setImageLoaded(true)} // Set imageLoaded to true when the image is loaded
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    marginBottom: 70,
  },

  chatbot: {
    flexDirection: "row",
    alignItems: "center",
  },

  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  robotText: {
    color: "#fff",
    fontSize: 13,
    marginRight: 10,
    backgroundColor: Color.container,
    padding: 10,
    borderRadius: 15,
    fontFamily: Fonts.main,
  },
});
