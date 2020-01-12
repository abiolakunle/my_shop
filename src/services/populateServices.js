import { firebaseApp } from "firebase/index";

export const functionsAdd = data => {
  return firebaseApp.functions().httpsCallable("addData")(data);
};

export const addService = (collection, entity, id) => {
  return functionsAdd({ entity, collection, id });
};

export const updateService = (collection, { id, ...rest }) => {
  const entity = { ...rest };
  return addService(collection, entity, id);
};

const functionsRemove = data => {
  return firebaseApp.functions().httpsCallable("removeData")(data);
};

export const removeService = (collection, entity) => {
  return functionsRemove({ collection, entity });
};

const functionGet = data => {
  return firebaseApp.functions().httpsCallable("getData")(data);
};

export const getService = (collection, id, relations) => {
  return functionGet({ collection, id, relations }).then(result => {
    console.log("getREsult", result);
  });
};

const functionGetAll = data => {
  return firebaseApp.functions().httpsCallable("getAllData")(data);
};

export const getAllService = (collection, relations) => {
  return functionGetAll({ collection, relations }).then(result => {
    console.log("getAllREsult", result);
  });
};
