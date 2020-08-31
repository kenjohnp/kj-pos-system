import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "transactions",
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
  transactionsRequested,
  transactionsReceived,
  transactionsRequestFailed,
  transactionAdded,
  transactionErrorsSet,
  errorsCleared,
} = slice.actions;

export default slice.reducer;

//ACTION CREATORS

export const clearErrors = () => (dispatch) => dispatch(errorsCleared());
