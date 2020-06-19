import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "imld-master.firebaseapp.com",
    databaseURL: "https://imld-master.firebaseio.com",
    projectId: "imld-master",
    storageBucket: "imld-master.appspot.com",
    messagingSenderId: "270381561427",
    appId: "1:270381561427:web:d0ed17b8ab76c0a25238a6",
    measurementId: "G-H3VD4Z4809"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const db = firebase.firestore();