import { Button, FormControl } from "@themesberg/react-bootstrap";
import React from "react";

const FilterManageUser = ({ filterText, onFilter, onClear, title, placeholder }) => (
    <div className="d-flex justify-content-center align-items-center ">
        <FormControl
            className="input-text-user ps-3"
            id="search"
            type="text"
            placeholder={placeholder}
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
    </div>
);

export default FilterManageUser