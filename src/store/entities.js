import { combineReducers } from "redux";
import usersReducer from "./users";
import categoriesReducer from "./categories";
import productsReducer from "./products";

export default combineReducers({
  users: usersReducer,
  categories: categoriesReducer,
  products: productsReducer,
});
