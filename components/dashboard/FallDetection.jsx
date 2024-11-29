import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

import Fontisto from "@expo/vector-icons/Fontisto";

export default function FallDetection({ onToggle }) {
  const [isToggle, setIsToggle] = useState(false);

  const handleToggle = () => {
    const newToggleState = !isToggle;
    setIsToggle(newToggleState);
    onToggle(newToggleState); // pass to dashboard
  };
  return (
    <View style={styles.system}>
      <Text style={styles.text}>Fall Detection System</Text>
      <Pressable onPress={handleToggle}>
        {!isToggle ? (
          <Fontisto name="toggle-off" size={36} color={Color.tagLine} />
        ) : (
          <Fontisto name="toggle-on" size={36} color={Color.purpleColor} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  system: {
    backgroundColor: Color.container,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 14,
    marginVertical: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text: {
    fontFamily: Fonts.main,
    fontSize: 16,
    color: "#fff",
  },
});
