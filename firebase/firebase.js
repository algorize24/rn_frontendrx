import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGH5uvGwNW-fG6sYsvD56FnMUUkl9MwHk",
  authDomain: "reminderxx.firebaseapp.com",
  projectId: "reminderxx",
  storageBucket: "reminderxx.firebasestorage.app",
  messagingSenderId: "933389086521",
  appId: "1:933389086521:web:db0c341c1acc115bb382e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
