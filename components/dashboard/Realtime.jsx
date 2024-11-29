import { View, Text, StyleSheet } from "react-native";

// constants
import { Fonts } from "../../constants/Font";
import { Color } from "../../constants/Color";

// icon
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";

export default function Realtime({ name, size, title, num, label }) {
  return (
    <View style={styles.realtime}>
      <View style={styles.realtimeContainer}>
        <View style={styles.data}>
          {title === "Temperature" ? (
            <FontAwesome6
              name="temperature-half"
              size={size}
              color={Color.tagLine}
            />
          ) : title === "Oxygen Sat'" ? (
            <Entypo name="air" size={size} color={Color.tagLine} />
          ) : (
            <Fontisto name={name} size={size} color={Color.tagLine} />
          )}
        </View>

        <View>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.hr}>
            <Text style={styles.num}>{num}</Text>
            <Text style={styles.label}>{label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  realtime: {
    backgroundColor: Color.container,
    borderRadius: 8,
    minHeight: 92,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },

  realtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  data: {
    marginRight: 12,
  },

  title: {
    fontFamily: Fonts.main,
    color: Color.tagLine,
    textTransform: "capitalize",
    fontSize: 13,
  },

  hr: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  num: {
    color: "#fff",
    fontFamily: Fonts.main,
    fontSize: 24,
  },

  label: {
    fontFamily: Fonts.main,
    fontSize: 13,
    color: Color.tagLine,
    marginLeft: 5,
  },
});
