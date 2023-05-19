import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row, Table } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import jsPDF from 'jspdf';
import { BaseURL, convertFormatNumber, convertToRupiah, errorCatch, getRole, getToken, setUserSession, terbilangDisbursement, terbilangVA } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import { toPng } from 'html-to-image';
import ReactSelect, { components } from 'react-select';

function InvoiceDisbursement() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [stateInvoiceDisbursement, setStateInvoiceDisbursement] = useState(null)
    const [dateRangeInvoiceDisbursement, setDateRangeInvoiceDisbursement] = useState([])
    const [dataInvoiceDisbursement, setDataInvoiceDisbursement] = useState({})
    const [dataListPartner, setDataListPartner] = useState([])
    const [namaPartner, setNamaPartner] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isIgnoreZeroAmount, setIsIgnoreZeroAmount] = useState(false)
    const [invoiceDate, setInvoiceDate] = useState("")
    const [showModalKonfirmasiInvoiceDisbursement, setShowModalKonfirmasiInvoiceDisbursement] = useState(false)
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [inputHandle, setInputHandle] = useState({})
    const [totalAmount, setTotalAmount] = useState(0)
    const [taxTotalAmount, setTaxTotalAmount] = useState(0)
    const [selectedPartnerInvoiceDisbursement, setSelectedPartnerInvoiceDisbursement] = useState([])

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    function handleChange(e, idx, qty, priceUnit) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
            [`priceTotal${idx+1}`]: e.target.value * priceUnit
        })
        setTotalAmount(totalAmount + ((e.target.value - qty) * priceUnit))
        setTaxTotalAmount((totalAmount + ((e.target.value - qty) * priceUnit)) * 0.11)
    }

    function toPreviewInvoice(objData) {
        let totalBiaya = 0
        let totalTax = 0
        for (const key in objData) {
            if (key.slice(5, 10) === 'Total') {
                totalBiaya = totalBiaya + objData[key]
            }
        }
        totalTax = totalBiaya*0.11
        setTotalAmount(totalBiaya)
        setTaxTotalAmount(totalTax)
        // console.log(totalBiaya + totalTax);
        setShowModalKonfirmasiInvoiceDisbursement(true)
    }

    function resetButtonHandle() {
        setStateInvoiceDisbursement(null)
        setDateRangeInvoiceDisbursement([])
        setSelectedPartnerInvoiceDisbursement([])
    }

    function handleChangeNamaPartner(e) {
        setNamaPartner(e.target.value)
    }

    function pickDateInvoiceDisbursement(item) {
        setStateInvoiceDisbursement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeInvoiceDisbursement(item)
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
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            } else if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length !== 0) {
                setUserSession(listPartner.data.response_new_token)
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function generateInvoiceDisbursement(dateRange, partnerId, dateInv, includeZeroAmount, isSave) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"date_from": "${dateRange[0]}", "date_to": "${dateRange[1]}", "subpartner_id" :"${partnerId}", "inv_date": "${dateInv}", "include_zero_amount": "${includeZeroAmount}", "is_save": ${isSave}}`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const invoiceData = await axios.post(BaseURL + "/Report/GetInvoiceDisbursement", { data: dataParams }, { headers: headers })
            if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token === null) {
                let objQTY = {}
                invoiceData.data.response_data.inv_products.forEach((e, i) => {
                    objQTY[`QTYTransaksi${i+1}`] = e.qty_trx
                    objQTY[`priceUnit${i+1}`] = e.price_unit
                    objQTY[`priceTotal${i+1}`] = e.price_total
                });
                setDataInvoiceDisbursement(invoiceData.data.response_data)
                setTotalAmount(invoiceData.data.response_data.inv_dpp)
                setTaxTotalAmount(invoiceData.data.response_data.inv_ppn)
                setInvoiceNumber(invoiceData.data.response_data.inv_no)
                setInputHandle(objQTY)
            } else if (invoiceData.status === 200 && invoiceData.data.response_code === 200 && invoiceData.data.response_new_token !== null) {
                setUserSession(invoiceData.data.response_new_token)
                let objQTY = {}
                invoiceData.data.response_data.inv_products.forEach((e, i) => {
                    objQTY[`QTYTransaksi${i+1}`] = e.qty_trx
                    objQTY[`priceUnit${i+1}`] = e.price_unit
                    objQTY[`priceTotal${i+1}`] = e.price_total
                });
                setDataInvoiceDisbursement(invoiceData.data.response_data)
                setTotalAmount(invoiceData.data.response_data.inv_dpp)
                setTaxTotalAmount(invoiceData.data.response_data.inv_ppn)
                setInvoiceNumber(invoiceData.data.response_data.inv_no)
                setInputHandle(objQTY)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400 && error.response.data.response_message === "Data not found!") {
                setErrorMessage(error.response.data.response_message)
                setDataInvoiceDisbursement({})
            }
        }
    }
    
    const SaveAsPDFHandler = () => {
        generateInvoiceDisbursement(dateRangeInvoiceDisbursement, selectedPartnerInvoiceDisbursement.length !== 0 ? selectedPartnerInvoiceDisbursement[0].value : "", invoiceDate, isIgnoreZeroAmount, true)
        // const dom = document.getElementById('tableInvoice');
        const dom = document.getElementById('tableInvoiceModal');
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
                        format: 'a4',
                        putOnlyUsedFonts: true,
                        floatPrecision: 16
                    });
                    pdf.setFont('Nunito');
            
                    // Define reused data
                    const imgProps = pdf.getImageProperties(img);
                    const imageType = imgProps.fileType;
                    const pdfWidth = pdf.internal.pageSize.getWidth();
            
                    // Calculate the number of pages.
                    const pxFullHeight = imgProps.height;
                    const pxPageHeight = Math.floor((imgProps.width * 12.5) / 5.5);
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
                        // data 8
                        // pdf.addImage(imgData, imageType, 45, 55, (pdfWidth*0.8), (pageHeight*0.8));
                        // data 9
                        // pdf.addImage(imgData, imageType, 45, 25, (pdfWidth*0.8), (pageHeight*0.8));
                        // data 10
                        // pdf.addImage(imgData, imageType, 45, 15, (pdfWidth*0.8), (pageHeight*0.8));
                        // data diatas 15
                        pdf.addImage(imgData, imageType, (dataInvoiceDisbursement.inv_products.length < 11 ? 60 : 90), (dataInvoiceDisbursement.inv_products.length < 9 ? 75 : dataInvoiceDisbursement.inv_products.length < 11 ? 70 : 75), (dataInvoiceDisbursement.inv_products.length <= 10 ? pdfWidth*0.75 : pdfWidth*0.6), (dataInvoiceDisbursement.inv_products.length <= 10 ? pageHeight*0.75 : pageHeight*0.55));
                    }
                    // Output / Save
                    pdf.save(`invoice-disbursement-${dataInvoiceDisbursement.partner_detail.partner_name}-${dataInvoiceDisbursement.inv_date}.pdf`);
                    setShowModalKonfirmasiInvoiceDisbursement(false)
                };
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    };

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
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Invoice Disbursement</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Invoice Disbursement</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <div className='base-content mt-3 mb-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        <Row className='mt-2 mb-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center me-4">
                                <span className='me-5'>Periode<span style={{ color: "red" }}>*</span></span>
                                <div>
                                    <DateRangePicker 
                                        onChange={pickDateInvoiceDisbursement}
                                        value={stateInvoiceDisbursement}
                                        clearIcon={null}
                                        className='me-3'
                                    />
                                </div>                                
                            </Col>
                            <Col xs={6} className="d-flex justify-content-start align-items-center">
                                <span className='me-5'>Nama Partner <span style={{ color: "red" }}>*</span></span>
                                <div className="dropdown dropTopupPartner">
                                    <ReactSelect
                                        // isMulti
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={dataListPartner}
                                        // allowSelectAll={true}
                                        value={selectedPartnerInvoiceDisbursement}
                                        onChange={(selected) => setSelectedPartnerInvoiceDisbursement([selected])}
                                        placeholder="Pilih Nama Partner"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                                {/* <Form.Select name='namaPartner' className="input-text-ez me-4" value={namaPartner} onChange={(e) => handleChangeselectedPartnerInvoiceDisbursement(e)}>
                                    <option defaultChecked disabled value="">Pilih Nama Partner</option>
                                    {
                                        dataListPartner.map((item, index) => {
                                            return (
                                                <option key={index} value={item.partner_id}>{item.nama_perusahaan}</option>
                                            )
                                        })
                                    }
                                </Form.Select> */}
                            </Col>
                        </Row>
                        <Row className='mt-2 mb-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center me-4">
                                <span className='me-3'>Tanggal Invoice<span style={{ color: "red" }}>*</span></span>
                                <div>
                                    <input onChange={(e) => setInvoiceDate(e.target.value)} value={invoiceDate} type='date' style={{ width: 205, height: 40, border: '1.5px solid', borderRadius: 8 }} />
                                </div>
                            </Col>
                            <Col xs={6} className="d-flex justify-content-start align-items-center">
                                <span className='me-4'>Include Zero Amount</span>
                                <div>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        onChange={(e) => setIsIgnoreZeroAmount(e.target.checked)}
                                        label={isIgnoreZeroAmount? "Include" : "Exclude"}
                                        checked={isIgnoreZeroAmount}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <button
                            onClick={() => generateInvoiceDisbursement(dateRangeInvoiceDisbursement, selectedPartnerInvoiceDisbursement.length !== 0 ? selectedPartnerInvoiceDisbursement[0].value : "", invoiceDate, isIgnoreZeroAmount, false)}
                            className={(stateInvoiceDisbursement === null || selectedPartnerInvoiceDisbursement.length === 0 || invoiceDate.length === 0) ? 'btn-off' : 'add-button'}
                            style={{ maxWidth: 'fit-content', padding: 7, height: 40, marginRight: 20 }}
                            disabled={(stateInvoiceDisbursement === null || selectedPartnerInvoiceDisbursement.length === 0 || invoiceDate.length === 0) ? true : false}
                        >
                            Generate
                        </button>
                        <button
                            onClick={() => resetButtonHandle()}
                            className={(stateInvoiceDisbursement !== null && selectedPartnerInvoiceDisbursement.length !== 0 && invoiceDate.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                            style={{ maxWidth: 'fit-content', padding: 7, height: 40, verticalAlign: "middle" }}
                            disabled={(stateInvoiceDisbursement !== null && selectedPartnerInvoiceDisbursement.length !== 0 && invoiceDate.length !== 0) ? false : true}
                        >
                            Atur Ulang
                        </button>
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
                                    {/* <tbody> */}
                                        {/* section 1 */}
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Invoice No</td>
                                            <td style={{ width: 1, borderRight: 'hidden', paddingRight: 10 }}>:</td>
                                            <td style={{ fontWeight: 700 }}>
                                                {
                                                    invoiceNumber.length !== 0 ?
                                                    <input name="invoiceNumber" onChange={(e) => setInvoiceNumber(e.target.value)} value={invoiceNumber} type='text' style={{ marginTop: 6, marginBottom: 6, width: 230, height: 40, borderRadius: 8, border: '1px solid #E0E0E0' }} placeholder='-'/> :
                                                    "-"
                                                }
                                                {/* {dataInvoice.inv_no ? dataInvoice.inv_no : "-"} */}
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Tgl</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td style={{ fontWeight: 700 }}>{dataInvoiceDisbursement.inv_date ? dataInvoiceDisbursement.inv_date : "-"}</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden' }}>PO No.</td>
                                            <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                            {/* <td style={{ paddingBottom: 20 }}>:</td> */}
                                        </tr>
                                        {/* section 2 */}
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', textDecoration: 'underline', fontWeight: 700, borderRight: 'hidden' }}>Pembeli</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Nama</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td style={{ fontWeight: 700 }}>{dataInvoiceDisbursement.partner_detail ? dataInvoiceDisbursement.partner_detail.partner_name.toUpperCase() : "-"}</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid', width: '50%' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden', verticalAlign: 'baseline' }}>Alamat</td>
                                            <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                            <td style={{ paddingRight: 50, wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'baseline', fontWeight: 700 }}>{dataInvoiceDisbursement.partner_detail ? dataInvoiceDisbursement.partner_detail.partner_address.toUpperCase() : "-"}</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden', verticalAlign: 'baseline' }}>Attn.</td>
                                            <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                            {/* <td style={{ paddingBottom: 20 }}>:</td> */}
                                        </tr>
                                        {/* section 3 */}
                                        <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', textDecoration: 'underline', fontWeight: 700, borderRight: 'hidden' }}>Penjual</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Nama</td>
                                            <td style={{ borderRight: 'hidden' }}>:</td>
                                            <td style={{ fontWeight: 700 }}>PT. EZEELINK INDONESIA</td>
                                        </tr>
                                        <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                            <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden', verticalAlign: 'baseline' }}>Alamat</td>
                                            <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                            <td style={{ paddingRight: 366, paddingBottom: 20, wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'baseline', fontWeight: 700 }}>Jl. AM. SANGAJI NO.24 PETOJO UTARA, GAMBIR, JAKARTA PUSAT - 10130 TELP : (021) 63870456 FAX : (021) 63870457</td>
                                        </tr>
                                </table>
                            </div>
                            <div className='div-table' style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                                <Table bordered>
                                    <thead style={{ backgroundColor: "#F2F2F2", border: 'solid' }}>
                                        <tr>
                                            <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", borderBottom: 'solid' }}>
                                                No
                                            </th>
                                            <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                Nama Barang/Jasa
                                            </th>
                                            <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                Qty TRANSAKSI
                                            </th>
                                            <th colSpan={2} style={{ textAlign: "center", borderBottomWidth: 0, borderRight: 'hidden' }}>
                                                Harga (Rp)
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>
                                                Satuan
                                            </th>
                                            <th style={{ textAlign: "center", borderRight: 'hidden' }}>
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {
                                            dataInvoiceDisbursement.inv_products ?
                                            dataInvoiceDisbursement.inv_products.map((item, idx) => {
                                                return (
                                                    <tr key={idx} style={{ border: 'solid', borderBottom: 'hidden', fontWeight: 700 }}>
                                                        <td style={{ paddingLeft: 16, width: 55, textAlign: "center", borderRight: 'hidden' }}>{ idx + 1 }</td>
                                                        <td style={{ borderRight: 'hidden', wordBreak: 'break-word', whiteSpace: 'normal' }}>{ item.prod_name }</td>
                                                        <td style={{ padding: 0, textAlign: "end", borderRight: 'hidden' }}>
                                                            <input name={`QTYTransaksi${idx+1}`} onChange={(e) => handleChange(e, idx, inputHandle[`QTYTransaksi${idx+1}`], inputHandle[`priceUnit${idx+1}`])} value={inputHandle[`QTYTransaksi${idx+1}`] === undefined ? 0 : convertFormatNumber(inputHandle[`QTYTransaksi${idx+1}`])} type='number' style={{ width: 75, height: 40, borderRadius: 8, border: '1px solid #E0E0E0' }} placeholder='0'/>
                                                            {/* { convertFormatNumber(item.qty_trx) } */}
                                                        </td>
                                                        {/* <td style={{ textAlign: "end", borderRight: 'hidden' }}>{ convertFormatNumber(item.qty_trx) }</td> */}
                                                        <td style={{ textAlign: "end", borderRight: 'hidden' }}>{(item.price_unit !== 0) ? convertToRupiah(inputHandle[`priceUnit${idx+1}`], true, 2) : "Rp 0"}</td>
                                                        <td style={{ textAlign: "end", borderRight: 'hidden' }}>{(item.price_total !== 0) ? convertToRupiah(inputHandle[`priceTotal${idx+1}`], true, 2) : "Rp 0"}</td>
                                                    </tr>
                                                )
                                            }) :
                                            <tr style={{ border: 'solid', borderBottom: 'hidden' }}>
                                                <td style={{ paddingLeft: 16, width: 155, textAlign: "center", borderRight: 'hidden' }}>1</td>
                                                <td style={{ borderRight: 'hidden' }}>{(errorMessage.length !== 0) ? errorMessage : "-"}</td>
                                                <td style={{ textAlign: "end", borderRight: 'hidden' }}>0</td>
                                                <td style={{ textAlign: "end", borderRight: 'hidden' }}>Rp 0</td>
                                                <td style={{ textAlign: "end", borderRight: 'hidden' }}>Rp 0</td>
                                            </tr>
                                        }
                                        <tr style={{ border: 'solid' }}>
                                            <td style={{ borderRight: "hidden", borderLeft: 'solid', borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid', borderWidth: 0 }}></td>
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
                                        <tr style={{ border: '0px hidden transparent', fontWeight: 700 }}>
                                            <td></td>
                                            <td></td>
                                            <td>Harga Jual</td>
                                            <td style={{ textAlign: "end" }}>: Rp</td>
                                            <td style={{ textAlign: "end" }}>{(totalAmount !== undefined) ? convertToRupiah(totalAmount, true, 2).slice(3) : "0"}</td>
                                        </tr>
                                        <tr style={{ fontWeight: 700 }}>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>Potongan Harga</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>: Rp</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>0</td>
                                        </tr>
                                        <tr style={{ fontWeight: 700 }}>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>DPP</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>: Rp</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(totalAmount !== undefined) ? convertToRupiah(totalAmount, true, 2).slice(3) : "0"}</td>
                                        </tr>
                                        <tr style={{ fontWeight: 700 }}>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>PPN 11%</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>: Rp</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>{(taxTotalAmount !== undefined) ? convertToRupiah(taxTotalAmount, true, 2).slice(3) : "0"}</td>
                                        </tr>
                                        <tr style={{ fontWeight: 700 }}>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ border: 'hidden' }}></td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>Total</td>
                                            <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>: Rp</td>
                                            <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(dataInvoiceDisbursement.inv_dpp !== undefined || dataInvoiceDisbursement.inv_ppn !== undefined) ? convertToRupiah((totalAmount + taxTotalAmount), true, 2).slice(3) : "0"}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>
                                <table style={{ width: '100%', backgroundColor: 'rgb(242, 242, 242)', fontStyle: 'italic' }}>
                                    <tr>
                                        <td>Terbilang: {(dataInvoiceDisbursement.inv_dpp !== undefined || dataInvoiceDisbursement.inv_ppn !== undefined) ? terbilangDisbursement((totalAmount + taxTotalAmount).toFixed(2)).toUpperCase() + " RUPIAH" : "NOL RUPIAH"}</td>
                                    </tr>
                                </table>
                                <div>Remark:</div>
                                <div style={{ textAlign: 'end', marginTop: 150, marginBottom: 25 }}>........................................</div>
                                <div style={{ display: "flex", justifyContent: "flex-start", borderTop: "solid", fontWeight: 700 }}>Page 1 of 1</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            <button
                                // onClick={SaveAsPDFHandler}
                                onClick={() => toPreviewInvoice(inputHandle)}
                                className={(Object.keys(dataInvoiceDisbursement).length === 0) ? "btn-off mb-3" : 'add-button mb-3'}
                                style={{ maxWidth: 'fit-content' }}
                                disabled={Object.keys(dataInvoiceDisbursement).length === 0}
                            >
                                Preview Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal invoice */}
            <Modal className='modal-invoice' show={showModalKonfirmasiInvoiceDisbursement} onHide={() => setShowModalKonfirmasiInvoiceDisbursement(false)} style={{ borderRadius: 8 }}>
                <Modal.Body style={{ width: "100%", padding: "0px 24px" }}>
                    <div id='tableInvoiceModal'>
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
                                {/* <tbody> */}
                                    {/* section 1 */}
                                    <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Invoice No</td>
                                        <td style={{ width: 1, borderRight: 'hidden', paddingRight: 10 }}>:</td>
                                        <td style={{ fontWeight: 700 }}>{invoiceNumber ? invoiceNumber : "-"}</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Tgl</td>
                                        <td style={{ borderRight: 'hidden' }}>:</td>
                                        <td style={{ fontWeight: 700 }}>{dataInvoiceDisbursement.inv_date ? dataInvoiceDisbursement.inv_date : "-"}</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden' }}>PO No.</td>
                                        <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                        {/* <td style={{ paddingBottom: 20 }}>:</td> */}
                                    </tr>
                                    {/* section 2 */}
                                    <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', textDecoration: 'underline', fontWeight: 700, borderRight: 'hidden' }}>Pembeli</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Nama</td>
                                        <td style={{ borderRight: 'hidden' }}>:</td>
                                        <td style={{ fontWeight: 700 }}>{dataInvoiceDisbursement.partner_detail ? dataInvoiceDisbursement.partner_detail.partner_name.toUpperCase() : "-"}</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid', width: '50%' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden', verticalAlign: 'baseline' }}>Alamat</td>
                                        <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                        <td style={{ paddingRight: 50, wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'baseline', fontWeight: 700 }}>{dataInvoiceDisbursement.partner_detail ? dataInvoiceDisbursement.partner_detail.partner_address.toUpperCase() : "-"}</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden', verticalAlign: 'baseline' }}>Attn.</td>
                                        <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                        {/* <td style={{ paddingBottom: 20 }}>:</td> */}
                                    </tr>
                                    {/* section 3 */}
                                    <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', textDecoration: 'underline', fontWeight: 700, borderRight: 'hidden' }}>Penjual</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Nama</td>
                                        <td style={{ borderRight: 'hidden' }}>:</td>
                                        <td style={{ fontWeight: 700 }}>PT. EZEELINK INDONESIA</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', paddingBottom: 20, borderRight: 'hidden', verticalAlign: 'baseline' }}>Alamat</td>
                                        <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                        <td style={{ paddingRight: 366, paddingBottom: 20, wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'baseline', fontWeight: 700 }}>Jl. AM. SANGAJI NO.24 PETOJO UTARA, GAMBIR, JAKARTA PUSAT - 10130 TELP : (021) 63870456 FAX : (021) 63870457</td>
                                    </tr>
                                {/* </tbody> */}
                            </table>
                        </div>
                        <div className='div-table' style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                            <Table bordered>
                                <thead style={{ backgroundColor: "#F2F2F2", border: 'solid' }}>
                                    <tr>
                                        <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", borderBottom: 'solid' }}>
                                            No
                                        </th>
                                        <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            Nama Barang/Jasa
                                        </th>
                                        <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            Qty TRANSAKSI
                                        </th>
                                        <th colSpan={2} style={{ textAlign: "center", borderBottomWidth: 0, borderRight: 'hidden' }}>
                                            Harga (Rp)
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ textAlign: "center" }}>
                                            Satuan
                                        </th>
                                        <th style={{ textAlign: "center", borderRight: 'hidden' }}>
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {
                                        dataInvoiceDisbursement.inv_products ?
                                        dataInvoiceDisbursement.inv_products.map((item, idx) => {
                                            return (
                                                <tr key={idx} style={{ border: 'solid', borderBottom: 'hidden', fontWeight: 700 }}>
                                                    <td style={{ paddingLeft: 16, width: 55, textAlign: "center", borderRight: 'hidden' }}>{ idx + 1 }</td>
                                                    <td style={{ borderRight: 'hidden', wordBreak: 'break-word', whiteSpace: 'normal' }}>{ item.prod_name }</td>
                                                    <td style={{ textAlign: "end", borderRight: 'hidden' }}>{ inputHandle[`QTYTransaksi${idx+1}`] }</td>
                                                    <td style={{ textAlign: "end", borderRight: 'hidden' }}>{(item.price_unit !== 0) ? convertToRupiah(inputHandle[`priceUnit${idx+1}`], true, 2) : "Rp 0"}</td>
                                                    <td style={{ textAlign: "end", borderRight: 'hidden' }}>{(item.price_total !== 0) ? convertToRupiah(inputHandle[`priceTotal${idx+1}`], true, 2) : "Rp 0"}</td>
                                                </tr>
                                            )
                                        }) :
                                        <tr style={{ border: 'solid', borderBottom: 'hidden' }}>
                                            <td style={{ paddingLeft: 16, width: 155, textAlign: "center", borderRight: 'hidden' }}>1</td>
                                            <td style={{ borderRight: 'hidden' }}>{(errorMessage.length !== 0) ? errorMessage : "-"}</td>
                                            <td style={{ textAlign: "end", borderRight: 'hidden' }}>0</td>
                                            <td style={{ textAlign: "end", borderRight: 'hidden' }}>Rp 0</td>
                                            <td style={{ textAlign: "end", borderRight: 'hidden' }}>Rp 0</td>
                                        </tr>
                                    }
                                    <tr style={{ border: 'solid' }}>
                                        <td style={{ borderRight: "hidden", borderLeft: 'solid', borderBottom: 'solid' }}></td>
                                        <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                        <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                        <td style={{ borderRight: "hidden", borderBottom: 'solid' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid', borderWidth: 0 }}></td>
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
                                    <tr style={{ border: '0px hidden transparent',fontWeight: 700 }}>
                                        <td></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden", borderTop: "solid" }}></td> */}
                                        <td></td>
                                        <td>Harga Jual</td>
                                        <td style={{ textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end" }}>{(totalAmount !== undefined) ? convertToRupiah(totalAmount, true, 2).slice(3) : "0"}</td>
                                        {/* <td style={{ textAlign: "end" }}>{(dataInvoice.inv_dpp !== undefined) ? convertToRupiah(dataInvoice.inv_dpp, true, 2).slice(3) : "0"}</td> */}
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>Potongan Harga</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>0</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>DPP</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(totalAmount !== undefined) ? convertToRupiah(totalAmount, true, 2).slice(3) : "0"}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>PPN 11%</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>{(taxTotalAmount !== undefined) ? convertToRupiah(taxTotalAmount, true, 2).slice(3) : "0"}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden", background: "#077E86", color: "#FFFFFF" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>Total</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(totalAmount !== undefined || taxTotalAmount !== undefined) ? convertToRupiah((totalAmount + taxTotalAmount), true, 2).slice(3) : "0"}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                            <table style={{ width: '100%', backgroundColor: 'rgb(242, 242, 242)', fontStyle: 'italic' }}>
                                <tr>
                                    <td>Terbilang: {(totalAmount !== undefined || taxTotalAmount !== undefined) ? terbilangDisbursement((totalAmount + taxTotalAmount).toFixed(2)).toUpperCase() + " RUPIAH" : "NOL RUPIAH"}</td>
                                </tr>
                            </table>
                            <div>Remark:</div>
                            <div style={{ textAlign: 'end', marginTop: 150, marginBottom: 25 }}>........................................</div>
                            <div style={{ display: "flex", justifyContent: "flex-start", borderTop: "solid", fontWeight: 700 }}>Page 1 of 1</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={SaveAsPDFHandler}
                            // onClick={() => setShowModalKonfirmasiInvoiceVA(true)}
                            className={(Object.keys(dataInvoiceDisbursement).length === 0) ? "btn-off mb-3" : 'add-button mb-3'}
                            style={{ maxWidth: 'fit-content' }}
                            disabled={Object.keys(dataInvoiceDisbursement).length === 0}
                        >
                            Download PDF
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default InvoiceDisbursement