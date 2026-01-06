// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkHBP0Bet2XCSi8YgSuO9fCiinsJwnPq0",
    authDomain: "maintenancetracker-760ce.firebaseapp.com",
    projectId: "maintenancetracker-760ce",
    storageBucket: "maintenancetracker-760ce.firebasestorage.app",
    messagingSenderId: "19930656320",
    appId: "1:19930656320:web:ea47cc84d7508d8fb879a5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

