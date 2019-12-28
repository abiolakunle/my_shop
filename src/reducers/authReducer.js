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
      return { ...state, signingIn: true, error: false };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        signingIn: false,
        signedIn: true,
        message: action.payload
      };
    case SIGN_IN_ERROR:
      return {
        ...state,
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
      return { ...state, signingUp: true, error: false, signedUp: false };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signingUp: false,
        error: false,
        signedUp: true,
        message: action.payload
      };
    case SIGN_UP_ERROR:
      return {
        ...state,
        signingUp: false,
        error: true,
        message: action.payload
      };
    default:
      return { ...state };
  }
};
