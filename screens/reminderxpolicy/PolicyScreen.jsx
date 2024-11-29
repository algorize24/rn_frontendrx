import { View, StyleSheet } from "react-native";
import { useState } from "react";

// constants
import { Color } from "../../constants/Color";

// components
import CustomCheckbox from "../../components/buttons/CustomCheckbox";
import Button from "../../components/buttons/Button";
import Title from "../../components/header/Title";

export default function PolicyScreen({ navigation }) {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // pass to CustomCheckbox component
  const handleCheckedLaw = (isChecked) => {
    setIsButtonEnabled(isChecked); // Enable the button when checked
  };

  // pass to button
  const handleUserAgreement = () => {
    navigation.navigate("AuthSelect");
    console.log("Pressed");
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Title />
      </View>

      <View>
        <CustomCheckbox onCheckedLawChange={handleCheckedLaw} />
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleUserAgreement} isEnable={isButtonEnabled}>
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },

  titleContainer: {
    marginBottom: 113,
    alignItems: "center",
  },

  text: {
    color: Color.tagLine,
  },

  buttonContainer: {
    marginVertical: 46,
  },
});
