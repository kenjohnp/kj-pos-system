import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "stockEntries",
  initialState: {
    list: [],
    selectedStockEntry: {},
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
    stockEntryReceived: (stockEntries, action) => {
      const { supplier, refNo, remarks, date, items } = action.payload;

      let newItems = [];
      for (let i = 0; i < items.length; i++)
        newItems.push({
          index: i,
          item: {
            label: items[i].description,
            value: items[i].productId,
          },
          qty: items[i].qty,
        });

      stockEntries.selectedStockEntry = {
        supplier: {
          value: supplier._id,
          label: supplier.name,
        },
        refNo,
        remarks,
        date,
        items: newItems,
      };

      stockEntries.loading = false;
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
    stockEntryCancelled: (stockEntries, action) => {
      const { _id } = action.payload;

      const index = stockEntries.list.findIndex(
        (stockEntry) => stockEntry._id === _id
      );

      if (index > -1) stockEntries.list[index].status = "Cancelled";

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
    selectedStockEntryCleared: (stockEntries, action) => {
      stockEntries.selectedStockEntry = {
        supplier: {
          label: "",
          value: "",
        },
        refNo: "",
        remarks: "",
        date: new Date().toDateString(),
        items: [{ index: 0, item: "", qty: 1 }],
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
  stockEntryReceived,
  stockEntriesReceived,
  stockEntriesRequestFailed,
  stockEntryAdded,
  stockEntryCancelled,
  setStockEntryErrors,
  errorsCleared,
  setApiError,
  setSuccess,
  selectedStockEntryCleared,
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

export const getStockEntry = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    onStart: stockEntriesRequested.type,
    onSuccess: stockEntryReceived.type,
    onError: setApiError.type,
  });

export const cancelStockEntry = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "put",
    onStart: stockEntriesRequested.type,
    onSuccess: stockEntryCancelled.type,
    onError: setApiError.type,
  });

export const clearErrors = () => (dispatch) => dispatch(errorsCleared());
export const clearSelectedStockEntry = () => (dispatch) =>
  dispatch(selectedStockEntryCleared());
