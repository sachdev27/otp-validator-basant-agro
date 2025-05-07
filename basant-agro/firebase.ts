// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9LDM3xnMcN_pKqeKR6iEtpzU-lncbpDc",
  authDomain: "basant-agro-otp.firebaseapp.com",
  projectId: "basant-agro-otp",
  storageBucket: "basant-agro-otp.firebasestorage.app",
  messagingSenderId: "1063689266617",
  appId: "1:1063689266617:web:9f1ef3605a5fa47e650268",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
