import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import jsPDF from 'jspdf';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';

function InvoiceDisbursement() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [stateInvoiceDisbursement, setStateInvoiceDisbursement] = useState(null)
    const [dateRangeInvoiceDisbursement, setDateRangeInvoiceDisbursement] = useState([])
    const [dataInvoiceDisbursement, setDataInvoiceDisbursement] = useState({})

    function pickDateInvoiceDisbursement(item) {
        setStateInvoiceDisbursement(item)
        // console.log(item, 'ini item');
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeInvoiceDisbursement(item)
            // console.log(item, 'ini item2');
        }
    }

    async function generateInvoiceDisbursement(dateRange) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"date_from": "${dateRange[0]}", "date_to": "${dateRange[1]}"}`);
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const invoiceData = await axios.post("/Report/GetInvoiceDisbursement", { data: dataParams }, { headers: headers })
            // console.log(invoiceData, "ini invoice data");
            if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token === null) {
                setDataInvoiceDisbursement(invoiceData.data.response_data)
            } else if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token !== null) {
                setUserSession(invoiceData.data.response_new_token)
                setDataInvoiceDisbursement(invoiceData.data.response_data)
            }
        } catch (error) {
            console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function downloadPDF(table, dateRange) {
        // const element = document.getElementById('tableInvoice');
        let doc = new jsPDF("l", "pt", "a4");
        doc.html(document.querySelector(table), {
            callback: function (pdf) {
                pdf.save(`invoice disbursement ${dateRange[0]} - ${dateRange[1]}.pdf`);
            },
        })
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102") {
            history.push('/404');
        }
    }, [access_token, user_role])
    

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Invoice Disbursement</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Invoice Disbursement</h2>
            </div>
            <div className='main-content'>
                <div className='mt-4'>
                    <div className='base-content mt-3 mb-3'>
                        <Row className='mb-4'>
                            <Col xs={8} className="d-flex justify-content-start align-items-center">
                                <span className='me-3'>Periode*</span>
                                <DateRangePicker 
                                    onChange={pickDateInvoiceDisbursement}
                                    value={stateInvoiceDisbursement}
                                    clearIcon={null}
                                    className='me-3'
                                />
                                <button
                                    onClick={() => generateInvoiceDisbursement(dateRangeInvoiceDisbursement)}
                                    className={(stateInvoiceDisbursement === null) ? 'btn-off' : 'add-button'}
                                    style={{ maxWidth: 'fit-content', padding: 7, height: 40 }}
                                    disabled={(stateInvoiceDisbursement === null) ? true : false}
                                >
                                    Generate
                                </button>
                            </Col>
                        </Row>
                        <div className='div-table' style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                            <table className='table table-bordered mt-2' id='tableInvoice' style={{ width: "87%" }}>
                                <thead style={{ backgroundColor: "#F2F2F2", border: "transparent" }}>
                                    <tr>
                                        <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            No
                                        </th>
                                        <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            Nama Barang
                                        </th>
                                        <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            Qty TRANSAKSI
                                        </th>
                                        <th colSpan={2} style={{ textAlign: "center" }}>
                                            Harga (Rp)
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ textAlign: "center" }}>
                                            Satuan
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {
                                        dataInvoiceDisbursement.inv_products ?
                                        dataInvoiceDisbursement.inv_products.map((item, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td style={{ paddingLeft: 16, width: 155, textAlign: "center" }}>{ idx + 1 }</td>
                                                    <td>{ item.prod_name }</td>
                                                    <td style={{ textAlign: "center" }}>{ item.qty_trx }</td>
                                                    <td style={{ textAlign: "end" }}>{(item.price_unit !== 0) ? convertToRupiah(item.price_unit) : "Rp 0"}</td>
                                                    <td style={{ textAlign: "end" }}>{(item.price_total !== 0) ? convertToRupiah(item.price_total) : "Rp 0"}</td>
                                                </tr>
                                            )
                                        }) :
                                        <tr>
                                            <td style={{ paddingLeft: 16, width: 155, textAlign: "center" }}>1</td>
                                            <td>-</td>
                                            <td style={{ textAlign: "center" }}>0</td>
                                            <td style={{ textAlign: "end" }}>Rp 0</td>
                                            <td style={{ textAlign: "end" }}>Rp 0</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td style={{ borderRight: "hidden" }}></td>
                                        <td style={{ borderRight: "hidden" }}></td>
                                        <td style={{ borderRight: "hidden" }}></td>
                                        <td style={{ borderRight: "hidden" }}></td>
                                        <td style={{  }}></td>
                                        {/* <br />
                                        <br />
                                        <br /> */}
                                        <br />
                                        <br />
                                        <br />
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ fontWeight: 600, textAlign: "end", borderTop: "solid" }}>Harga Jual :</td>
                                        <td colSpan={2} style={{ textAlign: "end", borderTop: "solid" }}>{(dataInvoiceDisbursement.inv_dpp !== undefined) ? convertToRupiah(dataInvoiceDisbursement.inv_dpp) : "Rp 0"}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ fontWeight: 600, textAlign: "end" }}>PPN 11% :</td>
                                        <td colSpan={2} style={{ textAlign: "end", width: 200 }}>{(dataInvoiceDisbursement.inv_ppn !== undefined) ? convertToRupiah(dataInvoiceDisbursement.inv_ppn) : "Rp 0"}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ fontWeight: 600, textAlign: "end", background: "#077E86", color: "#FFFFFF" }}>Total :</td>
                                        <td colSpan={2} style={{ textAlign: "end", width: 200, background: "#077E86", color: "#FFFFFF" }}>{(dataInvoiceDisbursement.inv_total !== undefined) ? convertToRupiah(dataInvoiceDisbursement.inv_total) : "Rp 0"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            <button
                                onClick={() => downloadPDF("#tableInvoice", dateRangeInvoiceDisbursement)}
                                className='add-button mb-3'
                                style={{ maxWidth: 'fit-content' }}
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceDisbursement