import React, { useState } from "react";
import { login } from "../services/authService";
import Input from "./common/input";

const Login = (props) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = ({ currentTarget: input }) => {
    const currentUser = { ...user };
    currentUser[input.name] = input.value;
    setUser(currentUser);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(user.username, user.password);
      const { state } = props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const currentErrors = { ...errors };
        currentErrors.username = ex.response.data;
        setErrors(currentErrors);
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <form
          className="col s12 l6 m10 xl5 mt-5"
          onSubmit={(e) => handleSubmit(e)}
        >
          <h5 className="green-text">Login</h5>
          <Input
            label="Username"
            placeholder="Enter Username"
            name="username"
            value={user["username"]}
            columnClass="col s12"
            onChange={(e) => handleChange(e)}
            type="text"
            error={errors["username"]}
          />
          <Input
            label="Password"
            placeholder="Enter Password"
            name="password"
            value={user["password"]}
            columnClass="col s12"
            onChange={(e) => handleChange(e)}
            type="password"
            error={errors["password"]}
          />
          <button className="waves-effect waves-light btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
