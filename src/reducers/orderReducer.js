import {
  UPDATE_DETAILS,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  REMOVE_PRODUCT,
  CLEAR_ORDER,
  FILL_ORDER
} from "constants/orderConstants";

const initialState = {
  id: "",
  details: {
    customerName: "",
    customerAddress: "",
    date: new Date().toString()
  },
  orderProducts: []
};

const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_DETAILS:
      return { ...state, details: { ...state.details, ...payload } };
    case ADD_PRODUCT:
      return { ...state, orderProducts: [...state.orderProducts, payload] };
    case EDIT_PRODUCT:
      const data = [...state.orderProducts];
      data[data.findIndex(d => d.id === payload.id)] = payload;
      return { ...state, orderProducts: data };
    case REMOVE_PRODUCT:
      const productsTemp = state.orderProducts.filter(({ id }) => {
        return id !== payload;
      });
      return { ...state, orderProducts: productsTemp };

    case CLEAR_ORDER:
      return { initialState };

    case FILL_ORDER:
      return { ...payload };
    default:
      return { ...state };
  }
};

export default orderReducer;
