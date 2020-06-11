import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import validate from "../../utils/validate";
import { renderButton, renderInput } from "../common/renderForms";
import { useSelector, useDispatch } from "react-redux";
import { setUserErrors, addCategory } from "../../store/categories";
import Joi from "joi-browser";

const AddCategory = () => {
  const dispatch = useDispatch();
  const { errors, success } = useSelector((state) => state.entities.categories);

  const [category, setCategory] = useState({ name: "" });
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

  return (
    <Fragment>
      {success && <Redirect to="/categories" />}
      <h4 className="green-text left-align">Add Category</h4>
      <form className="col s8">
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
      </form>
    </Fragment>
  );
};

export default AddCategory;
