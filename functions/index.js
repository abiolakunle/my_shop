const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pluralize = require("pluralize");
const cors = require("cors")({ origin: true });
admin.initializeApp(functions.config().firebase);

//add service
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

const addService = (entity, collection, id) => {
  console.log("Entity data", entity);
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
          console.log("doctRef", docRef);
          const entity = { ...value, [`${entityName}Id`]: docRef.id };
          const promise = addService(entity, collection);
          promises.push(promise);
        } else {
          const { id: docId, ...rest } = value;
          const entity = { ...rest, [`${entityName}Id`]: id };
          const promise = addService(entity, collection, docId);
          promises.push(promise);
        }
      });
    });

    return Promise.all(promises);
  });
};

// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addData = functions.https.onCall(
  ({ entity, collection, id }, context) => {
    return Promise.resolve(addService(entity, collection, id));
  }
);

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
