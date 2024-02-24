import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const newUser = userCredential.user;
        return setDoc(doc(db, "users", newUser.uid), { febShows: [] });
      })
      .catch((error) => {
        console.error("Error signing up:", error.message);
        throw error;
      });
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut, auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
