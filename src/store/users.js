import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "users",
  initialState: {
    list: [],
    selectedUser: {
      firstname: "",
      lastname: "",
      username: "",
    },
    loading: false,
    lastFetch: null,
    errors: {
      apiError: {},
      formErrors: {},
    },
    success: false,
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
    userReceived: (users, action) => {
      users.selectedUser = action.payload;
      users.loading = false;
    },
    usersRequestFailed: (users, action) => {
      users.errors.apiError = action.payload.errors;
      users.loading = false;
    },
    userAdded: (users, action) => {
      users.list.push(action.payload);
      users.success = true;
      users.loading = false;
    },
    userRemoved: (users, action) => {
      users.list = users.list.filter((user) => user._id !== action.payload._id);
      users.loading = false;
    },
    userUpdated: (users, action) => {
      const { _id } = action.payload;
      const index = users.list.findIndex((user) => user._id === _id);

      if (index > -1)
        for (let key in action.payload)
          users.list[index][key] = action.payload[key];
      users.loading = false;
      users.success = true;
    },
    userAdminToggled: (users, action) => {
      const { _id } = action.payload;
      const index = users.list.findIndex((user) => user._id === _id);

      users.list[index].isAdmin = action.payload.isAdmin;
    },
    setUserErrors: (users, action) => {
      users.errors.formErrors = action.payload.errors;
    },
    setApiError: (users, action) => {
      users.errors.apiError = action.payload.errors;
      users.loading = false;
    },
    errorsCleared: (users, action) => {
      users.errors = {
        apiError: {},
        formErrors: {},
      };
    },
    setSuccess: (users, action) => {
      users.success = action.payload;
    },
  },
});

export const {
  userAdded,
  userRemoved,
  userReceived,
  usersRequested,
  usersReceived,
  usersRequestFailed,
  userUpdated,
  userAdminToggled,
  setUserErrors,
  setApiError,
  errorsCleared,
  setSuccess,
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
    onStart: usersRequested.type,
    onSuccess: userAdded.type,
    onError: setApiError.type,
  });

export const deleteUser = (user) =>
  apiCallBegan({
    url: url + "/" + user._id,
    method: "delete",
    onStart: usersRequested.type,
    onSuccess: userRemoved.type,
    onError: setApiError.type,
  });

export const updateUser = (user) => {
  let onSuccess = null;
  let onStart = null;

  if (user.type === "toggleAdmin") {
    onSuccess = userAdminToggled.type;
    onStart = null;
  } else {
    onSuccess = userUpdated.type;
    onStart = usersRequested.type;
  }

  return apiCallBegan({
    url: `${url}/${user._id}`,
    method: "put",
    data: user,
    onStart: onStart,
    onSuccess: onSuccess,
    onError: setApiError.type,
  });
};

export const getUser = (user) =>
  apiCallBegan({
    url: url + "/" + user._id,
    onStart: usersRequested.type,
    onSuccess: userReceived.type,
    onError: setApiError.type,
  });

export const clearErrors = () => (dispatch) => dispatch(errorsCleared());
