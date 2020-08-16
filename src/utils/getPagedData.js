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
        const splitKey = key.split(".");

        if (splitKey.length === 1) result = d[splitKey[0]];
        else result = d[splitKey[0]][splitKey[1]];

        result = result.toLowerCase().startsWith(searchQuery.toLowerCase());

        if (result) return result;
      }
    });

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const paginatedData = paginate(
    sorted,
    pagination.currentPage,
    pagination.pageSize
  );

  return { totalCount: sorted.length, data: paginatedData };
};

export default getPagedData;
