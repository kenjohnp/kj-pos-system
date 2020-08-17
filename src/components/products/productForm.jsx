import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import PageTitle from "../common/pageTitle";
import { renderInput, renderButton } from "../common/renderForms";
import Select from "../common/select";
import Loader from "../common/loader";
import {
  setProductErrors,
  addProduct,
  getProduct,
  updateProduct,
  clearErrors,
  clearSelectedProduct,
} from "../../store/products";
import { loadCategories } from "../../store/categories";

const ProductForm = ({ match }) => {
  const dispatch = useDispatch();
  const { success, errors, selectedProduct, loading } = useSelector(
    (state) => state.entities.products
  );
  const { list: categories } = useSelector(
    (state) => state.entities.categories
  );

  const initialValue = {
    description: "",
    barcode: "",
    category: "",
    price: 0,
    inStock: 0,
  };

  const [product, setProduct] = useState(initialValue);
  const [redirectToProducts, setRedirectToProducts] = useState(false);

  const schema = {
    description: Joi.string().required().label("Description"),
    category: Joi.string().required().label("Category"),
    barcode: Joi.string().allow("").label("Barcode"),
    price: Joi.number().min(0).required().label("Price"),
    inStock: Joi.number().min(0).required().label("Initial Stock"),
  };

  useEffect(() => {
    dispatch(loadCategories());

    if (match.params.id !== "new")
      dispatch(getProduct({ _id: match.params.id }));

    return () => {
      dispatch(clearErrors());
      dispatch(clearSelectedProduct());
    };
  }, []);

  useEffect(() => {
    const product = { ...selectedProduct };
    if (product.category) {
      const { _id, name } = product.category;
      product.category = {
        value: _id,
        label: name,
      };
    }
    setProduct(product);
  }, [selectedProduct]);

  const handleChange = ({ currentTarget: input }) => {
    const newProduct = { ...product };
    newProduct[input.name] = input.value;
    setProduct(newProduct);
  };

  const handleChangeSelect = (selectedItem) => {
    const newProduct = { ...product };
    newProduct.category = {
      value: selectedItem.value,
      label: selectedItem.label,
    };
    setProduct(newProduct);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { description, category, barcode, price, inStock } = product;

    const payload = {
      description,
      barcode,
      price,
      inStock,
      category: category.value,
    };

    let formErrors = validate(payload, schema);
    dispatch(setProductErrors({ errors: formErrors || {} }));

    if (formErrors) return;

    if (match.params.id === "new") dispatch(addProduct(payload));
    else
      dispatch(
        updateProduct({
          _id: match.params.id,
          ...payload,
        })
      );
  };

  const cancel = () => {
    setRedirectToProducts(true);
  };

  const options = categories.map((c) => ({ label: c.name, value: c._id }));

  return (
    <>
      {(redirectToProducts || success) && <Redirect to="/products" />}
      <PageTitle
        title={match.params.id === "new" ? "New Product" : "Edit Product"}
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
            name: "barcode",
            label: "Barcode",
            customClass: "col s12",
            placeholder: "Enter Barcode (Optional)",
            data: product["barcode"],
            error: errors.formErrors["barcode"],
            onChange: (e) => handleChange(e),
            autoFocus: true,
          })}
          {renderInput({
            name: "description",
            label: "Description",
            customClass: "col s12",
            placeholder: "Enter Description",
            data: product["description"],
            error: errors.formErrors["description"],
            onChange: (e) => handleChange(e),
          })}
          {renderInput({
            name: "price",
            label: "Price",
            customClass: "col s12",
            placeholder: "Enter Price",
            data: product["price"],
            error: errors.formErrors["price"],
            onChange: (e) => handleChange(e),
            type: "number",
            min: 0,
          })}
          {renderInput({
            name: "inStock",
            label: "Initial Stock",
            customClass: "col s12",
            placeholder: "Enter Initial Stock",
            data: product["inStock"],
            error: errors.formErrors["inStock"],
            onChange: (e) => handleChange(e),
            type: "number",
            min: 0,
          })}
          <Select
            options={options}
            value={product["category"]}
            placeHolder="Select Category..."
            onChange={(selectedItem) => handleChangeSelect(selectedItem)}
            error={errors.formErrors["category"]}
            label="Category"
          />
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

export default ProductForm;
