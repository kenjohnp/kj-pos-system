import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loadStockEntries, setSuccess } from "../../store/stockEntries";
import PageTitle from "../common/pageTitle";
import Search from "../common/search";
import StockEntriesTable from "./stockEntriesTable";

const StockEntries = () => {
  const dispatch = useDispatch();
  const { list: stockEntries, loading, errors } = useSelector(
    (state) => state.entities.stockEntries
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({
    path: "date",
    order: "desc",
  });

  useEffect(() => {
    dispatch(loadStockEntries());
    dispatch(setSuccess(false));
  }, []);

  const handleChange = () => {};

  return (
    <>
      <PageTitle title="Stock Entries" />
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/stockentries/new"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <Search searchQuery={searchQuery} onChange={handleChange} />
      </div>
      <StockEntriesTable stockEntries={stockEntries} sortColumn={sortColumn} />
    </>
  );
};

export default StockEntries;
