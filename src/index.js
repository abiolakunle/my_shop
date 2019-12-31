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
import { createFirestoreInstance } from "redux-firestore";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { alertOptions } from "helpers/alert";

const reactReduxfirebaseProps = {
  firebase,
  config: firebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};
ReactDOM.render(
  <ReactReduxFirebaseProvider {...reactReduxfirebaseProps}>
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App />
        </AlertProvider>
      </Provider>
    </SnackbarProvider>
  </ReactReduxFirebaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
