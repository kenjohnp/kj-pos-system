import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;

const slice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    userAdded: (users, action) => {
      const { username, password, firstname, lastname, role } = action.payload;

      const user = action.payload;

      const userInDb = users.find((u) => u._id == user._id);

      console.log(userInDb);
      if (!userInDb) {
        users.push({
          _id: ++lastId,
          username,
          password,
          firstname,
          lastname,
          role,
        });
      } else {
        userInDb.firstname = user.firstname;
        userInDb.lastname = user.lastname;
        userInDb.username = user.username;
        userInDb.password = user.password;
        userInDb.role = user.role;
      }
    },
    userRemoved: (users, action) => {
      return users.filter((user) => user._id != action.payload._id);
    },
  },
});

export const { userAdded, userRemoved } = slice.actions;
export default slice.reducer;
