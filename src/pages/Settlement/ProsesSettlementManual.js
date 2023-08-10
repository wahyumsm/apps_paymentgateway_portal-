import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DataTable from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import { Form, Image } from '@themesberg/react-bootstrap'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"

const ProsesSettlementManual = () => {
    const [isChecked, setIsChecked] = useState(false)
    const handleChangeCheckBox = () => {
        setIsChecked(!isChecked)
    }

    const customStylesPartner = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );
    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Exclude Settlement Manual</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>Exclude Settlement Manual</h2>
            </div>
            <div className='base-content mt-3'>
                <div className='div-table pb-4'>
                    <table
                        className="table"
                        id="tableInvoice"
                        hover
                    >
                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                            <tr 
                                className='ms-3'  
                            >
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>
                                    <Form.Check
                                        id="statusId"
                                        type='checkbox'
                                        onChange={handleChangeCheckBox}
                                        checked={isChecked}
                                    />
                                </th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Name</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank / E-Money</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Count Trx</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Amount Trx</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Amount Fee</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Amount Settlement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='ps-3'>
                                    <Form.Check
                                        id="statusId"
                                        type='checkbox'
                                        onChange={handleChangeCheckBox}
                                        checked={isChecked}
                                    />
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                            </tr>
                            <tr>
                                <td className='ps-3'>
                                    <Form.Check
                                        id="statusId"
                                        type='checkbox'
                                        onChange={handleChangeCheckBox}
                                        checked={isChecked}
                                    />
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                                <td className='ps-3'>
                                    hai
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div
                className="mb-5 mt-3"
                style={{ display: "flex", justifyContent: "end" }}
            >
                <button
                    style={{
                        fontFamily: "Exo",
                        fontSize: 16,
                        fontWeight: 900,
                        alignItems: "center",
                        padding: "12px 24px",
                        gap: 8,
                        width: 250,
                        height: 45,
                        background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                        border: "0.6px solid #2C1919",
                        borderRadius: 6,
                    }}
                >
                    Proses Settlement Manual
                </button>
            </div>
        </div>
    )
}

export default ProsesSettlementManual