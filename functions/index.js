const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pluralize = require("pluralize");
const cors = require("cors")({ origin: true });
admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
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

const addService = (collection, entity, id) => {
  const entityName = pluralize.singular(collection);
  let fields = getFields(entity);
  let relations = getRelations(entity);

  let action = id
    ? firestore
        .collection(collection)
        .doc(id)
        .set(fields)
    : firestore.collection(collection).add(fields);

  return action.then(docRef => {
    const promises = [];
    relations.forEach(relation => {
      const collection = Object.keys(relation)[0];
      const values = relation[collection];
      values.forEach(value => {
        if (docRef.id) {
          const entity = { ...value, [`${entityName}Id`]: docRef.id };
          const promise = addService(collection, entity);
          promises.push(promise);
        } else {
          const { id: docId, ...rest } = value;
          const entity = { ...rest, [`${entityName}Id`]: id };
          const promise = addService(collection, entity, docId);
          promises.push(promise);
        }
      });
    });

    return Promise.all(promises);
  });
};

const removeService = (collection, { id, ...rest }) => {
  const relations = getRelations({ ...rest });

  return firestore
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      const promises = [];
      relations.forEach(relation => {
        const key = Object.keys(relation)[0];
        const values = relation[key];
        values.forEach(value => {
          const promise = removeService(key, { id: value.id });
          promises.push(promise);
        });
      });
      return Promise.all(promises);
    });
};

const getData = (collection, id, relations = [], data) => {
  const collectionId = pluralize.singular(collection) + "Id";

  const allPromises = [];
  if (!data) {
    const entityPromise = firestore
      .collection(collection)
      .doc(id)
      .get()
      .then(doc => {
        return { ...doc.data(), id: doc.id };
      });
    allPromises.push(entityPromise);
  }

  const relationPromises = [];
  relations.forEach(relation => {
    const promise = firestore
      .collection(relation)
      .where(collectionId, "==", id)
      .get()
      .then(querySnapshot => {
        const docs = [];
        querySnapshot.forEach(doc => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        return docs;
      });
    relationPromises.push(promise);
  });
  allPromises.push(Promise.all(relationPromises));

  return Promise.all(allPromises).then(results => {
    const entity = data ? data : results[0];

    results[data ? 0 : 1].forEach((result, index) => {
      if (!Object.hasOwnProperty([relations[index]]))
        Object.assign(entity, { [relations[index]]: [] });

      entity[relations[index]] = [...result];
    });
    return entity;
  });

  // .then(doc => {
  //   Object.assign(entity, doc.data());
  //   console.log("Entity 1", doc.data());
  //   return doc.data();
  // });

  // .then(querySnapshot => {
  //   querySnapshot.forEach(doc => {
  //     console.log("relation", index, "data", doc.data());
  //     entity[relation].push(doc.data());
  //   });
  //   return doc.data();
  // });
};

const getAllData = (collection, relations = []) => {
  return firestore
    .collection(collection)
    .get()
    .then(querySnapshot => {
      const promises = [];
      querySnapshot.forEach(doc => {
        const promise = getData(collection, doc.id, relations, doc.data());
        promises.push(promise);
      });
      return Promise.all(promises);
    });
};

// exports
exports.addData = functions.https.onCall(
  ({ entity, collection, id }, context) => {
    return Promise.resolve(addService(collection, entity, id));
  }
);

exports.removeData = functions.https.onCall(
  ({ entity, collection }, context) => {
    return Promise.resolve(removeService(collection, entity));
  }
);

exports.getData = functions.https.onCall(
  ({ collection, id, relations }, context) => {
    return Promise.resolve(getData(collection, id, relations));
  }
);

exports.getAllData = functions.https.onCall(
  ({ collection, relations }, context) => {
    return Promise.resolve(getAllData(collection, relations));
  }
);

// exports.productWrite = functions.firestore
//   .document("products")
//   .onWrite((change, context) => {
//     console.log();
//   });

// const { Logging } = require("@google-cloud/logging");

// // ...

// // Instantiate the StackDriver Logging SDK. The project ID will
// // be automatically inferred from the Cloud Functions environment.
// const logging = new Logging();
// const log = logging.log("my-custom-log-name");

// // This metadata is attached to each log entry. This specifies a fake
// // Cloud Function called 'Custom Metrics' in order to make your custom
// // log entries appear in the Cloud Functions logs viewer.
// const METADATA = {
//   resource: {
//     type: "cloud_function",
//     labels: {
//       function_name: "CustomMetrics",
//       region: "us-central1"
//     }
//   }
// };

// // ...

// // Data to write to the log. This can be a JSON object with any properties
// // of the event you want to record.
// const data = {
//   event: "my-event",
//   value: "foo-bar-baz",

//   // Optional 'message' property will show up in the Firebase
//   // console and other human-readable logging surfaces
//   message: "my-event: foo-bar-baz"
// };

// // Write to the log. The log.write() call returns a Promise if you want to
// // make sure that the log was written successfully.
// const entry = log.entry(METADATA, data);
// log.write(entry);
