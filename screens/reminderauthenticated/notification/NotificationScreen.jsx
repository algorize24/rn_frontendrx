import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
} from "react-native";

import { useState } from "react";

import Fontisto from "@expo/vector-icons/Fontisto";

import { Color } from "../../../constants/Color";
import { Fonts } from "../../../constants/Font";

import * as Calendar from "expo-calendar";

export default function NotificationScreen() {
  return (
    <View style={styles.root}>
      <Pressable>
        <Text style={styles.header}>send push notification</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 18,
  },

  container: {
    marginTop: 30,
  },

  subContainer: {
    marginTop: 0,
  },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  header: {
    fontFamily: Fonts.main,
    color: "#fff",
    fontSize: 18,
  },

  description: {
    fontFamily: Fonts.sub,
    color: "#fff",
    fontSize: 13,
    width: 300,
  },
});
