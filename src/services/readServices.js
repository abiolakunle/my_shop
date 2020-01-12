import { firebaseApp } from "firebase/index";

const functionGet = data => {
  return firebaseApp.functions().httpsCallable("getData")(data);
};

export const getService = (collection, id, relations) => {
  return functionGet({ collection, id, relations });
};

const functionGetAll = data => {
  return firebaseApp.functions().httpsCallable("getAllData")(data);
};

export const getAllService = (collection, relations) => {
  return functionGetAll({ collection, relations });
};
