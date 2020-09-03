import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import { setApiError } from "./stockEntries";

const slice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    currentNo: null,
    loading: false,
    lastFetch: null,
    errors: {
      apiError: {},
      formErrors: {},
    },
    success: false,
  },
  reducers: {
    idAdded: (transactions, action) => {
      transactions.currentNo = action.payload;
    },
    transactionsRequested: (transactions, action) => {
      transactions.loading = true;
    },
    transactionsReceived: (transactions, action) => {
      transactions.list = action.payload;
      transactions.loading = false;
      transactions.lastFetch = Date.now();
    },
    transactionsRequestFailed: (transactions, action) => {
      transactions.errors.apiError = action.payload.errors;
      transactions.loading = false;
    },
    transactionAdded: (transactions, action) => {
      transactions.list.push(action.payload);
      transactions.loading = false;
    },
    transactionErrorsSet: (transactions, action) => {
      transactions.errors.formErrors = action.payload.errors;
    },
    errorsCleared: (transactions, action) => {
      transactions.errors = {
        formErrors: {},
        apiError: {},
      };
    },
  },
});

export const {
  idAdded,
  transactionsRequested,
  transactionsReceived,
  transactionsRequestFailed,
  transactionAdded,
  transactionErrorsSet,
  errorsCleared,
} = slice.actions;

export default slice.reducer;

//ACTION CREATORS

const url = "/transactions";

export const generateTransactionId = () =>
  apiCallBegan({
    url: `${url}/generateId`,
    onStart: transactionsRequested.type,
    onSuccess: idAdded.type,
    onError: setApiError.type,
  });

export const clearErrors = () => (dispatch) => dispatch(errorsCleared());
