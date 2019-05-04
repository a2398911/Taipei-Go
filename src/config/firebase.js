import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var config = {
  apiKey: "AIzaSyBn3pXilO3MKEkuclWVN5cjZqzV-e4L3kM",
  authDomain: "test-36e1e.firebaseapp.com",
  databaseURL: "https://test-36e1e.firebaseio.com",
  projectId: "test-36e1e",
  storageBucket: "test-36e1e.appspot.com",
  messagingSenderId: "1093187294145"
};

firebase.initializeApp(config);

export const fireAuth = firebase.auth();
export default firebase;

