import {
  POPULATE_REQUEST,
  POPULATE_SUCCESS,
  POPULATE_FAILURE
} from "constants/populateConstants";

const intialState = {
  sending: false,
  sent: false,
  error: false,
  message: ""
};

const populateReducer = (state = intialState, action) => {
  switch (action.type) {
    case POPULATE_REQUEST:
      return { ...state, sending: true, sent: false, error: false };
    case POPULATE_SUCCESS:
      return {
        ...state,
        sending: false,
        sent: true,
        error: false,
        message: action.payload
      };
    case POPULATE_FAILURE:
      return {
        ...state,
        sending: false,
        sent: false,
        error: true,
        message: action.payload
      };
    default:
      return { ...state };
  }
};

export default populateReducer;
