import React, { useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";

function Button () {
    const [value, setValue] = useState(20)
    const [value2, setValue2] = useState(10)

    const onPlus = () => {
        if(value < 23) {
            setValue(value+1)
        } else {
            setValue(0)
        }
    }

    const onMinus = () => {
        setValue(value-1)
    }

    const onPlusMin = () => {
        setValue2(value2 + 1)
    }

    const onMinusMin = () => {
        setValue2(value2 - 1)
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="counting d-flex flex-column align-items-center">
                <button className="plus text-center" style={{border: "unset", background: "unset"}} onClick={onPlus}><FontAwesomeIcon icon={faChevronUp} color="#848484" /></button>
                <div type="number" className="count text-center px-2 my-2" style={{background: "#F0F0F0", borderRadius: 4}} name="qty">{value}</div>
                <button className="minus text-center" style={{border: "unset", background: "unset"}} onClick={onMinus}><FontAwesomeIcon icon={faChevronDown} color="#848484" /></button>          
            </div>
            <div className="mx-3">:</div>
            <div className="counting d-flex flex-column align-items-center">
                <button className="plus text-center" style={{border: "unset", background: "unset"}} onClick={onPlusMin}><FontAwesomeIcon icon={faChevronUp} color="#848484" /></button>
                <div type="number" className="count text-center px-2 my-2" style={{background: "#F0F0F0", borderRadius: 4}} name="qty">{value2}</div>
                <button className="minus text-center" style={{border: "unset", background: "unset"}} onClick={onMinusMin}><FontAwesomeIcon icon={faChevronDown} color="#848484" /></button>          
            </div>
        </div>
    )
}

export default Button