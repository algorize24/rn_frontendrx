import { Text, StyleSheet } from "react-native";
import { Fonts } from "../../constants/Font";
export default function AuthText({ children, style }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    textTransform: "capitalize",
    fontSize: 24,
    fontFamily: Fonts.main,
  },
});
