import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR
} from "constants/authConstants";

import { success, failure, request } from "actions/requestActions";
import {
  signIn as signInService,
  signUp as signUpService
} from "services/authService";
import firebase from "firebase/index";

export const signIn = credentials => {
  return (dispatch, getState) => {
    dispatch(request(SIGN_IN_REQUEST));
    signInService(credentials)
      .then(response => {
        firebase.auth().onAuthStateChanged(user => {
          dispatch(success(SIGN_IN_SUCCESS, "Sign in successful"));
        });
      })
      .catch(({ message }) => {
        dispatch(failure(SIGN_IN_ERROR, message));
        console.log("Sign in error", message);
      });
  };
};

export const signUp = credentials => {
  return (dispatch, getState) => {
    dispatch(request(SIGN_UP_REQUEST));

    signUpService(credentials)
      .then(response => {
        dispatch(success(SIGN_UP_SUCCESS, "Sign up successful"));
      })
      .catch(({ message }) => {
        dispatch(failure(SIGN_UP_ERROR, message));
        console.log("Sign up error", message);
      });
  };
};
