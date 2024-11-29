import { Text, StyleSheet } from "react-native";
import { Fonts } from "../../constants/Font";

export default function TextPolicy({ children, style }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: Fonts.main,
    fontSize: 16,
    marginBottom: 8,
  },
});
