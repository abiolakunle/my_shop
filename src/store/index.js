import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "reducers/rootReducer";
import { getFirebase } from "react-redux-firebase";

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk.withExtraArgument({ getFirebase })))
);

export default store;
