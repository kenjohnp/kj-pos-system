import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    errors: {
      apiError: {},
      formErrors: {},
    },
  },
  reducers: {
    categoriesRequested: (categories, action) => {
      categories.loading = true;
    },
    categoriesReceived: (categories, action) => {
      categories.list = action.payload;
      categories.loading = false;
      categories.lastFetch = Date.now();
    },
    categoriesRequestFailed: (categories, action) => {
      categories.errors.apiError = action.payload.errors;
      categories.loading = false;
    },
    categoryAdded: (categories, action) => {
      categories.list.push(action.payload);
      categories.success = true;
    },
    categoryRemoved: (categories, action) => {
      categories.list = categories.list.filter(
        (category) => category._id !== action.payload._id
      );
    },
    categoryUpdated: (categories, action) => {
      const { _id } = action.payload;
      const index = categories.list.findIndex(
        (category) => category._id === _id
      );

      for (let key in action.payload)
        categories.list[index][key] = action.payload[key];
    },
    setUserErrors: (categories, action) => {
      categories.errors.formErrors = action.payload.errors;
    },
    setApiError: (categories, action) => {
      categories.errors.apiError = action.payload.errors;
      categories.loading = false;
    },
    setSuccess: (categories, action) => {
      categories.success = action.payload;
    },
  },
});

export const {
  categoryAdded,
  categoryRemoved,
  categoryUpdated,
  categoriesReceived,
  categoriesRequested,
  categoriesRequestFailed,
  setUserErrors,
  setApiError,
  setSuccess,
} = slice.actions;

export default slice.reducer;

//ACTION CREATORS
const url = "/categories";

export const loadCategories = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.categories;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: categoriesRequested.type,
      onSuccess: categoriesReceived.type,
      onError: categoriesRequestFailed.type,
    })
  );
};

export const addCategory = (category) =>
  apiCallBegan({
    url,
    method: "post",
    data: category,
    onStart: categoriesRequested.type,
    onSuccess: categoryAdded.type,
    onError: setApiError.type,
  });

export const removeCategory = (category) =>
  apiCallBegan({
    url: `${url}/${category._id}`,
    method: "delete",
    data: category,
    onStart: categoriesRequested.type,
    onSuccess: categoryRemoved.type,
    onError: setApiError.type,
  });

export const updateCategory = (category) =>
  apiCallBegan({
    url: `${url}/${category._id}`,
    method: "put",
    data: category,
    onSuccess: categoryUpdated.type,
    onError: setApiError.type,
  });
