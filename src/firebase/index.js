import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";

import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig);
//firebase.fireStore();
export const firebaseApp = firebase;

export default firebase;
