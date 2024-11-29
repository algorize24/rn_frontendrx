import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { useState } from "react";

// constants
import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

// icons
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// axios
import axios from "axios";

// connection of android and ios
import { android_url, ios_url } from "../../constants/Url";

// connection path
const connection =
  Platform.OS === "android"
    ? `${android_url}/reminder/`
    : `${ios_url}/reminder/`;

export default function ReminderContainer({ itemData, setRemindersUpdated }) {
  // this data is from Reminder screen
  const { _id, time, dosage, medicineName } = itemData;

  // state for modal
  const [modalVisible, setModalVisible] = useState(false);

  // loading state
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Format the time for display
  const formattedTime = new Date(time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  });

  const handleDeleteReminder = async () => {
    // show a configuration dialog
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            setDeleteLoading(true);

            try {
              // send a request to the backend
              await axios.delete(`${connection}${_id}`);

              // on success, navigate back to the reminder screen
              Alert.alert(
                "Reminder deleted",
                "The reminder was deleted successfully."
              );

              // Trigger the re-fetch by calling the passed function
              setRemindersUpdated((prevState) => !prevState); // Toggle state

              // close the modal after successful deletion
              setModalVisible(false);
            } catch (error) {
              Alert.alert(
                "Error Deleting",
                "Failed to delete the reminder. Please try again later.",
                error
              );
            } finally {
              setDeleteLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const safeDosage = Array.isArray(dosage)
    ? dosage
    : typeof dosage === "object" && dosage?.dosage // Safely access dosage object
    ? [dosage.dosage] // If it's an object with a 'dosage' property, extract it
    : dosage !== undefined && dosage !== null
    ? [dosage] // If it's a single value, make it an array for consistency
    : []; // Default to an empty array if dosage is undefined or null

  return (
    <View style={styles.root}>
      <View style={styles.mapContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.mainContainer}
        >
          {/* Display medicine details */}
          <View style={styles.container}>
            <Image
              style={styles.img}
              source={require("../../assets/others/pill.png")}
            />
            <View style={styles.textContainer}>
              <Text style={styles.medName}>{medicineName}</Text>
              {safeDosage.map((item, index) => {
                // Display the dosage information
                return (
                  <Text key={index} style={styles.description}>
                    Take {item} Pill(s) of {medicineName}.
                  </Text>
                );
              })}
            </View>
          </View>
        </Pressable>
      </View>

      {/* Modal Section */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </Pressable>

            <View style={styles.modalHeader}>
              <Image
                style={styles.img}
                source={require("../../assets/others/pill.png")}
              />
              <Text style={styles.modalTitle}>{medicineName}</Text>
            </View>

            <View style={styles.infoContainer}>
              <MaterialIcons name="schedule" size={24} color="#fff" />
              <Text style={styles.modalTime}>
                Scheduled for {formattedTime}, today
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <MaterialCommunityIcons name="pill" size={24} color="#fff" />
              {safeDosage.map((item, index) => (
                <Text key={index} style={styles.modalDescription}>
                  Take {item} pill(s)
                </Text>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <Text style={[styles.skipButton, styles.actionText]}>Skip</Text>
              <Text style={[styles.takeButton, styles.actionText]}>Take</Text>
              <Pressable
                style={
                  deleteLoading ? styles.loading_container : styles.deleteButton
                }
                onPress={handleDeleteReminder}
              >
                {deleteLoading ? (
                  <Text style={styles.loading}>...</Text>
                ) : (
                  <Text style={styles.actionText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    marginBottom: 13,
  },

  root: {
    flex: 1,
    marginVertical: 10,
  },

  mainContainer: {
    backgroundColor: Color.container,
    paddingVertical: 15,
    alignItems: "flex-start",
    borderRadius: 10,
  },

  time: {
    fontFamily: Fonts.main,
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },

  img: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },

  textContainer: {
    marginLeft: 10,
  },

  medName: {
    fontFamily: Fonts.main,
    fontSize: 16,
    color: "#fff",
    textTransform: "capitalize",
  },

  description: {
    fontFamily: Fonts.main,
    color: Color.tagLine,
    fontSize: 12,
  },

  textDesc: {
    textTransform: "capitalize",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: Color.bgColor,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  modalHeader: {
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: Fonts.main,
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    textTransform: "capitalize",
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },

  modalTime: {
    color: Color.tagLine,
    fontFamily: Fonts.main,
    marginLeft: 10,
  },
  modalDescription: {
    color: Color.tagLine,
    fontFamily: Fonts.main,
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  skipButton: {
    flex: 1,
    backgroundColor: Color.purpleColor,
    textAlign: "center",
    padding: 5,
    marginHorizontal: 3,
    borderRadius: 4,
  },

  takeButton: {
    flex: 1,
    backgroundColor: Color.greenColor,
    textAlign: "center",
    padding: 5,
    marginHorizontal: 3,
    borderRadius: 4,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: Color.redColor,
    textAlign: "center",
    padding: 5,
    marginHorizontal: 3,
    borderRadius: 4,
  },

  actionText: {
    fontFamily: Fonts.main,
    color: "#fff",
    textAlign: "center",
  },

  loading: {
    textAlign: "center",
    color: "#fff",
  },

  loading_container: {
    flex: 1,
    backgroundColor: Color.tagLine,
    opacity: 0.5,
    textAlign: "center",
    padding: 5,
    marginHorizontal: 3,
    borderRadius: 4,
  },
});
