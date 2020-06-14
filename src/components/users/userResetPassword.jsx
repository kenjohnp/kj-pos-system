import React, { useState, Fragment, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, setUserErrors, clearErrors } from "../../store/users";
import { renderInput, renderButton } from "../common/renderForms";
import PageTitle from "../common/pageTitle";

const UserResetPassword = ({ match }) => {
  const dispatch = useDispatch();
  const { errors, success } = useSelector((state) => state.entities.users);

  const [user, setUser] = useState({ password: "" });
  const [redirectToUsers, setRedirectToUsers] = useState(false);

  const schema = {
    password: Joi.string().min(5).required().label("Password"),
  };

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    const newUser = { ...user };
    newUser[input.name] = input.value;
    setUser(newUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = validate(user, schema);
    dispatch(setUserErrors({ errors: formErrors || {} }));

    if (formErrors) return;

    dispatch(updateUser({ _id: match.params.id, password: user.password }));
  };

  const cancel = () => {
    setRedirectToUsers(true);
  };

  return (
    <Fragment>
      {(redirectToUsers || success) && <Redirect to="/users" />}
      <PageTitle title="Reset Password" />
      <form className="col s8">
        {renderInput({
          name: "password",
          label: "New Password",
          customClass: "col s6",
          placeholder: "Enter New Password",
          data: user["password"],
          error: errors.formErrors["password"],
          type: "password",
          onChange: (e) => handleChange(e),
        })}
        {renderButton("Submit", (e) => handleSubmit(e))}
        {renderButton(
          "Cancel",
          () => cancel(),
          "green lighten-5 black-text ml-1"
        )}
      </form>
    </Fragment>
  );
};

export default UserResetPassword;
