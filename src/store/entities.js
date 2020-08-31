import { combineReducers } from "redux";
import usersReducer from "./users";
import categoriesReducer from "./categories";
import productsReducer from "./products";
import suppliersReducer from "./suppliers";
import stockEntriesReducer from "./stockEntries";
import transactionsReducer from "./transactions";

export default combineReducers({
  users: usersReducer,
  categories: categoriesReducer,
  products: productsReducer,
  suppliers: suppliersReducer,
  stockEntries: stockEntriesReducer,
  transactions: transactionsReducer,
});
