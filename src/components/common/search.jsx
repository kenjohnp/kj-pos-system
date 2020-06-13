import React from "react";
import Input from "./input";

const Search = ({ searchQuery, onChange }) => {
  return (
    <Input
      customClass="col s4 right-align"
      icon="search"
      value={searchQuery}
      onChange={onChange}
      placeholder="Search"
    />
  );
};

export default Search;
