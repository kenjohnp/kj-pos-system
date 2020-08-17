import React, { useEffect, useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import { addUser, setUserErrors, clearErrors } from "../../store/users";
import { useDispatch, useSelector } from "react-redux";
import {
  renderInput,
  renderButton,
  renderRadioButton,
} from "../common/renderForms";
import PageTitle from "../common/pageTitle";
import Loader from "../common/loader";

const UserForm = () => {
  const dispatch = useDispatch();
  const { success, errors, loading } = useSelector(
    (state) => state.entities.users
  );

  const initialValue = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    isAdmin: true,
  };

  const [user, setUser] = useState(initialValue);
  const [redirectToUsers, setRedirectToUsers] = useState(false);

  useEffect(() => {
    if (success) setUser(initialValue);
    return () => {
      dispatch(clearErrors());
    };
  }, []);

  const schema = {
    username: Joi.string().min(5).required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    isAdmin: Joi.boolean().required().label("isAdmin"),
  };

  const handleChange = ({ currentTarget: input }) => {
    const newUser = { ...user };
    newUser[input.name] = input.value;
    setUser(newUser);
  };

  const handleChangeRadio = ({ currentTarget: input }) => {
    const newUser = { ...user };
    newUser.isAdmin = input.name === "admin" ? true : false;
    setUser(newUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = validate(user, schema);
    dispatch(setUserErrors({ errors: formErrors || {} }));

    if (formErrors) return;

    dispatch(
      addUser({
        username: user.username,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin,
      })
    );
  };

  const cancel = () => {
    setRedirectToUsers(true);
  };

  return (
    <Fragment>
      {(redirectToUsers || success) && <Redirect to="/users" />}
      <PageTitle title="New User" />
      {loading && <Loader className="left-align" />}
      <div className="row">
        <form className="col s8">
          {errors.apiError.message && (
            <div className="statusBox red white-text mb-1">
              {errors.apiError.message}
            </div>
          )}
          {renderInput({
            name: "username",
            label: "Username",
            customClass: "col s12",
            placeholder: "Enter Username",
            data: user["username"],
            error: errors.formErrors["username"],
            onChange: (e) => handleChange(e),
            autoFocus: true,
          })}
          {renderInput({
            name: "password",
            label: "Password",
            customClass: "col s12",
            placeholder: "Enter Password",
            data: user["password"],
            error: errors.formErrors["password"],
            onChange: (e) => handleChange(e),
            type: "password",
          })}
          {renderInput({
            name: "firstname",
            label: "First Name",
            customClass: "col s6",
            placeholder: "Enter First Name",
            data: user["firstname"],
            error: errors.formErrors["firstname"],
            onChange: (e) => handleChange(e),
          })}
          {renderInput({
            name: "lastname",
            label: "Last Name",
            customClass: "col s6",
            placeholder: "Enter Last Name",
            data: user["lastname"],
            error: errors.formErrors["lastname"],
            onChange: (e) => handleChange(e),
          })}

          {renderRadioButton("admin", "Admin", user.isAdmin, (e) =>
            handleChangeRadio(e)
          )}
          {renderRadioButton("cashier", "Cashier", !user.isAdmin, (e) =>
            handleChangeRadio(e)
          )}
          {renderButton("Submit", (e) => handleSubmit(e))}
          {renderButton(
            "Cancel",
            (e) => cancel(e),
            "green lighten-5 black-text ml-1"
          )}
        </form>
      </div>
    </Fragment>
  );
};

export default UserForm;
