import { View, Text, StyleSheet } from "react-native";

import { Fonts } from "../../constants/Font";
import { Color } from "../../constants/Color";

export default function FallHistory({ itemData }) {
  const { date, time, falldetails } = itemData;
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{date}</Text>
        <Text style={styles.text}>{time}</Text>
      </View>

      <View style={styles.messageContainer}></View>
      <Text style={styles.textMessage}>Description:</Text>
      <Text
        style={styles.textDetails}
      >{`${falldetails} on ${date} at ${time}.`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.container,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
  },

  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    fontFamily: Fonts.main,
    color: Color.tagLine,
  },

  messageContainer: {
    marginTop: 20,
  },

  textMessage: {
    fontFamily: Fonts.main,
    color: Color.redColor,
  },

  textDetails: {
    fontFamily: Fonts.main,
    color: "#fff",
    fontSize: 13,
  },
});
