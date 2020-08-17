import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loadStockEntries, setSuccess } from "../../store/stockEntries";
import getPagedData from "../../utils/getPagedData";
import PageTitle from "../common/pageTitle";
import Search from "../common/search";
import Loader from "../common/loader";
import Pagination from "../common/pagination";
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
  const [pagination, setPagination] = useState({
    pageSize: 10,
    currentPage: 1,
  });

  useEffect(() => {
    dispatch(loadStockEntries());
    dispatch(setSuccess(false));
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setSearchQuery(input.value);
    const currentPagination = { ...pagination };
    currentPagination.currentPage = 1;
    setPagination(currentPagination);
  };

  const handlePageChange = (currentPage) => {
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const { totalCount, data } = getPagedData({
    data: stockEntries,
    searchQuery,
    searchFields: ["supplier.name", "remarks", "refNo"],
    sortColumn,
    pagination,
  });

  const { pageSize, currentPage } = pagination;

  return (
    <>
      <PageTitle title="Stock Entries" />
      {errors.apiError.message && (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      )}
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
      {loading && <Loader />}
      <StockEntriesTable
        stockEntries={data}
        sortColumn={sortColumn}
        onSort={(sortColumn) => handleSort(sortColumn)}
      />
      <Pagination
        itemsCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={(currentPage) => handlePageChange(currentPage)}
      />
    </>
  );
};

export default StockEntries;
