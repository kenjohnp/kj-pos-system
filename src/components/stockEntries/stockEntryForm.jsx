import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import DatePicker from "../common/datepicker";
import Joi from "joi-browser";
import _ from "lodash";
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
  getStockEntry,
  clearSelectedStockEntry,
  cancelStockEntry,
} from "../../store/stockEntries";

const StockEntryForm = ({ match }) => {
  const dispatch = useDispatch();
  const { list: suppliers } = useSelector((state) => state.entities.suppliers);

  const { success, errors, loading, selectedStockEntry } = useSelector(
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
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    dispatch(loadSuppliers());
    dispatch(loadProducts());

    if (match.params.id !== "new") {
      dispatch(getStockEntry(match.params.id));
      setReadOnly(true);
    }

    return () => {
      dispatch(clearErrors());
      dispatch(clearSelectedStockEntry());
    };
  }, []);

  useEffect(() => {
    mapSelectedToState();
  }, [selectedStockEntry]);

  const mapSelectedToState = () => {
    if (!_.isEmpty(selectedStockEntry) && match.params.id !== "new") {
      const newStockEntry = { ...selectedStockEntry };
      newStockEntry.date = new Date(selectedStockEntry.date);
      setStockEntry(newStockEntry);
    }
  };

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
    setRedirect(true);
  };

  const handleClickCancel = (e) => {
    e.preventDefault();

    dispatch(cancelStockEntry(match.params.id));
    setRedirect(true);
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
      <Loader className="left-align" loading={loading} />
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
            isDisabled={readOnly}
          />

          <DatePicker
            selected={stockEntry.date}
            onChange={handleChangeDate}
            error={errors.formErrors["date"]}
            readOnly={readOnly}
          />
          {renderInput({
            name: "remarks",
            label: "Remarks",
            placeholder: "Enter Remarks",
            data: stockEntry.remarks,
            disableRow: true,
            onChange: handleChangeText,
            error: errors.formErrors["remarks"],
            readOnly,
          })}
          {renderInput({
            name: "refNo",
            label: "Reference No.",
            placeholder: "Enter Reference No.",
            data: stockEntry.refNo,
            disableRow: true,
            onChange: handleChangeText,
            error: errors.formErrors["refNo"],
            readOnly,
          })}
          <h6>Items</h6>
          {errors.formErrors["items"] && (
            <div className="red-text">{errors.formErrors["items"]}</div>
          )}
          <StockItems
            items={stockEntry.items}
            onChange={handleChangeItem}
            onDelete={handleDelete}
            readOnly={readOnly}
          />
          {match.params.id === "new" &&
            renderButton("Submit", (e) => handleSubmit(e))}
          {match.params.id !== "new" &&
            selectedStockEntry.status !== "Cancelled" &&
            renderButton(
              "Cancel Entry",
              (e) => handleClickCancel(e),
              "red white-text ml-1"
            )}
          {renderButton(
            match.params.id === "new" ? "Cancel" : "Back",
            cancel,
            "green lighten-5 black-text ml-1"
          )}
        </form>
      </div>
    </>
  );
};

export default StockEntryForm;
