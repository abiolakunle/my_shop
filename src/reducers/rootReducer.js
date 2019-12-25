import { combineReducers } from "redux";
import { signInReducer, signUpReducer } from "reducers/authReducer";

const rootReducer = combineReducers({ signInReducer, signUpReducer });

export default rootReducer;
