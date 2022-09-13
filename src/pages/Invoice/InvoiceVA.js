import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import jsPDF from 'jspdf';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';

function InvoiceVA() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [stateSettlement, setStateSettlement] = useState(null)
    const [dateRangeSettlement, setDateRangeSettlement] = useState([])
    const [dataInvoice, setDataInvoice] = useState({})

    function pickDateSettlement(item) {
        setStateSettlement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlement(item)
        }
    }

    async function generateInvoice(dateRange) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"date_from": "${dateRange[0]}", "date_to": "${dateRange[1]}"}`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const invoiceData = await axios.post(BaseURL + "/Report/GetInvoiceSettlementVA", { data: dataParams }, { headers: headers })
            if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token === null) {
                setDataInvoice(invoiceData.data.response_data)
            } else if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token !== null) {
                setUserSession(invoiceData.data.response_new_token)
                setDataInvoice(invoiceData.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function downloadPDF(table, dateRange) {
        // const element = document.getElementById('tableInvoice');
        let doc = new jsPDF("l", "pt", "a4");
        doc.html(document.querySelector(table), {
            callback: function (pdf) {
                pdf.save(`invoice ${dateRange[0]} - ${dateRange[1]}.pdf`);
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
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Invoice</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Invoice</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <div className='base-content mt-3 mb-3'>
                        <Row className='mb-4'>
                            <Col xs={8} className="d-flex justify-content-start align-items-center">
                                <span className='me-3'>Periode*</span>
                                <DateRangePicker 
                                    onChange={pickDateSettlement}
                                    value={stateSettlement}
                                    clearIcon={null}
                                    className='me-3'
                                />
                                <button
                                    onClick={() => generateInvoice(dateRangeSettlement)}
                                    className={(stateSettlement === null) ? 'btn-off' : 'add-button'}
                                    style={{ maxWidth: 'fit-content', padding: 7, height: 40 }}
                                    disabled={(stateSettlement === null) ? true : false}
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
                                        dataInvoice.inv_products ?
                                        dataInvoice.inv_products.map((item, idx) => {
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
                                        <td></td>
                                        <br />
                                        <br />
                                        <br />
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ fontWeight: 600, textAlign: "end", borderTop: "solid" }}>Harga Jual :</td>
                                        <td colSpan={2} style={{ textAlign: "end", borderTop: "solid" }}>{(dataInvoice.inv_dpp !== undefined) ? convertToRupiah(dataInvoice.inv_dpp) : "Rp 0"}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ fontWeight: 600, textAlign: "end" }}>PPN 11% :</td>
                                        <td colSpan={2} style={{ textAlign: "end", width: 200 }}>{(dataInvoice.inv_ppn !== undefined) ? convertToRupiah(dataInvoice.inv_ppn) : "Rp 0"}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ fontWeight: 600, textAlign: "end", background: "#077E86", color: "#FFFFFF" }}>Total :</td>
                                        <td colSpan={2} style={{ textAlign: "end", width: 200, background: "#077E86", color: "#FFFFFF" }}>{(dataInvoice.inv_total !== undefined) ? convertToRupiah(dataInvoice.inv_total) : "Rp 0"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            <button
                                onClick={() => downloadPDF("#tableInvoice", dateRangeSettlement)}
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

export default InvoiceVA