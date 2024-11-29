import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLayoutEffect } from "react";

// constants
import { Color } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Font";

// component
import AuthText from "../../../../components/header/AuthText";

// context
import { useReminder } from "../../../../context/reminderContext";

export default function OftenEveryday({ navigation }) {
  // reminderContext
  const { medicationName, setFrequency } = useReminder();

  // dynamically change the title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.title}>{medicationName && medicationName}</Text>
      ),
    });
  }, [navigation, medicationName]);

  const pressableData = [
    {
      path: "PickTime",
      frequency: "Once a day",
    },
    {
      path: "PickTime",
      frequency: "Twice a day",
    },

    {
      path: "PickTime",
      frequency: "3 times a day",
    },
  ];

  return (
    <View style={styles.root}>
      <AuthText style={styles.text}>How often do you take it?</AuthText>

      <View style={styles.container}>
        <View style={styles.subContainer}>
          {pressableData.map((data, key) => (
            <Pressable
              key={key}
              onPress={() => {
                setFrequency(data.frequency); // pass to AddPills.jsx
                navigation.navigate(data.path);
              }}
              style={({ pressed }) => [styles.inputs, pressed && styles.press]}
            >
              <Text style={styles.textInterval}>{data.frequency}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  title: {
    fontFamily: Fonts.main,
    textTransform: "capitalize",
    color: "#fff",
    fontSize: 14,
  },

  text: {
    textTransform: "none",
    marginHorizontal: 18,
    marginBottom: 20,
    marginTop: 50,
    fontSize: 20,
    width: 320,
  },

  container: {
    flex: 1,
    backgroundColor: Color.container,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "space-between",
    paddingBottom: 20,
  },

  subContainer: {
    marginTop: 30,
    marginHorizontal: 30,
  },

  inputs: {
    backgroundColor: Color.bgColor,
    borderRadius: 8,
    marginTop: 10,
    padding: 12,
  },

  press: {
    opacity: 0.7,
  },

  textInterval: {
    color: "#fff",
    fontFamily: Fonts.main,
  },
});
