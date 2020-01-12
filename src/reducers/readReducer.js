import { GET_REQUEST, GET_SUCCESS, GET_FAILURE } from "constants/getConstants";
const initialState = {
  reading: false,
  read: false,
  error: false,
  message: ""
};

const readReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_REQUEST:
      return { ...state, reading: true, read: false, error: false };
    case GET_SUCCESS:
      return {
        ...state,
        reading: false,
        read: true,
        error: false,
        data: payload
      };
    case GET_FAILURE:
      return {
        ...state,
        reading: false,
        read: false,
        error: true,
        message: payload
      };
    default:
      return { ...state };
  }
};

export default readReducer;
