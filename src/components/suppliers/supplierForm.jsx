import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import {
  setSupplierErrors,
  addSupplier,
  clearErrors,
  getSupplier,
  updateSupplier,
  clearSelectedSupplier,
} from "../../store/suppliers";
import PageTitle from "../common/pageTitle";
import { renderInput, renderButton } from "../common/renderForms";
import Loader from "../common/loader";

const SupplierForm = ({ match }) => {
  const dispatch = useDispatch();
  const { success, errors, loading, selectedSupplier } = useSelector(
    (state) => state.entities.suppliers
  );
  const [redirectToSuppliers, setRedirectToSuppliers] = useState(false);

  const initialValue = {
    name: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    fax: "",
    email: "",
  };

  const [supplier, setSupplier] = useState(initialValue);

  const schema = {
    name: Joi.string().max(255).required().label("Supplier Name"),
    address: Joi.string().allow("").max(255).label("Address"),
    contactPerson: Joi.string().allow("").max(255).label("Contact Person"),
    contactNumber: Joi.string().allow("").max(50).label("Contact Number"),
    fax: Joi.string().allow("").max(50).label("Fax"),
    email: Joi.string().email().allow("").max(255).label("Email"),
  };

  useEffect(() => {
    if (match.params.id !== "new")
      dispatch(getSupplier({ _id: match.params.id }));

    return () => {
      dispatch(clearErrors());
      dispatch(clearSelectedSupplier());
    };
  }, []);

  useEffect(() => {
    const supplier = { ...selectedSupplier };
    setSupplier(supplier);
  }, [selectedSupplier]);

  const handleChange = ({ currentTarget: input }) => {
    const newSupplier = { ...supplier };
    newSupplier[input.name] = input.value;
    setSupplier(newSupplier);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = validate(supplier, schema);
    dispatch(setSupplierErrors({ errors: formErrors || {} }));

    if (formErrors) return;

    if (match.params.id === "new") dispatch(addSupplier(supplier));
    else dispatch(updateSupplier({ _id: match.params.id, ...supplier }));
  };
  const cancel = () => {
    setRedirectToSuppliers(true);
  };

  return (
    <>
      {(success || redirectToSuppliers) && <Redirect to="/suppliers" />}
      <PageTitle
        title={match.params.id === "new" ? "New Supplier" : "Edit Supplier"}
      />
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
            label: "Supplier Name",
            customClass: "col s12",
            placeholder: "Enter Supplier Name",
            data: supplier["name"],
            error: errors.formErrors["name"],
            onChange: (e) => handleChange(e),
            autoFocus: true,
          })}
          {renderInput({
            name: "address",
            label: "Address",
            customClass: "col s12",
            placeholder: "Enter Address",
            data: supplier["address"],
            error: errors.formErrors["address"],
            onChange: (e) => handleChange(e),
          })}
          {renderInput({
            name: "contactPerson",
            label: "Contact Person",
            customClass: "col s12",
            placeholder: "Enter Contact Person",
            data: supplier["contactPerson"],
            error: errors.formErrors["contactPerson"],
            onChange: (e) => handleChange(e),
          })}
          {renderInput({
            name: "contactNumber",
            label: "Contact Number",
            customClass: "col s12",
            placeholder: "Enter Contact Number",
            data: supplier["contactNumber"],
            error: errors.formErrors["contactNumber"],
            onChange: (e) => handleChange(e),
          })}
          {renderInput({
            name: "fax",
            label: "Fax",
            customClass: "col s12",
            placeholder: "Enter Fax",
            data: supplier["fax"],
            error: errors.formErrors["fax"],
            onChange: (e) => handleChange(e),
          })}
          {renderInput({
            name: "email",
            label: "Email",
            customClass: "col s12",
            placeholder: "Enter Email",
            data: supplier["email"],
            error: errors.formErrors["email"],
            onChange: (e) => handleChange(e),
          })}
          {renderButton("Submit", (e) => handleSubmit(e))}
          {renderButton(
            "Cancel",
            (e) => cancel(e),
            "green lighten-5 black-text ml-1"
          )}
        </form>
      </div>
    </>
  );
};

export default SupplierForm;
