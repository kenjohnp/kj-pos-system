import { combineReducers } from "redux";
import usersReducer from "./users";
import categoriesReducer from "./categories";

export default combineReducers({
  users: usersReducer,
  categories: categoriesReducer,
});
