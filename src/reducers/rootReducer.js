import { combineReducers } from "redux";
import { signInReducer, signUpReducer } from "reducers/authReducer";
import { firebaseReducer, firestoreReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  firebaseReducer,
  firestoreReducer,
  signInReducer,
  signUpReducer
});

export default rootReducer;
