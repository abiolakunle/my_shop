import {
  POPULATE_REQUEST,
  POPULATE_SUCCESS,
  POPULATE_FAILURE
} from "constants/populateConstants";

import { request, success, failure } from "actions/requestActions";

import {
  addService,
  updateService,
  removeService
} from "services/populateServices";

export const add = collection => {
  return entity => {
    return (dispatch, getState) => {
      dispatch(request(POPULATE_REQUEST));
      addService(entity, collection)
        .then(() => {
          dispatch(
            success(POPULATE_SUCCESS, `${entity.name} added to ${collection}`)
          );
        })
        .catch(({ message }) => {
          dispatch(failure(POPULATE_FAILURE, message));
        });
    };
  };
};

export const update = collection => {
  return (id, entity) => {
    return (dispatch, getState) => {
      dispatch(request(POPULATE_REQUEST));
      updateService(entity, collection, id)
        .then(() => {
          dispatch(
            success(POPULATE_SUCCESS, `${entity.name} update in ${collection}`)
          );
        })
        .catch(({ message }) => {
          dispatch(failure(POPULATE_FAILURE, message));
        });
    };
  };
};

export const remove = collection => {
  return ({ id, name }) => {
    return (dispatch, getState) => {
      dispatch(request(POPULATE_REQUEST));
      removeService(collection, id)
        .then(() => {
          dispatch(
            success(POPULATE_SUCCESS, `${name} deleted from ${collection}`)
          );
        })
        .catch(({ message }) => {
          dispatch(failure(POPULATE_FAILURE, message));
        });
    };
  };
};
