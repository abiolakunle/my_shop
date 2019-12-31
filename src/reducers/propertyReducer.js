import {
  ADD_PROP_REQUEST,
  ADD_PROP_SUCCESS,
  ADD_PROP_FAILURE
} from "constants/propertyConstants";

const intialState = {
  adding: false,
  added: false,
  error: false,
  message: ""
};

const propertyReducer = (state = intialState, action) => {
  switch (action.type) {
    case ADD_PROP_REQUEST:
      return { ...state, adding: true, added: false, error: false };
    case ADD_PROP_SUCCESS:
      return {
        ...state,
        adding: false,
        added: true,
        error: false,
        message: action.payload
      };
    case ADD_PROP_FAILURE:
      return {
        ...state,
        adding: false,
        added: false,
        error: true,
        message: action.payload
      };
    default:
      return { ...state };
  }
};

export default propertyReducer;
