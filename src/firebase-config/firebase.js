import {createUserWithEmailAndPassword,getAuth, signInWithEmailAndPassword, signOut} from   "firebase/auth"
import{doc, getFirestore, setDoc} from "firebase/firestore"
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 
const firebaseConfig = {
  apiKey: "AIzaSyAkqhS-IvFLPlO9XoWF65wW0Itwt7FmbjU",
  authDomain: "chat-app-e030f.firebaseapp.com",
  projectId: "chat-app-e030f",
  storageBucket: "chat-app-e030f.firebasestorage.app",
  messagingSenderId: "729689813728",
  appId: "1:729689813728:web:24cb607b3e4aadf36f1685",
  measurementId: "G-XH246EEQZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signup = async (email, userName, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user; 

    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      userName: userName.toLowerCase(),
      email: email,
      name: userName,
      avatar: "",
      bio: "Hey there! I'm using the chat app",
      lastSeen: Date.now()
    });
    
    // Create chat document with empty chatData array
    await setDoc(doc(db, "chats", user.uid), {
      chatData: []
    });

    toast.success("Account created successfully!");
   
  } catch (error) {
    console.error("Error in signup:", error);
    toast.error(error.code);
  }
};
 
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    toast.success("Logged in successfully!")
  } catch (error) {
    console.error("Error in login:", error)
    toast.error(error.code)
  }
}

const signout = async () => {
  try {
    await signOut(auth)
    toast.success("Logged out successfully!")
  } catch (error) {
    console.error("Error in signout:", error)
    toast.error("Failed to logout")
  }
}

export {signup, login, signout, auth, db}
