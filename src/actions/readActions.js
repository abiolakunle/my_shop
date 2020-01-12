import { GET_REQUEST, GET_SUCCESS, GET_FAILURE } from "constants/getConstants";
import { request, success, failure } from "actions/requestActions";

import { getService, getAllService } from "services/readServices";

export const get = (collection, id) => {
  return relations => {
    return (dispatch, getState) => {
      dispatch(request(GET_REQUEST));
      getService(collection, id, relations)
        .then(data => {
          dispatch(success(GET_SUCCESS, data));
        })
        .catch(({ message }) => {
          dispatch(failure(GET_FAILURE, message));
        });
    };
  };
};

export const getAll = collection => {
  return relations => {
    return (dispatch, getState) => {
      dispatch(request(GET_REQUEST));
      getAllService(collection, relations)
        .then(({ data }) => {
          dispatch(success(GET_SUCCESS, data));
        })
        .catch(({ message }) => {
          dispatch(failure(GET_FAILURE, message));
        });
    };
  };
};
