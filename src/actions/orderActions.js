import {
  UPDATE_DETAILS,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  REMOVE_PRODUCT,
  CLEAR_ORDER,
  FILL_ORDER
} from "constants/orderConstants";

export const updateDetails = details => {
  return { type: UPDATE_DETAILS, payload: details };
};

export const addProduct = product => {
  return { type: ADD_PRODUCT, payload: product };
};

export const editProduct = newData => {
  return { type: EDIT_PRODUCT, payload: newData };
};

export const removeProduct = productId => {
  return { type: REMOVE_PRODUCT, payload: productId };
};

export const clearOrder = () => {
  return { type: CLEAR_ORDER };
};

export const fillOrder = order => {
  return { type: FILL_ORDER, payload: order };
};
