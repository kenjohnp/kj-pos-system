import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loadTransactions } from "../../store/transactions";
import getPagedData from "../../utils/getPagedData";
import PageTitle from "../common/pageTitle";
import Search from "../common/search";
import Pagination from "../common/pagination";
import Loader from "../common/loader";
import HistoryTable from "./historyTable";

const TransactionsHistory = () => {
  const dispatch = useDispatch();

  const { list: transactions, loading, errors } = useSelector(
    (state) => state.entities.transactions
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({
    path: "transactionNo",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    pageSize: 10,
    currentPage: 1,
  });

  useEffect(() => {
    dispatch(loadTransactions());
  }, [dispatch]);

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
    data: transactions,
    searchQuery,
    searchFields: ["transactionNo"],
    sortColumn,
    pagination,
  });

  const { pageSize, currentPage } = pagination;

  return (
    <>
      <PageTitle title="Transactions History" />
      {errors.apiError.message && (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      )}
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/transaction"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <Search
          searchQuery={searchQuery}
          onChange={handleChange}
          placeholder="Enter Transaction No."
        />
      </div>
      <Loader loading={loading} />
      <HistoryTable data={data} onSort={handleSort} sortColumn={sortColumn} />
      <Pagination
        itemsCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default TransactionsHistory;
