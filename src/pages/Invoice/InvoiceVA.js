import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import jsPDF from 'jspdf';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import Pdf from 'react-to-pdf'
import { toPng } from 'html-to-image';
import '../../assets/arial-normal'

function InvoiceVA() {

    const ref = React.createRef()
    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [stateSettlement, setStateSettlement] = useState(null)
    const [dateRangeSettlement, setDateRangeSettlement] = useState([])
    const [dataInvoice, setDataInvoice] = useState({})
    const [dataListPartner, setDataListPartner] = useState([])
    const [namaPartner, setNamaPartner] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const options = {
        orientation: 'p',
        unit: 'mm',
        format: 'legal'
    }

    const SaveAsPDFHandler = () => {
        const dom = document.getElementById('tableInvoice');
        toPng(dom)
            .then((dataUrl) => {
                const img = new Image();
                img.crossOrigin = 'annoymous';
                img.src = dataUrl;
                img.onload = () => {
                    // Initialize the PDF.
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: [1500, 1800],
                        putOnlyUsedFonts: true,
                        floatPrecision: 16
                    });
                    // pdf.setFont('arial');
            
                    // Define reused data
                    const imgProps = pdf.getImageProperties(img);
                    const imageType = imgProps.fileType;
                    const pdfWidth = pdf.internal.pageSize.getWidth();
            
                    // Calculate the number of pages.
                    const pxFullHeight = imgProps.height;
                    const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
                    const nPages = Math.ceil(pxFullHeight / pxPageHeight);
            
                    // Define pageHeight separately so it can be trimmed on the final page.
                    let pageHeight = pdf.internal.pageSize.getHeight();
            
                    // Create a one-page canvas to split up the full image.
                    const pageCanvas = document.createElement('canvas');
                    const pageCtx = pageCanvas.getContext('2d');
                    pageCanvas.width = imgProps.width;
                    pageCanvas.height = pxPageHeight;
            
                    for (let page = 0; page < nPages; page++) {
                        // Trim the final page to reduce file size.
                        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
                            pageCanvas.height = pxFullHeight % pxPageHeight;
                            pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
                        }
                        // Display the page.
                        const w = pageCanvas.width;
                        const h = pageCanvas.height;
                        pageCtx.fillStyle = 'white';
                        pageCtx.fillRect(0, 0, w, h);
                        pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);
            
                        // Add the page to the PDF.
                        if (page) pdf.addPage();
            
                        const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
                        // pdf.setFont('arial');
                        pdf.addImage(imgData, imageType, 155, 140, (pdfWidth*0.8), (pageHeight*0.8));
                    }
                    // pdf.addFileToVFS('arial-normal.ttf')
                    // pdf.addFont('ArialMS', 'Arial', 'normal');
                    // pdf.setFont('arial', 'normal');
                    // console.log(pdf.getFont(), 'font');
                    // Output / Save
                    pdf.save(`invoice-settlement-va.pdf`);
                };
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    };

    function resetButtonHandle() {
        setStateSettlement(null)
        setDateRangeSettlement([])
        setNamaPartner("")
    }

    function handleChangeNamaPartner(e) {
        setNamaPartner(e.target.value)
    }

    function pickDateSettlement(item) {
        setStateSettlement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlement(item)
        }
    }

    async function listPartner() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listPartner = await axios.post(BaseURL + "/Partner/ListPartner", {data: ""}, {headers: headers})
            // console.log(listPartner, 'ini list partner');
            if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length === 0) {
                setDataListPartner(listPartner.data.response_data)
            } else if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length !== 0) {
                setUserSession(listPartner.data.response_new_token)
                setDataListPartner(listPartner.data.response_data)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function generateInvoice(dateRange, partnerId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"date_from": "${dateRange[0]}", "date_to": "${dateRange[1]}", "subpartner_id" :"${partnerId}"}`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const invoiceData = await axios.post(BaseURL + "/Report/GetInvoiceSettlementVA", { data: dataParams }, { headers: headers })
            console.log(invoiceData, 'ini invoice data');
            if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token === null) {
                setDataInvoice(invoiceData.data.response_data)
            } else if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token !== null) {
                setUserSession(invoiceData.data.response_new_token)
                setDataInvoice(invoiceData.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400 && error.response.data.response_message === "Data not found!") {
                setErrorMessage(error.response.data.response_message)
                setDataInvoice({})
            }
        }
    }

    async function downloadPDF(table, dateRange) {
        // const element = document.getElementById('tableInvoice');
        let doc = new jsPDF("l", "pt", "a4");
        doc.html(document.querySelector(table), {
            callback: function (pdf) {
                pdf.save(`invoice settlement va ${dateRange[0]} - ${dateRange[1]}.pdf`);
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
        listPartner()
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
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        <Row className='mt-2 mb-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className='me-3'>Periode*</span>
                                <div>
                                    <DateRangePicker 
                                        onChange={pickDateSettlement}
                                        value={stateSettlement}
                                        clearIcon={null}
                                        className='me-3'
                                    />
                                </div>
                            </Col>
                            <Col xs={5} className="d-flex justify-content-start align-items-center">
                                <span>Nama Partner</span>
                                <Form.Select name='namaPartner' className="input-text-ez me-4" value={namaPartner} onChange={(e) => handleChangeNamaPartner(e)}>
                                    <option defaultChecked disabled value="">Pilih Nama Partner</option>
                                    {
                                        dataListPartner.map((item, index) => {
                                            return (
                                                <option key={index} value={item.partner_id}>{item.nama_perusahaan}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Col>
                            <button
                                onClick={() => generateInvoice(dateRangeSettlement, namaPartner)}
                                className={(stateSettlement === null || namaPartner.length === 0) ? "btn-off" : "add-button"}
                                style={{ maxWidth: 'fit-content', padding: 7, height: 40, marginRight: 20 }}
                                disabled={(stateSettlement === null || namaPartner.length === 0) ? true : false}
                            >
                                Generate
                            </button>
                            <button
                                onClick={() => resetButtonHandle()}
                                className={(stateSettlement !== null && namaPartner.length !== 0) ? "btn-reset" : "btn-ez"}
                                style={{ maxWidth: 'fit-content', padding: 7, height: 40, verticalAlign: "middle" }}
                                disabled={(stateSettlement === null || namaPartner.length === 0) ? true : false}
                            >
                                Atur Ulang
                            </button>
                        </Row>
                        <div id='tableInvoice'>
                            <Row style={{ fontSize: 18 }}>
                                <Col xs={4}></Col>
                                <Col xs={4}>
                                    <span className='d-flex justify-content-center' style={{ fontWeight: 700 }}>INVOICE</span>
                                </Col>
                                <Col xs={4}>
                                    <span className='d-flex justify-content-center'>ORIGINAL</span>
                                </Col>
                            </Row>
                            <div className='div-table' style={{ display: "flex", justifyContent: "center", marginBottom: -17 }}>
                                <table className='table table-bordered responsive' style={{ tableLayout: 'fixed' }}>
                                    <tbody>
                                        {/* section 1 */}
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Invoice No</td>
                                            <td style={{ width: 1, borderRight: 'hidden' }}>:</td>
                                            <td>IV/EZI/200/2022/10/0001</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Tgl</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td>{new Date(Date.now()).toLocaleString().split(',')[0]}</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden' }}>PO No.</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            {/* <td style={{ paddingBottom: 20 }}>:</td> */}
                                        </tr>
                                        {/* section 2 */}
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', textDecoration: 'underline', fontWeight: 700, borderRight: 'hidden' }}>Pembeli</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Nama</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td>PT. LAWRED JAYA AMANAH</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid', width: '50%' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Alamat</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td style={{ paddingRight: 50, wordBreak: 'break-word', whiteSpace: 'normal' }}>RUKO BEACH BOULEVARD BLOK B NOMOR 70, GOLF ISLAND JL. PANTAI INDAH KAPUK, KAMAL MUARA, PENJARINGAN, JAKARTA UTARA</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden' }}>Attn.</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            {/* <td style={{ paddingBottom: 20 }}>:</td> */}
                                        </tr>
                                        {/* section 3 */}
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', textDecoration: 'underline', fontWeight: 700, borderRight: 'hidden' }}>Penjual</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Nama</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td>PT. EZEELINK INDONESIA</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden' }}>Alamat</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td style={{ paddingBottom: 20, wordBreak: 'break-word', whiteSpace: 'normal' }}>Jl. AM. SANGAJI NO.24 PETOJO UTARA, GAMBIR, JAKARTA PUSAT - 10130 TELP : (021) 63870456 FAX : (021) 63870457</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='div-table' style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                                <table className='table table-bordered'>
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
                                                        <td style={{ textAlign: "end" }}>{(item.price_unit !== 0) ? convertToRupiah(item.price_unit, 2) : "Rp 0"}</td>
                                                        <td style={{ textAlign: "end" }}>{(item.price_total !== 0) ? convertToRupiah(item.price_total, 2) : "Rp 0"}</td>
                                                    </tr>
                                                )
                                            }) :
                                            <tr>
                                                <td style={{ paddingLeft: 16, width: 155, textAlign: "center" }}>1</td>
                                                <td>{(errorMessage.length !== 0) ? errorMessage : "-"}</td>
                                                <td style={{ textAlign: "center" }}>0</td>
                                                <td style={{ textAlign: "end" }}>Rp 0</td>
                                                <td style={{ textAlign: "end" }}>Rp 0</td>
                                            </tr>
                                        }
                                        <tr>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderBottom: 'solid' }}></td>
                                            <br />
                                            <br />
                                            <br />
                                        </tr>
                                        <tr>
                                            <td style={{ borderRight: "hidden", borderLeft: 'hidden'  }}></td>
                                            <td style={{ borderRight: "hidden",  }}></td>
                                            <td style={{ borderRight: "hidden",  }}></td>
                                            <td style={{ borderRight: "hidden",  }}></td>
                                            <td style={{ borderRight: "hidden" }}></td>
                                            <br />
                                            <br />
                                            <br />
                                        </tr>
                                        <tr style={{ border: '0px hidden transparent' }}>
                                            <td></td>
                                            {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden", borderTop: "solid" }}></td> */}
                                            <td></td>
                                            <td>Harga Jual</td>
                                            <td style={{ textAlign: "end" }}>:</td>
                                            <td style={{ textAlign: "end" }}>{(dataInvoice.inv_dpp !== undefined) ? convertToRupiah(dataInvoice.inv_dpp, 2) : "Rp 0"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: 'hidden' }}></td>
                                            {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>Potongan Harga</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>:</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>-</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: 'hidden' }}></td>
                                            {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>DPP</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>:</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(dataInvoice.inv_dpp !== undefined) ? convertToRupiah(dataInvoice.inv_dpp, 2) : "Rp 0"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: 'hidden' }}></td>
                                            {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>PPN 11%</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>:</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>{(dataInvoice.inv_ppn !== undefined) ? convertToRupiah(dataInvoice.inv_ppn, 2) : "Rp 0"}</td>
                                        </tr>
                                        <tr style={{ fontWeight: 700 }}>
                                            <td style={{ border: 'hidden' }}></td>
                                            {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden", background: "#077E86", color: "#FFFFFF" }}></td> */}
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>Total</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>:</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(dataInvoice.inv_total !== undefined) ? convertToRupiah(dataInvoice.inv_total, 2) : "Rp 0"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* <table className='table table-bordered mt-2' id='tableInvoice' style={{ width: "87%" }}>
                                    <thead>
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
                                                <td>{(errorMessage.length !== 0) ? errorMessage : "-"}</td>
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
                                </table> */}
                            </div>
                            {/* <div style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                                <table className='table table-bordered'>
                                    <thead style={{ backgroundColor: "#F2F2F2", border: "transparent", display: 'hidden' }}>
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
                            </div> */}
                            <div style={{ fontSize: 13 }}>
                                <table style={{ width: '100%', backgroundColor: 'rgb(242, 242, 242)', fontStyle: 'italic' }}>
                                    <tr>
                                        <td>Terbilang: Empat Puluh Dua Juta Tujuh Ratus Delapan Ribu Sembilan Ratus Lima Belas Rupiah</td>
                                    </tr>
                                </table>
                                <div>Remark:</div>
                                <div style={{ textAlign: 'end', marginTop: 50, marginBottom: 25 }}>........................................</div>
                                <div style={{ display: "flex", justifyContent: "flex-start", borderTop: "solid", fontWeight: 700 }}>Page 1 of 1</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            {/* <Pdf targetRef={ref} filename="invoice-example.pdf" options={options}>
                                {({ toPdf }) => */}
                                    <button
                                        onClick={SaveAsPDFHandler}
                                        // onClick={toPdf}
                                        // onClick={() => downloadPDF("#tableInvoice", dateRangeSettlement)}
                                        className={(Object.keys(dataInvoice).length === 0) ? "btn-off mb-3" : 'add-button mb-3'}
                                        style={{ maxWidth: 'fit-content' }}
                                        disabled={Object.keys(dataInvoice).length === 0}
                                    >
                                        Download PDF
                                    </button>
                            {/* //     }
                            // </Pdf> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceVA