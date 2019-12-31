import firebase from "firebase/index";

const db = firebase.firestore().collection("propertyValues");

export const add = propertyValue => {
  return db.add(propertyValue);
};

export const update = (id, property) => {
  return db.doc(id).set(property);
};

export const remove = id => {
  return db.doc(id).delete();
};

// const temp =  {name: "name", values: [{name: "name" ,value: "value"}, {name: "name", value: "value"}]}

// values: [{name: "name" ,value: "value"}, {name: "name", value: "value"}]
