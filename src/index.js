import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import store from "store/index";
import { SnackbarProvider } from "notistack";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import firebaseConfig from "firebase/config";
import firebase from "firebase/index";

const reactReduxfirebaseProps = {
  firebase,
  config: firebaseConfig,
  dispatch: store.dispatch
  // createFirestoreInstance // <- needed if using firestore
};
ReactDOM.render(
  <ReactReduxFirebaseProvider {...reactReduxfirebaseProps}>
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </ReactReduxFirebaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
