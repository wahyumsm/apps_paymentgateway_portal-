import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from '@themesberg/react-bootstrap'
import ReactSelect, { components } from 'react-select';
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, convertSimpleTimeStamp, convertToRupiah, currentDate, errorCatch, firstDayLastMonth, firstDayThisMonth, getToken, lastDayLastMonth, lastDayThisMonth, setUserSession, sevenDaysAgo, terbilangDisbursement, yesterdayDate } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import Pagination from 'react-js-pagination'
import { toPng } from 'html-to-image';
import {jsPDF} from 'jspdf';
import '../../assets/arial-normal'
import deleted from "../../assets/icon/delete_icon.svg";
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker';
import html2canvas from 'html2canvas';
import $ from 'jquery'

const RiwayatInvoice = () => {
    const history = useHistory()
    const [dataListPartner, setDataListPartner] = useState([])
    const [showModalDetailInvoice, setShowModalDetailInvoice] = useState(false)
    const [stateRiwayatInvoice, setStateRiwayatInvoice] = useState(null)
    const [dateRangeRiwayatInvoice, setDateRangeRiwayatInvoice] = useState([])
    const [showDateRiwayatInvoice, setShowDateRiwayatInvoice] = useState("none")
    const [pageNumberRiwayatInvoice, setPageNumberRiwayatInvoice] = useState({})
    const [totalPageRiwayatInvoice, setTotalPageRiwayatInvoice] = useState(0)
    const [activePageRiwayatInvoice, setActivePageRiwayatInvoice] = useState(1)
    const [pendingRiwayatInvoice, setPendingRiwayatInvoice] = useState(true)
    const [isFilterRiwayatInvoice, setisFilterRiwayatInvoice] = useState(false)
    const [selectedPartnerRiwayatInvoice, setSelectedPartnerRiwayatInvoice] = useState([])
    const [inputHandleRiwayatInvoice, setInputHandleRiwayatInvoice] = useState({
        periode: 0,
        partnerId: "",
        invType: 0,
        fiturId: 0
    })
    const [dataRiwayatInvoice, setDataRiwayatInvoice] = useState([])

    function pickDateRiwayatInvoice(item) {
        setStateRiwayatInvoice(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeRiwayatInvoice(item)
        }
    }

    function handleChangePeriodeRiwayatInvoice(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatInvoice("")
            setInputHandleRiwayatInvoice({
                ...inputHandleRiwayatInvoice,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatInvoice("none")
            setStateRiwayatInvoice(null)
            setDateRangeRiwayatInvoice([])
            setInputHandleRiwayatInvoice({
                ...inputHandleRiwayatInvoice,
                [e.target.name] : e.target.value.split(",")
            })
        }
    }

    function handleChange (e) {
        setInputHandleRiwayatInvoice({
            ...inputHandleRiwayatInvoice,
            [e.target.name] : e.target.value
        })
    }

    function handlePageChangeRiwayatInvoice(page) {
        // console.log(page, 'ini di gandle change page');
        // console.log(isFilterDanaMasuk, 'ini isFilterDanaMasuk');
        if (isFilterRiwayatInvoice) {
            setActivePageRiwayatInvoice(page)
            filterGetDataRiwayatInvoiceHandler(selectedPartnerRiwayatInvoice.length !== 0 ? selectedPartnerRiwayatInvoice[0].value : "", inputHandleRiwayatInvoice.invType, inputHandleRiwayatInvoice.fiturId, inputHandleRiwayatInvoice.periode, dateRangeRiwayatInvoice, page, 10)
        } else {
            setActivePageRiwayatInvoice(page)
            getDataRiwayatInvoiceHandler(page)
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

    async function getDataRiwayatInvoiceHandler(firstDay, lastDay, currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id": "", "inv_type" : 0, "fitur_id" : 0, "date_from": "${firstDay}", "date_to": "${lastDay}", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataRiwayatInv = await axios.post(BaseURL + "/Report/GetListInvoiceData", { data: dataParams }, { headers: headers })
            // console.log(dataRiwayatInv.data.response_data.results, "data settlement");
            if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token === null) {
                dataRiwayatInv.data.response_data.results = dataRiwayatInv.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberRiwayatInvoice(dataRiwayatInv.data.response_data)
                setTotalPageRiwayatInvoice(dataRiwayatInv.data.response_data.max_page)
                setDataRiwayatInvoice(dataRiwayatInv.data.response_data.results)
                setPendingRiwayatInvoice(false)
            } else if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token !== null) {
                setUserSession(dataRiwayatInv.data.response_new_token)
                dataRiwayatInv.data.response_data.results = dataRiwayatInv.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberRiwayatInvoice(dataRiwayatInv.data.response_data)
                setTotalPageRiwayatInvoice(dataRiwayatInv.data.response_data.max_page)
                setDataRiwayatInvoice(dataRiwayatInv.data.response_data.results)
                setPendingRiwayatInvoice(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterGetDataRiwayatInvoiceHandler(partnerId, invType, fiturId, periode, dateRange, page, rowPerPage) {
        try {
            setPendingRiwayatInvoice(true)
            setisFilterRiwayatInvoice(true)
            setActivePageRiwayatInvoice(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id": "${partnerId}", "inv_type" : ${invType}, "fitur_id" : ${fiturId}, "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataRiwayatInv = await axios.post(BaseURL + "/Report/GetListInvoiceData", { data: dataParams }, { headers: headers })
            // console.log(dataRiwayatInv.data.response_data.results, "data settlement");
            if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token === null) {
                dataRiwayatInv.data.response_data.results = dataRiwayatInv.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberRiwayatInvoice(dataRiwayatInv.data.response_data)
                setTotalPageRiwayatInvoice(dataRiwayatInv.data.response_data.max_page)
                setDataRiwayatInvoice(dataRiwayatInv.data.response_data.results)
                setPendingRiwayatInvoice(false)
            } else if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token !== null) {
                setUserSession(dataRiwayatInv.data.response_new_token)
                dataRiwayatInv.data.response_data.results = dataRiwayatInv.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberRiwayatInvoice(dataRiwayatInv.data.response_data)
                setTotalPageRiwayatInvoice(dataRiwayatInv.data.response_data.max_page)
                setDataRiwayatInvoice(dataRiwayatInv.data.response_data.results)
                setPendingRiwayatInvoice(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function deleteDataRiwayatInvoiceHandler(invId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"tinv_id": ${invId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataRiwayatInv = await axios.post(BaseURL + "/Report/DeleteInvoice", { data: dataParams }, { headers: headers })
            // console.log(dataRiwayatInv.data.response_data.results, "data settlement");
            if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token === null) {
                window.location.reload()
            } else if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token !== null) {
                setUserSession(dataRiwayatInv.data.response_new_token)
                window.location.reload()
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonRiwayatInvoice () {
        getDataRiwayatInvoiceHandler(activePageRiwayatInvoice)
        setInputHandleRiwayatInvoice({
            periode: 0,
            partnerId: "",
            invType: 0,
            fiturId: 0
        })
        setSelectedPartnerRiwayatInvoice([])
        setStateRiwayatInvoice(null)
        setDateRangeRiwayatInvoice([])
        setShowDateRiwayatInvoice("none")
    }

    const [dataDetailRiwayatInvoice, setDataDetailRiwayatInvoice] = useState({})
    console.log(dataDetailRiwayatInvoice, "dataDetailRiwayatInvoice");

    function getDataDetailDataInvoice (noInv) {
        const findDataInvoiceDetail = dataRiwayatInvoice.find((item) => item.tinv_no === noInv)
        setDataDetailRiwayatInvoice(findDataInvoiceDetail)
        setShowModalDetailInvoice(true)
    }

    function CreatePDFfromHTML() {
        var HTML_Width = $(".tableInvoiceModal").width()*3;
        var HTML_Height = $(".tableInvoiceModal").height()*3;
        var top_left_margin = 15;
        var PDF_Width = HTML_Width + (top_left_margin * 2);
        var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
    
        var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    
        html2canvas($(".tableInvoiceModal")[0]).then(function (canvas) {
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
            for (var i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            pdf.save("invoice_<?php echo $trackingNumber ;?>.pdf");
            $(".tableInvoiceModal").hide();
        });
    }

    const SaveAsPDFHandler = () => {
        // const dom = document.getElementById('tableInvoice');
        const dom = document.getElementById('tableInvoiceModal');
        toPng(dom)
            .then((dataUrl) => {
                const img = new Image();
                console.log(img);
                img.crossOrigin = 'annoymous';
                img.src = dataUrl;
                img.onload = () => {
                    // Initialize the PDF.
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: 'a4',
                        putOnlyUsedFonts: true,
                        floatPrecision: 20
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
                        pdf.addImage(imgData, imageType, (dataDetailRiwayatInvoice?.tinv_data?.inv_products?.length < 11 ? 60 : 90), (dataDetailRiwayatInvoice?.tinv_data?.inv_products?.length < 9 ? 75 : dataDetailRiwayatInvoice?.tinv_data?.inv_products?.length < 11 ? 70 : 75), (dataDetailRiwayatInvoice?.tinv_data?.inv_products?.length <= 10 ? pdfWidth*0.75 : pdfWidth*0.6), (dataDetailRiwayatInvoice?.tinv_data?.inv_products?.length <= 10 ? pageHeight*0.75 : pageHeight*0.55));
                    }
                    // Output / Save
                    pdf.save(`invoice-settlementva-${dataDetailRiwayatInvoice?.tinv_data?.partner_detail?.partner_name}-${dataDetailRiwayatInvoice?.tinv_date}.pdf`);
                    setShowModalDetailInvoice(false)
                };
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    };

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'No Invoice',
            selector: row => row.tinv_no,
            cell: (row) => <div style={{ textDecoration: "underline", color: "#077E86", cursor: "pointer" }} onClick={() => getDataDetailDataInvoice(row.tinv_no)} >{row.tinv_no}</div>,
            width: "200px"
        },
        {
            name: 'Tanggal Invoice',
            selector: row => row.tinv_date,
            width: "170px"
        },
        {
            name: 'Tanggal Dibuat',
            selector: row => convertSimpleTimeStamp(row.tinv_crtdt),
            width: "200px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "250px",
            wrap: true
        },
        {
            name: 'Tipe Invoice',
            selector: row => row.inv_type_name,
            width: "200px",
        },
        {
            name: 'Fitur',
            selector: row => row.mfitur_name,
            width: "200px",
        },
        {
            name: 'Aksi',
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                  <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
                    <img
                      onClick={() => deleteDataRiwayatInvoiceHandler(row.tinv_id)}
                      src={deleted}
                      style={{ cursor: "pointer" }}
                      className="ms-2"
                      alt="icon delete"
                    />
                  </OverlayTrigger>
                </div>
              ),
        },
    ];
    const customStyles = {
        headCells: {
            style: {
                width: 'max-content',
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',

            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <img className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} alt="loader" />
          <div>Loading...</div>
        </div>
    );

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

    useEffect(() => {
        listPartner()
        getDataRiwayatInvoiceHandler(firstDayThisMonth, lastDayThisMonth, activePageRiwayatInvoice)
    }, [])
        

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Data Invoice</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Data Invoice</h2>
            </div>
            <div className='base-content mt-4'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                <Row className=''>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3">
                        <span className='me-4'>Nama Partner</span>
                        <div className="dropdown dropVaAndPaylinkPartner" style={{ fontSize: 14, width: "57%" }}>
                            <ReactSelect
                                closeMenuOnSelect={true}
                                hideSelectedOptions={false}
                                options={dataListPartner}
                                value={selectedPartnerRiwayatInvoice}
                                onChange={(selected) => setSelectedPartnerRiwayatInvoice([selected])}
                                placeholder="Pilih Nama Partner"
                                components={{ Option }}
                                styles={customStylesSelectedOption}
                            />
                        </div>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3" >
                        <span >Periode <span style={{ color: "red" }}>*</span></span>
                        <Form.Select name='periode' className="input-text-riwayat ms-3" value={inputHandleRiwayatInvoice.periode} onChange={(e) => handleChangePeriodeRiwayatInvoice(e)}>
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                            <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>Kemarin</option>
                            <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>7 Hari Terakhir</option>
                            <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                            <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3">
                        <span>Fitur</span>
                        <Form.Select name='fiturId' value={inputHandleRiwayatInvoice.fiturId} onChange={(e) => handleChange(e)} className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Fitur</option>
                            <option value={100}>Setllement</option>
                            <option value={102}>Disbursement</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3">
                        <span>Tipe Invoice</span>
                        <Form.Select name='invType' value={inputHandleRiwayatInvoice.invType} onChange={(e) => handleChange(e)} className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Tipe Invoice</option>
                            <option value={100}>Bank</option>
                            <option value={101}>E-Wallet</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} style={{ display: showDateRiwayatInvoice }} className='text-end mt-3'>
                        <DateRangePicker
                            onChange={pickDateRiwayatInvoice}
                            value={stateRiwayatInvoice}
                            clearIcon={null}
                            // calendarIcon={null}
                        />
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    className={(inputHandleRiwayatInvoice.periode !== 0 || dateRangeRiwayatInvoice.length !== 0 || (dateRangeRiwayatInvoice.length !== 0 && inputHandleRiwayatInvoice.partnerId.length !== 0) || (dateRangeRiwayatInvoice.length !== 0 && inputHandleRiwayatInvoice.fiturId !== 0) || (dateRangeRiwayatInvoice.length !== 0 && inputHandleRiwayatInvoice.invType !== 0) ? 'btn-ez-on' :'btn-ez')}
                                    disabled={inputHandleRiwayatInvoice.periode === 0 || (inputHandleRiwayatInvoice.periode === 0 && inputHandleRiwayatInvoice.partnerId.length === 0) || (inputHandleRiwayatInvoice.periode === 0 && inputHandleRiwayatInvoice.fiturId === 0) || (inputHandleRiwayatInvoice.periode === 0 && inputHandleRiwayatInvoice.invType === 0)}
                                    onClick={() => filterGetDataRiwayatInvoiceHandler(selectedPartnerRiwayatInvoice.length !== 0 ? selectedPartnerRiwayatInvoice[0].value : "", inputHandleRiwayatInvoice.invType, inputHandleRiwayatInvoice.fiturId, inputHandleRiwayatInvoice.periode, dateRangeRiwayatInvoice, activePageRiwayatInvoice, 10)}
                                >
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    className={(inputHandleRiwayatInvoice.periode !== 0 || dateRangeRiwayatInvoice.length !== 0 || (dateRangeRiwayatInvoice.length !== 0 && inputHandleRiwayatInvoice.partnerId.length !== 0) || (dateRangeRiwayatInvoice.length !== 0 && inputHandleRiwayatInvoice.fiturId !== 0) || (dateRangeRiwayatInvoice.length !== 0 && inputHandleRiwayatInvoice.invType !== 0) ? 'btn-reset' :'btn-ez-reset')}
                                    disabled={inputHandleRiwayatInvoice.periode === 0 || (inputHandleRiwayatInvoice.periode === 0 && inputHandleRiwayatInvoice.partnerId.length === 0) || (inputHandleRiwayatInvoice.periode === 0 && inputHandleRiwayatInvoice.fiturId === 0) || (inputHandleRiwayatInvoice.periode === 0 && inputHandleRiwayatInvoice.invType === 0)}
                                    onClick={() => resetButtonRiwayatInvoice()}
                                >
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columnsAdmin}
                        data={dataRiwayatInvoice}
                        customStyles={customStyles}
                        highlightOnHover
                        progressPending={pendingRiwayatInvoice}
                        progressComponent={<CustomLoader />}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageRiwayatInvoice}</div>
                    <Pagination
                        activePage={activePageRiwayatInvoice}
                        itemsCountPerPage={pageNumberRiwayatInvoice.row_per_page}
                        totalItemsCount={(pageNumberRiwayatInvoice.row_per_page*pageNumberRiwayatInvoice.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeRiwayatInvoice}
                    />
                </div>
            </div>

            <Modal className='modal-invoice' show={showModalDetailInvoice} onHide={() => setShowModalDetailInvoice(false)} style={{ borderRadius: 8 }}>
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
                                        <td style={{ fontWeight: 700 }}>{dataDetailRiwayatInvoice.tinv_no}</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'hidden', borderTop: 'solid', borderLeft: 'solid', borderRight: 'solid' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden' }}>Tgl</td>
                                        <td style={{ borderRight: 'hidden' }}>:</td>
                                        <td style={{ fontWeight: 700 }}>{dataDetailRiwayatInvoice.tinv_date}</td>
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
                                        <td style={{ fontWeight: 700 }}>{dataDetailRiwayatInvoice?.tinv_data?.partner_detail?.partner_name}</td>
                                    </tr>
                                    <tr style={{ borderBottom: 'hidden', borderLeft: 'solid', borderRight: 'solid', width: '50%' }}>
                                        <td style={{ paddingLeft: 50, width: '20%', borderRight: 'hidden', verticalAlign: 'baseline' }}>Alamat</td>
                                        <td style={{ borderRight: 'hidden', verticalAlign: 'baseline' }}>:</td>
                                        <td style={{ paddingRight: 50, wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'baseline', fontWeight: 700 }}>{dataDetailRiwayatInvoice?.tinv_data?.partner_detail?.partner_address}</td>
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
                                        <td style={{ paddingRight: 214, paddingBottom: 20, wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'baseline', fontWeight: 700 }}>Jl. AM. SANGAJI NO.24 PETOJO UTARA, GAMBIR, JAKARTA PUSAT - 10130 TELP : (021) 63870456</td>
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
                                        dataDetailRiwayatInvoice?.tinv_data?.inv_products ?
                                        dataDetailRiwayatInvoice?.tinv_data?.inv_products.map((item, idx) => {
                                            console.log(item, "item");
                                            return (
                                                <tr key={idx} style={{ border: 'solid', borderBottom: 'hidden', fontWeight: 700 }}>
                                                    <td style={{ paddingLeft: 16, width: 55, textAlign: "center", borderRight: 'hidden' }}>{ idx + 1 }</td>
                                                    <td style={{ borderRight: 'hidden', wordBreak: 'break-word', whiteSpace: 'normal' }}>{ item.prod_name }</td>
                                                    <td style={{ textAlign: "end", borderRight: 'hidden' }}>{ convertToRupiah(item.qty_trx, false, 0) }</td>
                                                    <td style={{ textAlign: "end", borderRight: 'hidden' }}>{ convertToRupiah(item.price_unit, true, 2) }</td>
                                                    <td style={{ textAlign: "end", borderRight: 'hidden' }}>{ convertToRupiah(item.price_total, true, 2) }</td>
                                                </tr>
                                            )
                                        }) :
                                        <tr style={{ border: 'solid', borderBottom: 'hidden' }}>
                                            <td style={{ paddingLeft: 16, width: 155, textAlign: "center", borderRight: 'hidden' }}>1</td>
                                            <td style={{ borderRight: 'hidden' }}>-</td>
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
                                        <td style={{ textAlign: "end" }}>{convertToRupiah(dataDetailRiwayatInvoice?.tinv_data?.inv_total_price, true, 2).slice(3)}</td>
                                        {/* <td style={{ textAlign: "end" }}>{(dataInvoice.inv_dpp !== undefined) ? convertToRupiah(dataInvoice.inv_dpp, true, 2).slice(3) : "0"}</td> */}
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>Potongan Harga</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>0,00</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>DPP</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{convertToRupiah(dataDetailRiwayatInvoice?.tinv_data?.inv_dpp, true, 2).slice(3)}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid' }}>PPN 11%</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'solid', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'solid' }}>{convertToRupiah(dataDetailRiwayatInvoice?.tinv_data?.inv_ppn, true, 2).slice(3)}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 700 }}>
                                        <td style={{ border: 'hidden' }}></td>
                                        {/* <td style={{ paddingLeft: 16, width: 155, borderRight: "hidden", background: "#077E86", color: "#FFFFFF" }}></td> */}
                                        <td style={{ border: 'hidden' }}></td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>Total</td>
                                        <td style={{ borderRight: 'hidden', borderBottom: 'hidden', textAlign: "end" }}>: Rp</td>
                                        <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{convertToRupiah(dataDetailRiwayatInvoice?.tinv_data?.inv_total, true, 2).slice(3)}</td>
                                        {/* <td style={{ textAlign: "end", width: 200, borderRight: 'hidden', borderBottom: 'hidden', borderTop: 'solid' }}>{(totalAmount !== undefined || taxTotalAmount !== undefined) ? convertToRupiah((totalAmount + taxTotalAmount), true, 2).slice(3) : "0"}</td> */}
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                            <table style={{ width: '100%', backgroundColor: 'rgb(242, 242, 242)', fontStyle: 'italic' }}>
                                <tr>
                                    <td>Terbilang: {(dataDetailRiwayatInvoice?.tinv_data?.inv_total !== undefined) ? terbilangDisbursement((dataDetailRiwayatInvoice?.tinv_data?.inv_total).toFixed(2)).toUpperCase() + " RUPIAH" : "NOL RUPIAH"}</td>
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
                            // onClick={CreatePDFfromHTML}
                            className={'add-button mb-3'}
                            style={{ maxWidth: 'fit-content' }}
                            // disabled={Object.keys(dataInvoice).length === 0}
                        >
                            Download PDF
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default RiwayatInvoice