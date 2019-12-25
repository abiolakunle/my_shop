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
  signIn as SignInService,
  signUp as SignUpService
} from "services/authService";

export const signIn = ({ userName, password }) => {};

export const signUp = credentials => {
  return (dispatch, getState) => {
    dispatch(request(SIGN_UP_REQUEST));

    SignUpService(credentials).then(response => {
      dispatch(success(SIGN_UP_SUCCESS));
      console.log("Sign up resonse", response);
    });
  };
};
