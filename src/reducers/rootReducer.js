import { combineReducers } from "redux";
import authReducer from "reducers/authReducer";
import populateReducer from "reducers/populateReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  firebaseReducer,
  firestoreReducer,
  authReducer,
  populateReducer
});

export default rootReducer;
