import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    selectedTransaction: {},
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
      transactions.loading = false;
    },
    transactionsRequested: (transactions, action) => {
      transactions.loading = true;
    },
    transactionReceived: (transactions, action) => {
      transactions.selectedTransaction = action.payload;
      const {
        totalAmount,
        vat,
        subTotal,
        totalDiscount,
      } = action.payload.amountSummary;

      const { items } = transactions.selectedTransaction;

      for (let i = 0; i < items.length; i++) {
        items[i].index = i;
        items[i].discount = items[i].discount.toString();
      }

      transactions.selectedTransaction.amountSummary = {
        discount: {
          label: "Total Discount",
          value: totalDiscount,
        },
        vat: { label: "VAT", value: vat },
        subTotal: {
          label: "Sub-Total",
          value: subTotal,
        },
        total: {
          label: "Total Sales",
          value: totalAmount,
        },
      };

      transactions.loading = false;
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
      transactions.success = true;
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
    setApiError: (transactions, action) => {
      transactions.errors.apiError = action.payload.errors;
      transactions.loading = false;
    },
    successClosed: (transactions, action) => {
      transactions.success = false;
    },
  },
});

export const {
  idAdded,
  transactionsRequested,
  transactionReceived,
  transactionsReceived,
  transactionsRequestFailed,
  transactionAdded,
  transactionErrorsSet,
  errorsCleared,
  setApiError,
  successClosed,
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

export const loadTransactions = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.transactions;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: transactionsRequested.type,
      onSuccess: transactionsReceived.type,
      onError: transactionsRequestFailed.type,
    })
  );
};

export const addTransaction = (transaction) =>
  apiCallBegan({
    url,
    method: "post",
    data: transaction,
    onStart: transactionsRequested.type,
    onSuccess: transactionAdded.type,
    onError: setApiError.type,
  });

export const getTransaction = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    onStart: transactionsRequested.type,
    onSuccess: transactionReceived.type,
    onError: setApiError.type,
  });
