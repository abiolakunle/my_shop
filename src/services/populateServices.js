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
