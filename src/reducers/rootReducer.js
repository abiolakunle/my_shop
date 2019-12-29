import { combineReducers } from "redux";
import { authReducer, signUpReducer } from "reducers/authReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  firebaseReducer,
  firestoreReducer,
  authReducer,
  signUpReducer
});

export default rootReducer;
