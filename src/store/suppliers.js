import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "suppliers",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    errors: {
      apiError: {},
      formErrors: {},
    },
    success: false,
  },
  reducers: {
    suppliersRequested: (suppliers, action) => {
      suppliers.loading = true;
    },
    suppliersReceived: (suppliers, action) => {
      suppliers.list = action.payload;
      suppliers.loading = false;
      suppliers.lastFetch = Date.now();
    },
    suppliersRequestFailed: (suppliers, action) => {
      suppliers.errors.apiError = action.payload.errors;
      suppliers.loading = false;
    },
    supplierAdded: (suppliers, action) => {
      suppliers.list.push(action.payload);
      suppliers.success = false;
      suppliers.loading = false;
    },
    supplierRemoved: (suppliers, action) => {
      suppliers.list = suppliers.filter(
        (supplier) => supplier._id !== action.payload._id
      );
      suppliers.loading = false;
    },
    supplierUpdated: (suppliers, action) => {
      const { _id } = action.payload;
      const index = suppliers.list.findIndex(
        (supplier) => supplier._id === _id
      );

      if (index > -1)
        for (let key in action.payload)
          suppliers.list[index][key] = action.payload[key];

      suppliers.success = true;
      suppliers.loading = false;
    },
    setSupplierErrors: (suppliers, action) => {
      suppliers.errors.formErrors = action.payload.errors;
    },
    errorsCleared: (suppliers, action) => {
      suppliers.errors = {
        formErrors: {},
        apiError: {},
      };
    },
    setApiError: (suppliers, action) => {
      suppliers.errors.apiError = action.payload.errors;
      suppliers.loading = false;
    },
    setSuccess: (suppliers, action) => {
      suppliers.success = action.payload;
    },
  },
});

export const {
  suppliersRequested,
  suppliersReceived,
  suppliersRequestFailed,
  supplierAdded,
  supplierRemoved,
  supplierUpdated,
  setSupplierErrors,
  errorsCleared,
  setApiError,
  setSuccess,
} = slice.actions;

export default slice.reducer;

//ACTION CREATORS
const url = "/suppliers";

export const loadSuppliers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.suppliers;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: suppliersRequested.type,
      onSuccess: suppliersReceived.type,
      onError: suppliersRequestFailed.type,
    })
  );
};

export const addSupplier = (supplier) =>
  apiCallBegan({
    url,
    method: "post",
    data: supplier,
    onStart: suppliersRequested.type,
    onSuccess: supplierAdded.type,
    onError: setApiError.type,
  });

export const removeSupplier = (supplier) =>
  apiCallBegan({
    url: `${url}/${supplier._id}`,
    method: "delete",
    onStart: suppliersRequested.type,
    onSuccess: supplierRemoved.type,
    onError: supplierRemoved.type,
  });

export const updateSupplier = (supplier) =>
  apiCallBegan({
    url: `${url}/${supplier._id}`,
    method: "put",
    data: supplier,
    onStart: suppliersRequested.type,
  });

export const clearErrors = () => (dispatch) => dispatch(errorsCleared());
