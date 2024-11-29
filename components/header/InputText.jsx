import { Text, StyleSheet } from "react-native";
import { Fonts } from "../../constants/Font";

export default function InputText({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 7,
    fontFamily: Fonts.main,
    color: "#fff",
    fontSize: 13,
  },
});
