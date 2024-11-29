import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLayoutEffect } from "react";

// constants
import { Color } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Font";

// component
import AuthText from "../../../../components/header/AuthText";

// context
import { useReminder } from "../../../../context/reminderContext";

export default function OftenWeek({ navigation }) {
  // reminderContext
  const { medicationName, setSpecificDays } = useReminder();

  const pressableData = [
    {
      path: "PickTimeWeek",
      specificDays: "Sunday",
    },
    {
      path: "PickTimeWeek",
      specificDays: "Monday",
    },
    {
      path: "PickTimeWeek",
      specificDays: "Tuesday",
    },
    {
      path: "PickTimeWeek",
      specificDays: "Wednesday",
    },
    {
      path: "PickTimeWeek",
      specificDays: "Thursday",
    },
    {
      path: "PickTimeWeek",
      specificDays: "Friday",
    },
    {
      path: "PickTimeWeek",
      specificDays: "Saturday",
    },
  ];

  // dynamically change the title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.title}>{medicationName && medicationName}</Text>
      ),
    });
  }, [navigation, medicationName]);
  return (
    <View style={styles.root}>
      <AuthText style={styles.text}>
        On which day(s) do you need to take your medicine?
      </AuthText>

      <View style={styles.container}>
        <View style={styles.subContainer}>
          {pressableData.map((data, key) => (
            <Pressable
              key={key}
              onPress={() => {
                setSpecificDays(data.specificDays); // Update context
                navigation.navigate("PickTimeWeek", {
                  specificDay: data.specificDays,
                }); // Pass specific day
              }}
              style={({ pressed }) => [styles.inputs, pressed && styles.press]}
            >
              <Text style={styles.textInterval}>{data.specificDays}</Text>
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
