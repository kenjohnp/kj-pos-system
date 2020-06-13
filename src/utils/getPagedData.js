import _ from "lodash";
import { paginate } from "./paginate";

const getPagedData = ({
  data,
  searchQuery,
  sortColumn,
  pagination,
  searchFields,
}) => {
  let filtered = data;

  if (searchQuery)
    filtered = data.filter((d) => {
      let result;

      for (let key of searchFields) {
        result = d[key].toLowerCase().startsWith(searchQuery.toLowerCase());
        if (result) return result;
      }
    });

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const paginatedCategories = paginate(
    sorted,
    pagination.currentPage,
    pagination.pageSize
  );

  return { totalCount: sorted.length, data: paginatedCategories };
};

export default getPagedData;
