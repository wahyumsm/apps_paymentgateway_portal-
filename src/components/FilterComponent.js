import { Button, FormControl } from "@themesberg/react-bootstrap";
import React from "react";
import search from "../assets/icon/search_icon.svg"

const FilterComponent = ({ filterText, onFilter, onClear, title, placeholder }) => (
    <div className="d-flex justify-content-center align-items-center mb-4">
        <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>{title} </div>
        <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
            <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
            <FormControl
                className="ps-5"
                id="search"
                type="text"
                placeholder={placeholder}
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
            />
        </div>
        {/* <Button type="button" onClick={onClear}>
            X
        </Button> */}
    </div>
);

export default FilterComponent