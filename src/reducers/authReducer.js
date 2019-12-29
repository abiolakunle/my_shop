import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
  SIGN_OUT
} from "constants/authConstants";

const initialState = {
  signingIn: false,
  signedIn: false,
  signingUp: false,
  signInError: false,
  signedUp: false,
  signUpError: false,
  signedOut: false,
  message: ""
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return { ...state, signingIn: true, signInError: false };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        signingIn: false,
        signedOut: false,
        signedIn: true,
        signInError: false,
        message: action.payload
      };
    case SIGN_IN_ERROR:
      return {
        ...state,
        signInError: true,
        signingIn: false,
        message: action.payload
      };
    case SIGN_OUT:
      return { ...state, signedOut: true, signedIn: false, signedUp: false };
    case SIGN_UP_REQUEST:
      return { ...state, signingUp: true, signUpError: false, signedUp: false };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signingUp: false,
        signedUp: true,
        signUpError: false,
        message: action.payload
      };
    case SIGN_UP_ERROR:
      return {
        ...state,
        signingUp: false,
        signUpError: true,
        message: action.payload
      };
    default:
      return { ...state };
  }
};
