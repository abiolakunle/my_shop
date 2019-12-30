import {
  ADD_VALUE_REQUEST,
  ADD_VALUE_SUCCESS,
  ADD_VALUE_FAILURE
} from "constants/propertyValueConstants";

import { request, success, failure } from "actions/requestActions";

import { add, update, remove } from "services/populatePropertyValues";

export const addValue = value => {
  return (dispatch, getState) => {
    dispatch(request(ADD_VALUE_REQUEST));

    add(value)
      .then(() => {
        console.log("value ", value, " added");
        dispatch(success(ADD_VALUE_SUCCESS, "Property value add"));
      })
      .catch(({ message }) => {
        dispatch(failure(ADD_VALUE_FAILURE, message));
        console.error("add property error", message);
      });
  };
};

export const updateValue = (id, value) => {
  return (dispatch, getState) => {
    console.log("prop update", id, value);

    update(id, value)
      .then(docRef => {
        console.log("Prop value ", value, " updated");
      })
      .catch(({ message }) => {
        console.error("update property error ", message);
      });
  };
};

export const removeValue = ({ id }) => {
  return (dispatch, getState) => {
    remove(id)
      .then(() => {
        console.log("value  deleted ", id);
      })
      .catch(({ message }) => {
        console.error("delete value error ", message);
      });
  };
};
