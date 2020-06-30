import React, { useEffect, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import NavBar from "./components/navBar";
import SideNav from "./components/common/sideNav";
import Users from "./components/users/users";
import UserForm from "./components/users/userForm";
import UserResetPassword from "./components/users/userResetPassword";
import ChangeName from "./components/users/changeName";
import Categories from "./components/categories/categories";
import AddCategory from "./components/categories/addCategory";
import Products from "./components/products/products";
import ProductForm from "./components/products/productForm";
import Suppliers from "./components/suppliers/suppliers";
import SupplierForm from "./components/suppliers/supplierForm";
import StockEntries from "./components/stockEntries/stockEntries";
import StockEntryForm from "./components/stockEntries/stockEntryForm";
import Login from "./components/login";
import Logout from "./components/common/logout";
import { Route, Switch, Redirect } from "react-router-dom";
import M from "materialize-css";

function App() {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <div className="row">
      <div className="col s12 p-0">
        <NavBar />
        <div className="container">
          <SideNav />
          <ToastContainer />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute
              path="/users/resetpassword/:id"
              component={UserResetPassword}
            />
            <ProtectedRoute
              path="/users/changename/:id"
              component={ChangeName}
            />
            <ProtectedRoute path="/users/new" component={UserForm} />
            <ProtectedRoute path="/users" component={Users} />
            <ProtectedRoute path="/categories/new" component={AddCategory} />
            <ProtectedRoute path="/categories" component={Categories} />
            <ProtectedRoute path="/products/:id" component={ProductForm} />
            <ProtectedRoute path="/products" component={Products} />
            <ProtectedRoute path="/suppliers/:id" component={SupplierForm} />
            <ProtectedRoute path="/suppliers" component={Suppliers} />
            <ProtectedRoute
              path="/stockentries/:id"
              component={StockEntryForm}
            />
            <ProtectedRoute path="/stockentries" component={StockEntries} />
            <ProtectedRoute path="/" exact component={Users} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
