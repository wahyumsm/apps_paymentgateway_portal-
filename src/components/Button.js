import React, { useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import { convertTimeDigit } from "../function/helpers";

function Button ({v1, v2, onSetHour, onSetMinute}) {

    const onPlus = () => {
        if(v1 < 23) {
            onSetHour(v1+1)
        } else {
            onSetHour(0)
        }
    }

    const onMinus = () => {
        if (v1 > 0) {
          onSetHour(v1-1)
        } else {
          onSetHour(23)
        }
    }

    const onPlusMin = () => {
        if(v2 < 59) {
          onSetMinute(v2 + 1)
        } else {
          onSetMinute(0)
        }
    }

    const onMinusMin = () => {
        if (v2 > 0) {
          onSetMinute(v2 - 1)
        } else {
          onSetMinute(59)
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="counting d-flex flex-column align-items-center">
                <button className="plus text-center" style={{border: "unset", background: "unset"}} onClick={onPlus}><FontAwesomeIcon icon={faChevronUp} color="#848484" /></button>
                <div type="number" className="count text-center px-2 my-2" style={{background: "#F0F0F0", borderRadius: 4}} name="qty">{convertTimeDigit(v1)}</div>
                <button className="minus text-center" style={{border: "unset", background: "unset"}} onClick={onMinus}><FontAwesomeIcon icon={faChevronDown} color="#848484" /></button>          
            </div>
            <div className="mx-3">:</div>
            <div className="counting d-flex flex-column align-items-center">
                <button className="plus text-center" style={{border: "unset", background: "unset"}} onClick={onPlusMin}><FontAwesomeIcon icon={faChevronUp} color="#848484" /></button>
                <div type="number" className="count text-center px-2 my-2" style={{background: "#F0F0F0", borderRadius: 4}} name="qty">{convertTimeDigit(v2)}</div>
                <button className="minus text-center" style={{border: "unset", background: "unset"}} onClick={onMinusMin}><FontAwesomeIcon icon={faChevronDown} color="#848484" /></button>          
            </div>
        </div>
    )
}

Button.prototype = {
  v1: Number.isRequired,
  v2: Number.isRequired,
  onSetHour: Function.isRequired,
  onSetMinute: Function.isRequired
}

export default Button