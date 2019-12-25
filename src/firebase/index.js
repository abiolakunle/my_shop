import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig);
//firebase.fireStore();

export default firebase;
