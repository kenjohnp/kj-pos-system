import React, { useEffect, Fragment } from "react";
import NavBar from "./components/navBar";
import SideNav from "./components/common/sideNav";
import Users from "./components/users";
import UserForm from "./components/userForm";
import { Route, Switch, Redirect } from "react-router-dom";
import M from "materialize-css";
import Footer from "./components/footer";

function App() {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <div className="row">
      <div className="col s12 p-0">
        <NavBar />
        <SideNav />
        <Switch>
          <Route path="/users/:id" component={UserForm}></Route>
          <Route path="/users" component={Users}></Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
