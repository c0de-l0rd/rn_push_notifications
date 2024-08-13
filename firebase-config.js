import firebase from 'firebase/compat/app'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyD21gW5Tk4woWmqVDZq8QArfvIiZER0hRk",
    authDomain: "credit-e1277.firebaseapp.com",
    databaseURL: 'https://credit-e1277-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: "credit-e1277",
    storageBucket: "credit-e1277.appspot.com",
    messagingSenderId: "571154225933",
    appId: "1:571154225933:web:2d5cc630423059e336ee44",
    measurementId: "G-DXVKVR1MF1"
  };

  if (firebase.apps.length == 0){
    firebase.initializeApp(firebaseConfig)
  }

  const db = getDatabase()

  export {db}