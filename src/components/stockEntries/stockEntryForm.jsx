import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSuppliers } from "../../store/suppliers";
import PageTitle from "../common/pageTitle";
import Select from "../common/select";
import M from "materialize-css";
import moment from "moment";

const StockEntryForm = () => {
  const dispatch = useDispatch();
  const { list: suppliers } = useSelector((state) => state.entities.suppliers);

  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    dispatch(loadSuppliers());
  }, []);

  useEffect(() => {
    const elems = document.querySelectorAll(".datepicker");
    M.Datepicker.init(elems, {
      defaultDate: new Date(),
      setDefaultDate: new Date(),
      autoClose: true,
      format: "mm/dd/yyyy",
    });
  });

  const suppliersOptions = suppliers.map((s) => ({
    label: s.name,
    value: s._id,
  }));
  return (
    <>
      <PageTitle title="Stock Entry" />

      <div className="row">
        <form className="col s8">
          <Select
            options={suppliersOptions}
            placeHolder="Select Supplier"
            label="Supplier"
          />
          <label>Date</label>
          <input type="text" className="datepicker" />
        </form>
      </div>
    </>
  );
};

export default StockEntryForm;
