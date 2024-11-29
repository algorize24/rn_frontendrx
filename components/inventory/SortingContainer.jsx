import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

export default function SortingContainer({ onSortChange }) {
  // track selected sort option
  const [selectedSort, setSelectedSort] = useState("");

  // fn to track the selected sort.
  const handlePress = (sortType) => {
    setSelectedSort(sortType); // Update the selected sort
    onSortChange(sortType); // Trigger the parent sorting function
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>SORT BY</Text>
      <View style={styles.subContainer}>
        <Pressable
          onPress={() => handlePress("ascend")}
          style={[
            styles.sortContainer,
            selectedSort === "ascend" ? styles.activeSort : null, // Apply active style conditionally
          ]}
        >
          <Text
            style={[
              styles.text,
              selectedSort === "ascend" ? styles.activeText : null, // Change text color for active state
            ]}
          >
            Ascending (A-Z)
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handlePress("descend")}
          style={[
            styles.sortContainer,
            styles.descend,
            selectedSort === "descend" ? styles.activeSort : null,
          ]}
        >
          <Text
            style={[
              styles.text,
              selectedSort === "descend" ? styles.activeText : null,
            ]}
          >
            Descending (Z-A)
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => handlePress("expDate")}
        style={[
          styles.sortContainer,
          styles.expDate,
          selectedSort === "expDate" ? styles.activeSort : null,
        ]}
      >
        <Text
          style={[
            styles.text,
            selectedSort === "expDate" ? styles.activeText : null,
          ]}
        >
          Expiration Date (Soonest)
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.container,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 36,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 50,
  },

  subContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  header: {
    fontFamily: Fonts.main,
    color: "#fff",
    fontSize: 13,
  },

  sortContainer: {
    backgroundColor: Color.bgColor,
    alignSelf: "baseline",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  activeSort: {
    backgroundColor: Color.purpleColor,
  },

  text: {
    fontFamily: Fonts.main,
    color: "#fff",
    fontSize: 13,
  },

  descend: {
    marginLeft: 8,
  },

  expDate: {
    marginTop: 8,
  },
});
