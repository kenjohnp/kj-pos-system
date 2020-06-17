import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import { setUserErrors, addCategory } from "../../store/categories";
import { renderButton, renderInput } from "../common/renderForms";
import PageTitle from "../common/pageTitle";
import Loader from "../common/loader";

const AddCategory = () => {
  const dispatch = useDispatch();
  const { errors, success, loading } = useSelector(
    (state) => state.entities.categories
  );

  const [category, setCategory] = useState({ name: "" });
  const [redirect, setRedirect] = useState(false);

  const schema = {
    name: Joi.string().required().label("Category Name"),
  };

  const handleChange = ({ currentTarget: input }) => {
    const newCategory = { ...category };
    newCategory[input.name] = input.value;
    setCategory(newCategory);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = validate(category, schema);
    dispatch(setUserErrors({ errors: formErrors || {} }));

    if (formErrors) return;

    dispatch(addCategory({ name: category.name, enabled: true }));
  };

  const cancel = () => {
    setRedirect(true);
  };

  return (
    <Fragment>
      {(redirect || success) && <Redirect to="/categories" />}
      <PageTitle title="Add Category" />
      {loading && <Loader className="left-align" />}
      <div className="row">
        <form className="col s8">
          {errors.apiError.message && (
            <div className="statusBox red white-text mb-1">
              {errors.apiError.message}
            </div>
          )}
          {renderInput({
            name: "name",
            label: "Category Name",
            customClass: "col s6",
            placeholder: "Enter New Category",
            data: category["name"],
            error: errors.formErrors["name"],
            onChange: (e) => handleChange(e),
          })}
          {renderButton("Submit", (e) => handleSubmit(e))}
          {renderButton("Cancel", cancel, "green lighten-5 black-text ml-1")}
        </form>
      </div>
    </Fragment>
  );
};

export default AddCategory;
