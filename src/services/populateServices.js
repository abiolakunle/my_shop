import firebase, { firebaseApp } from "firebase/index";

import pluralize from "pluralize";

const firestore = firebase.firestore();

const getFields = entity => {
  let fields = {};
  Object.keys(entity).forEach(key => {
    let isArray = entity[key] instanceof Array;
    if (!isArray) {
      fields = { ...fields, [key]: entity[key] };
    }
  });
  return fields;
};

const getRelations = entity => {
  let relations = [];
  Object.keys(entity).forEach(key => {
    let isArray = entity[key] instanceof Array;
    if (isArray) {
      relations.push({ [key]: [...entity[key]] });
    }
  });
  return relations;
};

export const functionsAdd = data => {
  return firebaseApp.functions().httpsCallable("addData")(data);
};

export const addService = (entity, collection, id) => {
  return functionsAdd({ entity, collection, id });
};

export const updateService = ({ id, ...rest }, collection) => {
  const entity = { ...rest };
  return addService(entity, collection, id);
};

export const removeService = (collection, { id, ...rest }) => {
  const relations = getRelations({ ...rest });

  return firestore
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      relations.forEach(relation => {
        const key = Object.keys(relation)[0];
        const values = relation[key];
        values.forEach(value => {
          removeService(key, { id: value.id });
        });
      });
    });
};
