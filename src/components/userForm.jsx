import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { addUser, setUserErrors } from "../store/users";
import { useDispatch, useSelector } from "react-redux";

import Input from "./common/input";

const UserForm = ({ match }) => {
  const users = useSelector((state) => state.entities.users);
  const errors = useSelector((state) => state.entities.users.errors);

  const [user, setUser] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    isAdmin: "admin",
  });

  const [redirectToUsers, setRedirectToUsers] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    populateUser();
    console.log(errors);
  }, []);

  const schema = {
    username: Joi.string().min(5).required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    isAdmin: Joi.string().required().label("isAdmin"),
  };

  const validate = () => {
    const { error } = Joi.validate(user, schema, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  const populateUser = () => {
    const userId = match.params.id;
    if (userId === "new") return;

    const getUser = users.find((user) => user._id == userId);
    mapToViewModel(getUser);
  };

  const mapToViewModel = (user) => {
    return {
      _id: user._id,
      username: user.username,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
      isAdmin: user.isAdmin,
    };
  };

  const handleChange = ({ currentTarget: input }) => {
    const newUser = { ...user };
    newUser[input.name] = input.value;
    setUser(newUser);
  };

  const handleChangeRadio = ({ currentTarget: input }) => {
    const newUser = { ...user };
    newUser.isAdmin = input.name === "admin";
    setUser(newUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = validate();
    dispatch(setUserErrors({ errors: formErrors || {} }));

    console.log(errors);
    if (formErrors) return;

    dispatch(
      addUser({
        username: user.username,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin === "admin",
      })
    );
  };

  const cancel = () => {
    setRedirectToUsers(true);
  };

  const renderInput = (
    name,
    label,
    customClass,
    placeholder = "",
    type = "text"
  ) => (
    <Input
      label={label}
      placeholder={placeholder}
      name={name}
      value={user[name]}
      columnClass={customClass}
      onChange={(e) => handleChange(e)}
      type={type}
      error={errors.formErrors[name]}
    />
  );

  return (
    <div className="container">
      {redirectToUsers && <Redirect to="/users" />}
      <h4>{match.params.id === "new" ? "New User" : "Edit User"}</h4>
      {errors.apiError.message && (
        <blockquote className="red white-text">
          {errors.apiError.message}
        </blockquote>
      )}
      <div className="row">
        <form className="col s8">
          <div className="row">
            {renderInput("username", "Username", "col s12", "Enter Username")}
          </div>
          <div className="row">
            {renderInput(
              "password",
              "Password",
              "col s12",
              "Enter Password",
              "password"
            )}
          </div>
          <div className="row">
            {renderInput(
              "firstname",
              "First Name",
              "col s6",
              "Enter First Name"
            )}
            {renderInput("lastname", "Last Name", "col s6", "Enter Last Name")}
          </div>
          <div className="row">
            <div className="input-field col s12">
              <p>
                <label>
                  <input
                    className="with-gap"
                    name="admin"
                    type="radio"
                    checked={user.isAdmin}
                    onChange={(e) => handleChangeRadio(e)}
                  />
                  <span>Admin</span>
                </label>
              </p>
              <p>
                <label>
                  <input
                    className="with-gap"
                    name="cashier"
                    type="radio"
                    checked={!user.isAdmin}
                    onChange={(e) => handleChangeRadio(e)}
                  />
                  <span>Cashier</span>
                </label>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button className="btn" onClick={(e) => handleSubmit(e)}>
                Submit
              </button>
              <button
                className="btn green lighten-5 black-text"
                onClick={(e) => cancel()}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
