import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "products",
  initialState: {
    list: [],
    selectedProduct: {
      description: "",
      barcode: "",
      category: "",
      price: 0,
      inStock: 0,
    },
    loading: false,
    lastFetch: null,
    errors: {
      apiError: {},
      formErrors: {},
    },
  },
  reducers: {
    productsRequested: (products, action) => {
      products.loading = true;
    },
    productReceived: (products, action) => {
      products.selectedProduct = action.payload;
    },
    productsReceived: (products, action) => {
      products.list = action.payload;
      products.loading = false;
      products.lastFetch = Date.now();
    },
    productsRequestFailed: (products, action) => {
      console.log("failed");
      products.errors.apiError = action.payload.errors;
      products.loading = false;
    },
    productAdded: (products, action) => {
      products.list.push(action.payload);
      products.success = true;
    },
    productRemoved: (products, action) => {
      products.list = products.list.filter(
        (product) => product._id !== action.payload._id
      );
    },
    productUpdated: (products, action) => {
      const { _id } = action.payload;

      const index = products.list.findIndex((product) => product._id === _id);

      if (index > -1) {
        for (let key in action.payload)
          products.list[index][key] = action.payload[key];
      }

      products.success = true;
    },
    setProductErrors: (products, action) => {
      products.errors.formErrors = action.payload.errors;
    },
    setApiError: (products, action) => {
      products.errors.apiError = action.payload.errors;
    },
    setSuccess: (products, action) => {
      products.success = action.payload;
    },
  },
});

export const {
  productsRequested,
  productReceived,
  productsReceived,
  productsRequestFailed,
  productAdded,
  productUpdated,
  productRemoved,
  setProductErrors,
  setApiError,
  setSuccess,
} = slice.actions;

export default slice.reducer;

//ACTION CREATORS
const url = "/products";

export const loadProducts = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.products;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: productsRequested.type,
      onSuccess: productsReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};

export const addProduct = (product) =>
  apiCallBegan({
    url,
    method: "post",
    data: product,
    onSuccess: productAdded.type,
    onError: setApiError.type,
  });

export const removeProduct = (product) =>
  apiCallBegan({
    url: `${url}/${product._id}`,
    method: "delete",
    onSuccess: productRemoved.type,
    onError: setApiError.type,
  });

export const updateProduct = (product) =>
  apiCallBegan({
    url: `${url}/${product._id}`,
    method: "put",
    data: product,
    onSuccess: productUpdated.type,
    onError: setApiError.type,
  });

export const getProduct = (product) =>
  apiCallBegan({
    url: `${url}/${product._id}`,
    onStart: productsRequested.type,
    onSuccess: productReceived.type,
    onError: setApiError.type,
  });
