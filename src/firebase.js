// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAycIxax0kln2TPfziTAvPuHW-zoBf_1Mg",
  authDomain: "talko-app.firebaseapp.com",
  databaseURL: "https://talko-app-default-rtdb.firebaseio.com",
  projectId: "talko-app",
  storageBucket: "talko-app.firebasestorage.app",
  messagingSenderId: "941650063407",
  appId: "1:941650063407:web:7e8b37208bf3a9125596da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };