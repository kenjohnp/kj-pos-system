import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "stockEntries",
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
    stockEntriesRequested: (stockEntries, action) => {
      stockEntries.loading = true;
    },
    stockEntriesReceived: (stockEntries, action) => {
      stockEntries.list = action.payload;
      stockEntries.loading = false;
      stockEntries.lastFetch = Date.now();
    },
    stockEntriesRequestFailed: (stockEntries, action) => {
      stockEntries.errors.apiError = action.payload.errors;
      stockEntries.loading = false;
    },
    stockEntryAdded: (stockEntries, action) => {
      stockEntries.list.push(action.payload);
      stockEntries.success = true;
      stockEntries.loading = false;
    },
    setStockEntryErrors: (stockEntries, action) => {
      stockEntries.errors.formErrors = action.payload.errors;
    },
    errorsCleared: (stockEntries, action) => {
      stockEntries.errors = {
        formErrors: {},
        apiError: {},
      };
    },
    setApiError: (stockEntries, action) => {
      stockEntries.errors.apiError = action.payload.errors;
      stockEntries.loading = false;
    },
    setSuccess: (stockEntries, action) => {
      stockEntries.success = action.payload;
    },
  },
});

export const {
  stockEntriesRequested,
  stockEntriesReceived,
  stockEntriesRequestFailed,
  stockEntryAdded,
  setStockEntryErrors,
  errorsCleared,
  setApiError,
  setSuccess,
} = slice.actions;

export default slice.reducer;

//ACTION CREATORS
const url = "/stockentries";

export const loadStockEntries = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.stockEntries;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: stockEntriesRequested.type,
      onSuccess: stockEntriesReceived.type,
      onError: stockEntriesRequestFailed.type,
    })
  );
};

export const addStockEntry = (stockEntry) =>
  apiCallBegan({
    url,
    method: "post",
    data: stockEntry,
    onStart: stockEntriesRequested.type,
    onSuccess: stockEntryAdded.type,
    onError: setApiError.type,
  });

export const clearErrors = () => (dispatch) => dispatch(errorsCleared());
