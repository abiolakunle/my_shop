import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR
} from "constants/authConstants";

const initialState = {
  signingIn: false,
  signedIn: false,
  error: false,
  message: ""
};

export const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return {
        signingIn: true,
        ...state
      };
    case SIGN_IN_SUCCESS:
      return {
        signingIn: false,
        signedIn: true
      };
    case SIGN_IN_ERROR:
      return {
        signingIn: false,
        error: true,
        message: action.payload
      };
    default:
      return { ...state };
  }
};

const initialStateSignUp = {
  signingUp: false,
  signedUp: false,
  error: false,
  message: ""
};

export const signUpReducer = (state = initialStateSignUp, action) => {
  switch (action.type) {
    case SIGN_UP_REQUEST:
      return {
        signingUp: true,
        error: false,
        signedUp: false,
        ...state
      };
    case SIGN_UP_SUCCESS:
      return {
        signingUp: false,
        error: false,
        signedUp: true
      };
    case SIGN_UP_ERROR:
      return {
        signingUp: false,
        error: true,
        message: action.payload
      };
    default:
      return { ...state };
  }
};
