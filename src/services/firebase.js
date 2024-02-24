import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrdFMuKNbEUaKVpGuPzA4FJ_QuMGjYuyw",
  authDomain: "netflix-clone-9cf94.firebaseapp.com",
  projectId: "netflix-clone-9cf94",
  storageBucket: "netflix-clone-9cf94.appspot.com",
  messagingSenderId: "371490238548",
  appId: "1:371490238548:web:a0dc6553e922ef8e883dc1",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
