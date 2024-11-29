import { View, Text, StyleSheet, Pressable } from "react-native";
import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

export default function DeviceConnection() {
  return (
    <View style={styles.root}>
      <View style={styles.main_container}>
        <Pressable
          style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        >
          <Text style={styles.text}>Health Overview Sensor</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        >
          <Text style={styles.text}>Smart Medicine Storage</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 18,
  },

  main_container: {
    marginTop: 30,
  },

  pressed: {
    opacity: 0.7,
  },

  container: {
    backgroundColor: Color.container,
    width: "screen",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  text: {
    color: "#fff",
    fontFamily: Fonts.main,
    textAlign: "center",
  },
});
