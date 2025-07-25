//------------------------------------
// Firebase Configuration
//------------------------------------

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDsRhOOceEZYG21e5FW97uma5jGPev9ttU",
  authDomain: "birthday-app-19510.firebaseapp.com",
  databaseURL: "https://birthday-app-19510-default-rtdb.firebaseio.com",
  projectId: "birthday-app-19510",
  storageBucket: "birthday-app-19510.appspot.com",
  messagingSenderId: "140365973995",
  appId: "1:140365973995:web:68a9ba8c3651b71356f1ae"
};

// Initialize Firebase 
firebase.initializeApp(firebaseConfig);

// Connecting the authentication and database 
const auth = firebase.auth();
const database = firebase.database();
