import { combineReducers } from "redux";
import authReducer from "reducers/authReducer";
import populateReducer from "reducers/populateReducer";
import orderReducer from "reducers/orderReducer";
import readReducer from "reducers/readReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  firebaseReducer,
  firestoreReducer,
  authReducer,
  populateReducer,
  orderReducer,
  readReducer
});

export default rootReducer;
