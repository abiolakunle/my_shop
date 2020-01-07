import {
  ADD_PROP_REQUEST,
  ADD_PROP_SUCCESS,
  ADD_PROP_FAILURE
} from "constants/propertyConstants";

import { request, success, failure } from "actions/requestActions";

import { remove } from "services/populateProperty";
import { add, update } from "services/populateServices";
import { addValue, updateValue } from "actions/propertyValueActions";

const type = "properties";

export const addProperty = property => {
  return (dispatch, getState) => {
    dispatch(request(ADD_PROP_REQUEST));

    add(property, type)
      .then(() => {
        dispatch(success(ADD_PROP_SUCCESS, `${property.name} property added`));
        console.log("add prop success");
      })
      .catch(({ message }) => {
        dispatch(failure(ADD_PROP_FAILURE, message));
        console.error("add property error", message);
      });
  };
};

export const updateProperty = (id, property) => {
  return (dispatch, getState) => {
    update(property, type, id)
      .then(docRef => {
        console.log("property update success", docRef);
      })
      .catch(({ message }) => {
        console.error("update property error ", message);
      });
  };
};

export const removeProperty = ({ id }) => {
  return (dispatch, getState) => {
    remove(id)
      .then(() => {
        console.log("property deleted ", id);
      })
      .catch(({ message }) => {
        console.error("delete property error ", message);
      });
  };
};
