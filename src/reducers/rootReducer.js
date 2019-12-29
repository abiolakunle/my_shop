import { combineReducers } from "redux";
import { authReducer } from "reducers/authReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  firebaseReducer,
  firestoreReducer,
  authReducer
});

export default rootReducer;
