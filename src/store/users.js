import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

let lastId = 0;

const slice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    errors: {},
  },
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
    },
    usersReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.lastFetch = Date.now();
    },
    usersRequestFailed: (users, action) => {
      users.loading = false;
    },
    userAdded: (users, action) => {
      users.list.push(action.payload);
    },
    userRemoved: (users, action) => {
      users.list = users.list.filter((user) => user._id !== action.payload._id);
    },
    userErrors: (users, action) => {
      users.errors = action.payload.errors;
      users.loading = false;
    },
    userApiError: (users, action) => {
      users.errors.apiError = action.payload;
      users.loading = false;
    },
  },
});

export const {
  userAdded,
  userRemoved,
  usersRequested,
  usersReceived,
  usersRequestFailed,
  userErrors,
  userApiError,
} = slice.actions;
export default slice.reducer;

//ACTION CREATORS
const url = "/users";

export const loadUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.users;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: usersRequested.type,
      onSuccess: usersReceived.type,
      onError: usersRequestFailed.type,
    })
  );
};

export const addUser = (user) =>
  apiCallBegan({
    url,
    method: "post",
    data: user,
    onSuccess: userAdded.type,
    onError: userApiError.type,
  });

export const deleteUser = (user) =>
  apiCallBegan({
    url: url + "/" + user._id,
    method: "delete",
    onSuccess: userRemoved.type,
    onError: userApiError.type,
  });
