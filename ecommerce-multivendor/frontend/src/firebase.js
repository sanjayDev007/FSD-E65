// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZHgMKnoyhg3CNmpy6g9OrWwZ5D2y3RL0",
  authDomain: "testapp-8cba2.firebaseapp.com",
  projectId: "testapp-8cba2",
  storageBucket: "testapp-8cba2.firebasestorage.app",
  messagingSenderId: "1029780134103",
  appId: "1:1029780134103:web:3be684330f5a4844317892",
  measurementId: "G-2PKDFWYCZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;