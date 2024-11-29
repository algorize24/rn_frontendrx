import { StatusBar } from "expo-status-bar"; // react-native
import { useState, useEffect } from "react"; // react
import { View, ActivityIndicator } from "react-native";

// react-navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import * as Font from "expo-font"; // custom-fonts
import * as SplashScreen from "expo-splash-screen"; // splash screen

// icons
import {
  Fontisto,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
  Ionicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";

// constants
import { Color } from "./constants/Color";
import { Fonts } from "./constants/Font";

// screens - ReminderxPolicyStack
import PolicyScreen from "./screens/reminderxpolicy/PolicyScreen";
import TermOfUse from "./screens/reminderxpolicy/TermOfUse";
import PrivacyPolicyScreen from "./screens/reminderxpolicy/PrivacyPolicyScreen";

// screens - ReminderAuthStack
import AuthSelect from "./screens/reminderxauth/AuthSelect";
import AuthLogin from "./screens/reminderxauth/AuthLogin";
import AuthSignUp from "./screens/reminderxauth/AuthSignUp";
import ForgotPassword from "./screens/reminderxauth/ForgotPassword";
import ResetPassword from "./screens/reminderxauth/ResetPassword";
import CreatingAccount from "./screens/reminderxauth/CreatingAccount";

// screens - ReminderFeaturesStack
import RealTimeScreen from "./screens/reminderfeatures/RealTimeScreen";
import ReminderMedScreen from "./screens/reminderfeatures/ReminderMedScreen";
import RealTimeNews from "./screens/reminderfeatures/RealTimeNews";

// screens - ReminderAuthenticated
import DashboardScreen from "./screens/reminderauthenticated/DashboardScreen";
import InventoryScreen from "./screens/reminderauthenticated/InventoryScreen";
import ReminderScreen from "./screens/reminderauthenticated/ReminderScreen";
import ContactScreen from "./screens/reminderauthenticated/ContactScreen";
import ProfileScreen from "./screens/reminderauthenticated/ProfileScreen";

// screen - sub profile
import Aboutreminderx from "./screens/reminderauthenticated/subprofile/Aboutreminderx";
import HelpSupport from "./screens/reminderauthenticated/subprofile/HelpSupport";
import DoctorList from "./screens/reminderauthenticated/subprofile/DoctorList";
import EditProfile from "./screens/reminderauthenticated/edit/EditProfile";
import Aboutus from "./screens/reminderauthenticated/subprofile/Aboutus";

// components
import HeaderTitle from "./components/header/HeaderTitle";
import DrawerHeader from "./components/header/DrawerHeader";
import ChatbotScreen from "./components/dashboard/ChatbotScreen";

// crud - screen
import AddContact from "./screens/reminderauthenticated/add/AddContact";
import AddMedicine from "./screens/reminderauthenticated/add/AddMedicine";
import AddDoctor from "./screens/reminderauthenticated/add/AddDoctor";
import EditContact from "./screens/reminderauthenticated/edit/EditContact";
import EditInventory from "./screens/reminderauthenticated/edit/EditInventory";
import EditDoctors from "./screens/reminderauthenticated/edit/EditDoctors";

// reminderx - notif - main fn.

// -- add-reminder
import AddReminder from "./screens/reminderauthenticated/reminderx/add-reminder/AddReminder";

// -- how-often-do-you-take
import OftenTake from "./screens/reminderauthenticated/reminderx/how-often-do-you-take/OftenTake";
import OftenEveryday from "./screens/reminderauthenticated/reminderx/how-often-do-you-take/Often-Everyday";
import OftenWeek from "./screens/reminderauthenticated/reminderx/how-often-do-you-take/Often-Week";

// -- add-pills
import AddPills from "./screens/reminderauthenticated/reminderx/add-pills/AddPills";
import AddPillsWeek from "./screens/reminderauthenticated/reminderx/add-pills/AddPillsWeek";

// -- select-time
import SelectTime from "./screens/reminderauthenticated/reminderx/select-time/SelectTime";
import SelectTimeWeek from "./screens/reminderauthenticated/reminderx/select-time/SelectTimeWeek";

// -- req-backend
import SetReminder from "./screens/reminderauthenticated/reminderx/req-backend/SetReminder";

// notification
import NotificationScreen from "./screens/reminderauthenticated/notification/NotificationScreen";

// connection
import DeviceConnection from "./screens/reminderauthenticated/connection/DeviceConnection";

// context
import AuthContextProvider from "./context/authContext";
import ReminderContextProvider from "./context/reminderContext";

const Stack = createNativeStackNavigator(); // stack navigator
const Drawer = createDrawerNavigator(); // drawer navigator
SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we fetch resources

// this fn component will only rendered once if the user install the application. privacy policy
function ReminderxPolicyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Color.bgColor },
        contentStyle: { backgroundColor: Color.bgColor },
      }}
    >
      <Stack.Screen
        name=" "
        component={PolicyScreen}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="TermOfUse"
        component={TermOfUse}
        options={{
          headerTintColor: "white",
          title: "Terms of Use",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerTintColor: "white",
          title: "Privacy Policy",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
        }}
      />
    </Stack.Navigator>
  );
}

