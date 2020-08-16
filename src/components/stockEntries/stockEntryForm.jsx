import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import DatePicker from "../common/datepicker";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import { getCurrentUser } from "../../services/authService";
import { loadSuppliers } from "../../store/suppliers";
import { loadProducts } from "../../store/products";
import PageTitle from "../common/pageTitle";
import Select from "../common/select";
import { renderInput, renderButton } from "../common/renderForms";
import Loader from "../common/loader";
import StockItems from "./stockItems";
import {
  setStockEntryErrors,
  addStockEntry,
  clearErrors,
} from "../../store/stockEntries";

const StockEntryForm = () => {
  const dispatch = useDispatch();
  const { list: suppliers } = useSelector((state) => state.entities.suppliers);
  const { success, errors, loading } = useSelector(
    (state) => state.entities.stockEntries
  );

  const [stockEntry, setStockEntry] = useState({
    supplier: {
      label: "",
      value: "",
    },
    refNo: "",
    remarks: "",
    date: new Date(),
    items: [{ index: 0, item: "", qty: 1 }],
  });
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    dispatch(loadSuppliers());
    dispatch(loadProducts());

    return () => {
      dispatch(clearErrors());
    };
  }, []);

  const schema = {
    supplier: Joi.object({
      _id: Joi.string().required().label("Supplier ID"),
      name: Joi.string().required().label("Supplier Name"),
    })
      .required()
      .label("Supplier"),

    refNo: Joi.string().required().label("Reference Number"),
    remarks: Joi.string().allow("").label("Remarks"),
    date: Joi.date().required().label("Date"),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required().label("Product ID"),
          description: Joi.string().required().label("Product Description"),
          qty: Joi.number().min(0).required().label("Quantity"),
        }).required()
      )
      .required(),
  };

  const suppliersOptions = suppliers.map((s) => ({
    label: s.name,
    value: s._id,
  }));

  const handleChangeText = ({ currentTarget: input }) => {
    const newStockEntry = { ...stockEntry };
    newStockEntry[input.name] = input.value;
    setStockEntry(newStockEntry);
  };

  const handleChangeSupplier = (selectedSupplier) => {
    const newStockEntry = { ...stockEntry };
    newStockEntry.supplier = selectedSupplier;
    setStockEntry(newStockEntry);
  };

  const handleChangeDate = (date) => {
    const newStockEntry = { ...stockEntry };
    newStockEntry.date = date;
    setStockEntry(newStockEntry);
  };

  const handleChangeItem = (path, index, value) => {
    const newStockEntry = { ...stockEntry };
    newStockEntry.items[index][path] = value;
    setStockEntry(newStockEntry);

    if (stockEntry.items[stockEntry.items.length - 1].item !== "")
      handleAddItem();
  };

  const handleAddItem = () => {
    const newStockEntry = { ...stockEntry };
    newStockEntry.items.push({
      item: "",
      qty: 1,
      index: newStockEntry.items.length,
    });
    setStockEntry(newStockEntry);
  };

  const handleDelete = (index) => {
    const newStockEntry = { ...stockEntry };

    newStockEntry.items.splice(index, 1);

    setStockEntry(newStockEntry);
    resetIndex();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payloadItems = stockEntry.items.map((i) => ({
      productId: i.item.value,
      description: i.item.label,
      qty: i.qty,
    }));

    payloadItems.pop();

    const payload = {
      supplier: {
        _id: stockEntry.supplier.value,
        name: stockEntry.supplier.label,
      },
      date: stockEntry.date.toDateString(),
      refNo: stockEntry.refNo,
      remarks: stockEntry.remarks,
      items: payloadItems,
      stockInBy: getCurrentUser().username,
    };

    let formErrors = validate(payload, schema);
    dispatch(setStockEntryErrors({ errors: formErrors || {} }));

    if (formErrors) return;

    dispatch(addStockEntry(payload));
  };

  const cancel = () => {
    setRedirect(true);
  };

  const resetIndex = () => {
    const newStockEntry = { ...stockEntry };

    for (let i = 0; i < newStockEntry.items.length; i++)
      newStockEntry.items[i].index = i;

    setStockEntry(newStockEntry);
  };

  return (
    <>
      {(redirect || success) && <Redirect to="/stockEntries" />}
      <PageTitle title="New Stock Entry" />
      {loading && <Loader className="left-align" />}
      <div className="row">
        <form className="col s8">
          {errors.apiError.message && (
            <div className="statusBox red white-text mb-1">
              {errors.apiError.message}
            </div>
          )}
          <Select
            options={suppliersOptions}
            placeHolder="Select Supplier"
            label="Supplier"
            value={stockEntry.supplier}
            onChange={handleChangeSupplier}
            error={errors.formErrors["supplier"]}
          />

          <DatePicker
            selected={stockEntry.date}
            onChange={handleChangeDate}
            error={errors.formErrors["date"]}
          />
          {renderInput({
            name: "remarks",
            label: "Remarks",
            placeholder: "Enter Remarks",
            data: stockEntry.remarks,
            disableRow: true,
            onChange: handleChangeText,
            error: errors.formErrors["remarks"],
          })}
          {renderInput({
            name: "refNo",
            label: "Reference No.",
            placeholder: "Enter Reference No.",
            data: stockEntry.refNo,
            disableRow: true,
            onChange: handleChangeText,
            error: errors.formErrors["refNo"],
          })}
          <h6>Items</h6>
          {errors.formErrors["items"] && (
            <div className="red-text">{errors.formErrors["items"]}</div>
          )}
          <StockItems
            items={stockEntry.items}
            onChange={handleChangeItem}
            onDelete={handleDelete}
          />
          {renderButton("Submit", (e) => handleSubmit(e))}
          {renderButton("Cancel", cancel, "green lighten-5 black-text ml-1")}
        </form>
      </div>
    </>
  );
};

export default StockEntryForm;
