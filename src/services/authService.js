import firebase from "firebase/index";

export const signIn = ({ email, password }) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signUp = ({ email, password }) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};
