import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getUser,
  setUserErrors,
  updateUser,
  clearErrors,
} from "../../store/users";
import validate from "../../utils/validate";
import Joi from "joi-browser";
import { renderInput, renderButton } from "../common/renderForms";
import PageTitle from "../common/pageTitle";
import Loader from "../common/loader";

const ChangeName = ({ match }) => {
  const dispatch = useDispatch();

  const { errors, success, selectedUser, loading } = useSelector(
    (state) => state.entities.users
  );

  const [user, setUser] = useState({ firstname: "", lastname: "" });
  const [redirectToUsers, setRedirectToUsers] = useState(false);

  const schema = {
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
  };

  useEffect(() => {
    setUser(selectedUser);
    dispatch(getUser({ _id: match.params.id }));
    return () => {
      dispatch(clearErrors());
    };
  }, []);

  useEffect(() => {
    setUser(selectedUser);
  }, [selectedUser]);

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

    dispatch(
      updateUser({
        _id: match.params.id,
        firstname: user.firstname,
        lastname: user.lastname,
      })
    );
  };

  const cancel = () => {
    setRedirectToUsers(true);
  };

  return (
    <Fragment>
      {(redirectToUsers || success) && <Redirect to="/users" />}
      <PageTitle title="Change Name" />
      {errors.apiError.message && (
        <div className="statusBox red white-text mb-1">
          {errors.apiError.message}
        </div>
      )}
      {console.log("loading:", loading)}
      {loading && <Loader className="left-align" />}
      <div className="row">
        <form className="col s8">
          {renderInput({
            name: "firstname",
            label: "First Name",
            placeholder: "Enter First Name",
            customClass: "col s6",
            data: user["firstname"],
            error: errors.formErrors["firstname"],
            onChange: (e) => handleChange(e),
            autoFocus: true,
          })}
          {renderInput({
            name: "lastname",
            label: "Last Name",
            placeholder: "Enter Last Name",
            customClass: "col s6",
            data: user["lastname"],
            error: errors.formErrors["lastname"],
            onChange: (e) => handleChange(e),
          })}
          {renderButton("Submit", (e) => handleSubmit(e))}
          {renderButton(
            "Cancel",
            () => cancel(),
            "green lighten-5 black-text ml-1"
          )}
        </form>
      </div>
    </Fragment>
  );
};

export default ChangeName;
