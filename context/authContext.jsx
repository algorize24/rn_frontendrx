import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../firebase/firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

// -- context section --

// create a context
const AuthContext = createContext();

// custom hook for easy access to the context
export const useAuth = () => useContext(AuthContext);

// main component
export default function AuthContextProvider({ children }) {
  // user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // listen to firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // unmount
  }, []);

  // sign in with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        const error = new Error("Email is not verified");
        error.code = "auth/email-not-verified";
        throw error;
      }
    } catch (error) {
      console.error("Sign In failed...", error);
      throw error;
    }
  };

  // sign up with email and password
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await sendEmailVerification(user); // send email verification
      return userCredential; // Return user credentials
    } catch (error) {
      console.error("Sign Up failed...", error);
      throw error;
    }
  };

  // sign out the user
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed...", error);
    }
  };

  // value to pass in provider
  const value = {
    user,
    loading,
    signIn,
    signUp,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
