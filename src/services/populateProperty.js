import firebase from "firebase/index";

const db = firebase.firestore().collection("properties");

export const add = property => {
  return db.add(property);
};

export const update = (id, property) => {
  return db.doc(id).set(property);
};

export const remove = id => {
  return db.doc(id).delete();
};