// this fn component will rendered if session expires or newly user. signIn/signUp
function ReminderAuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Color.bgColor },
        contentStyle: { backgroundColor: Color.bgColor },
      }}
    >
      <Stack.Screen
        name="ReminderxPolicyStack"
        component={ReminderxPolicyStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthSelect"
        component={AuthSelect}
        options={{
          headerTitle: "",
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Signin"
        component={AuthLogin}
        options={{
          headerTintColor: "white",
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="Signup"
        component={AuthSignUp}
        options={{
          headerTintColor: "white",
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerTintColor: "white",
          title: "",
        }}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerTintColor: "white",
          title: "",
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="CreatingAccount"
        component={CreatingAccount}
        options={{
          headerTintColor: "white",
          title: "",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

// this fn component will only rendered once if the user install the application. features section
function ReminderFeaturesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Color.bgColor },
        contentStyle: { backgroundColor: Color.bgColor },
      }}
    >
      <Stack.Screen
        name="ReminderAuthStack"
        component={ReminderAuthStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RealTime"
        component={RealTimeScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="RealTimeNews"
        component={RealTimeNews}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="MedicineReminder"
        component={ReminderMedScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable gestures
        }}
      />
    </Stack.Navigator>
  );
}

// this fn component will show if the user is authenticated. main screen/component
function ReminderAuthenticated() {
  return (
    <Drawer.Navigator
      drawerContentStyle={{
        backgroundColor: Color.bgColor,
      }}
      drawerContent={(props) => <DrawerHeader {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Color.bgColor },
        headerTintColor: "#fff",
        headerTitle: () => <HeaderTitle />,
        headerTitleAlign: "center",
        drawerStyle: { backgroundColor: Color.bgColor },
        drawerLabelStyle: {
          color: Color.tagLine,
          fontFamily: Fonts.main,
        },
        drawerActiveBackgroundColor: Color.container,
        gestureEnabled: true,
        swipeEnabled: true,
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="notifications"
              size={20}
              color="#fff"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Notification")}
            />

            <AntDesign
              name="link"
              size={20}
              color="#fff"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Connection")}
            />
          </View>
        ),
      })}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Dashboard",
        }}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: "Medicine Storage",
        }}
      />
      <Drawer.Screen
        name="EventSchedule"
        component={ReminderScreen}
        options={{
          title: "Medication Reminder",
        }}
      />

      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: "Emergency Contact ",
        }}
      />

      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

// main function
export default function App() {
  // state for font
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts or any other resources
        await Font.loadAsync({
          "work-sans": require("./assets/fonts/WorkSans-Bold.ttf"),
          "work-light": require("./assets/fonts/WorkSans-Light.ttf"),
          "merri-weather": require("./assets/fonts/Merriweather-Regular.ttf"),
          ...Fontisto.font,
          ...Feather.font,
          ...Entypo.font,
          ...MaterialCommunityIcons.font,
          ...MaterialIcons.font,
          ...FontAwesome6.font,
          ...Ionicons.font,
          ...AntDesign.font,
        });
      } catch (err) {
        console.warn(err);
      } finally {
        // Once everything is ready, set the state and hide the splash screen
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    // Show the splash screen or a loading spinner while fonts are loading
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Color.purpleColor} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <AuthContextProvider>
          <ReminderContextProvider>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Color.bgColor },
                contentStyle: { backgroundColor: Color.bgColor },
              }}
            >
              <Stack.Screen
                name="ReminderFeaturesStack"
                component={ReminderFeaturesStack}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="ReminderAuthenticated"
                component={ReminderAuthenticated}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  headerTitle: "",
                }}
              />

              <Stack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                  title: "Notification",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="Connection"
                component={DeviceConnection}
                options={{
                  title: "Device Connection",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="Chatbot"
                component={ChatbotScreen}
                options={{
                  title: "RX Intelligence",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="AddContact"
                component={AddContact}
                options={{
                  title: "Contact Information",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="EditContact"
                component={EditContact}
                options={{
                  title: "Edit Contact",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="AddReminder"
                component={AddReminder}
                options={{
                  headerTitle: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="OftenTake"
                component={OftenTake}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="OftenEveryday"
                component={OftenEveryday}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="OftenWeek"
                component={OftenWeek}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="AddPills"
                component={AddPills}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="AddPillsWeek"
                component={AddPillsWeek}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="PickTime"
                component={SelectTime}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="PickTimeWeek"
                component={SelectTimeWeek}
                options={{
                  title: "",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="SetReminder"
                component={SetReminder}
                options={{
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="AddMedicine"
                component={AddMedicine}
                options={{
                  title: "Medicine Inventory",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main },
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="EditInventory"
                component={EditInventory}
                options={{
                  title: "Edit Inventory",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                  title: "Edit Profile",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="AddDoctor"
                component={AddDoctor}
                options={{
                  title: "Add Doctor",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="EditDoctor"
                component={EditDoctors}
                options={{
                  title: "Edit Doctor",
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="Doctor"
                component={DoctorList}
                options={({ navigation }) => ({
                  headerTitle: "",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                  headerTintColor: "white",
                  headerTitleAlign: "center",
                  headerRight: () => (
                    <Ionicons
                      name="add"
                      size={24}
                      color="#fff"
                      onPress={() => {
                        navigation.navigate("AddDoctor");
                      }}
                    />
                  ),
                })}
              />

              <Stack.Screen
                name="AboutUs"
                component={Aboutus}
                options={{
                  title: "",
                  headerTintColor: "white",
                }}
              />
              <Stack.Screen
                name="AboutReminderx"
                component={Aboutreminderx}
                options={{
                  title: "",
                  headerTintColor: "white",
                }}
              />

              <Stack.Screen
                name="HelpnSupport"
                component={HelpSupport}
                options={{
                  title: "",
                  headerTintColor: "white",
                }}
              />

              <Stack.Screen
                name="TermOfUse"
                component={TermOfUse}
                options={{
                  headerTintColor: "white",
                  title: "Terms of Use",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />

              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{
                  headerTintColor: "white",
                  title: "Privacy Policy",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontFamily: Fonts.main, fontSize: 14 },
                }}
              />
            </Stack.Navigator>
          </ReminderContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </>
  );
}
