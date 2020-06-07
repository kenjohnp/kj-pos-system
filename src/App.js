import React, { useEffect, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import NavBar from "./components/navBar";
import SideNav from "./components/common/sideNav";
import Users from "./components/users/users";
import UserForm from "./components/users/userForm";
import UserResetPassword from "./components/users/userResetPassword";
import ChangeName from "./components/users/changeName";
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
            <Route path="/login" component={Login}></Route>
            <Route path="/logout" component={Logout}></Route>
            <ProtectedRoute
              path="/users/resetpassword/:id"
              component={UserResetPassword}
            ></ProtectedRoute>
            <ProtectedRoute
              path="/users/changename/:id"
              component={ChangeName}
            ></ProtectedRoute>
            <ProtectedRoute
              path="/users/new"
              component={UserForm}
            ></ProtectedRoute>
            <ProtectedRoute path="/users" component={Users}></ProtectedRoute>
            <ProtectedRoute path="/" exact component={Users} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
