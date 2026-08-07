import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="search-bar">
    <FaSearch />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default SearchBar;
