import {
  ADD_PROP_REQUEST,
  ADD_PROP_SUCCESS,
  ADD_PROP_FAILURE
} from "constants/propertyConstants";

import { request, success, failure } from "actions/requestActions";

import { add, update, remove } from "services/populateProperty";
import {
  addValue,
  updateValue,
  removeValue
} from "actions/propertyValueActions";

export const addProperty = ({ values, ...rest }) => {
  return (dispatch, getState) => {
    dispatch(request(ADD_PROP_REQUEST));

    add({ ...rest })
      .then(({ id }) => {
        dispatch(success(ADD_PROP_SUCCESS, "Property added"));
        values.forEach(value => {
          dispatch(addValue({ name: value, propertyId: id }));
        });
        console.log("add prop success");
      })
      .catch(({ message }) => {
        dispatch(failure(ADD_PROP_FAILURE, message));
        console.error("add property error", message);
      });
  };
};

export const updateProperty = (id, { values, ...rest }) => {
  return (dispatch, getState) => {
    console.log("prop update", id, rest);
    update(id, rest)
      .then(docRef => {
        console.log("Prop updated", docRef);
        values.forEach(({ id: valueId, ...rest }) => {
          console.log("rest", { ...rest });
          if (valueId) {
            dispatch(updateValue(valueId, { ...rest }));
          } else {
            dispatch(addValue({ propertyId: id, ...rest }));
          }
        });
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
