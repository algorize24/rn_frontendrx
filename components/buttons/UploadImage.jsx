import { Pressable, StyleSheet, Text } from "react-native";
import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";
export default function ({ style }) {
  return (
    <Pressable style={[styles.root, style]}>
      <Text style={styles.text}>Upload Image</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Color.container,
    justifyContent: "center",
    alignItems: "center",
    height: 110,
    borderRadius: 8,
  },

  text: {
    fontFamily: Fonts.main,
    color: Color.tagLine,
  },
});
