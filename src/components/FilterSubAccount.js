import { FormControl } from "@themesberg/react-bootstrap";
import React from "react";
import search from "../assets/icon/search_icon.svg"

const FilterSubAccount = ({ filterText, onFilter, title, placeholder }) => (
    <>
        <div style={{ fontFamily: 'Nunito', fontSize: 14}}>{title}</div>
        <div className="d-flex justify-content-between align-items-center position-relative mt-2 mb-3" style={{width: "100%"}}>
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
    </>
);

export default FilterSubAccount