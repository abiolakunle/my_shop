import firebase from "firebase/index";
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

export const addService = (entity, type, updateId) => {
  const entityName = pluralize.singular(type);
  let fields = getFields(entity);
  let relations = getRelations(entity);

  let action = updateId
    ? firestore
        .collection(type)
        .doc(updateId)
        .set(fields)
    : firestore.collection(type).add(fields);

  return action.then(docRef => {
    relations.forEach(relation => {
      const key = Object.keys(relation)[0];
      const values = relation[key];
      values.forEach(value => {
        if (docRef) {
          addService({ ...value, [`${entityName}Id`]: docRef.id }, key);
        } else {
          const { id, ...rest } = value;
          addService({ ...rest }, key, id);
        }
      });
    });
  });
};

export const updateService = (entity, type, updateId) => {
  return addService(entity, type, updateId);
};

export const removeService = (type, { id, ...rest }) => {
  const relations = getRelations({ ...rest });

  return firestore
    .collection(type)
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
