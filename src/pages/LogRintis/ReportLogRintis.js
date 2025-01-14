import React, { useEffect, useRef, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import DataTable, { defaultThemes } from 'react-data-table-component'
import Pagination from 'react-js-pagination'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import fileCsv from "../../assets/img/download.png";
import { BaseURL, convertToRupiah, errorCatch, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const ReportLogRintis = () => {

    const history = useHistory()
    const [dataReportLogRintis, setDataReportLogRintis] = useState([])
    const [showDateReportLogRintis, setShowDateReportLogRintis] = useState("none")
    const [dateRangeReportLogRintis, setDateRangeReportLogRintis] = useState([])
    const [stateReportLogRintis, setStateReportLogRintis] = useState(null)
    const [activePageReportLogRintis, setActivePageReportLogRintis] = useState(1)
    const [pageNumberReportLogRintis, setPageNumberReportLogRintis] = useState({})
    const [totalPageReportLogRintis, setTotalPageReportLogRintis] = useState(0)
    const [pendingReportLogRintis, setPendingReportLogRintis] = useState(true)
    const [isFilterReportLogRintis, setIsFilterReportLogRintis] = useState(false)
    const [inputHandleReportLogRintis, setInputHandleReportLogRintis] = useState({
        type: "",
        rrn: "",
        fileName: "",
        statusLog: "",
        periode: 0,
        partnerTransId: ""
    })
    const hiddenFileInputCsv = useRef(null)
    const [imageFileCsv, setImageFileCsv] = useState(null)
    const [imageCsv, setImageCsv] = useState(null)
    const [nameImageCsv, setNameImageCsv] = useState("")
    const [fileSizeCsv, setFileSizeCsv] = useState(false)

    function handleChangeReportLogRintis(e) {
        setInputHandleReportLogRintis({
            ...inputHandleReportLogRintis,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeReportLogRintis(e) {
        if (e.target.value === "7") {
            setShowDateReportLogRintis("")
            setInputHandleReportLogRintis({
                ...inputHandleReportLogRintis,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateReportLogRintis("none")
            setDateRangeReportLogRintis([])
            setInputHandleReportLogRintis({
                ...inputHandleReportLogRintis,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateReportLogRintis(item) {
        setStateReportLogRintis(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeReportLogRintis(item)
        }
    }

    function handlePageChangeReportLogRintis(page) {
        if (isFilterReportLogRintis) {
            setActivePageReportLogRintis(page)
            filterListRiwayatLogRintisHandler(inputHandleReportLogRintis.type, inputHandleReportLogRintis.fileName, inputHandleReportLogRintis.rrn, inputHandleReportLogRintis.partnerTransId, inputHandleReportLogRintis.statusLog, inputHandleReportLogRintis.periode, dateRangeReportLogRintis, page, 10)
        } else {
            // console.log("masuk2");
            // console.log(page);
            setActivePageReportLogRintis(page)
            getListRiwayatLogRintisHandler(page)
        }
    }

    const handleClickCsv = () => {
        hiddenFileInputCsv.current.click();
    };

    const handleFileChangeCsv = (event) => {
        if(event.target.files[0]) {
            setImageCsv(event.target.files[0])
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setFileSizeCsv(true)
                setImageFileCsv(null)
                setNameImageCsv("")
            }
            else {
                setNameImageCsv(event.target.files[0].name)
                setFileSizeCsv(false)
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    setImageFileCsv(reader.result)
                })
                reader.readAsDataURL(event.target.files[0])
            }
        }
    }

    // console.log(imageFileCsv, "imageFileCsv");
    // console.log(imageCsv, "imageCsv");

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'File Name',
            selector: row => row.log_filename,
            width: "170px",
            wrap: "true"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.log_partner_trans_id === null ? "-" : row.log_partner_trans_id,
            width: "170px",
            wrap: "true"
        },
        {
            name: 'Invoice Number',
            selector: row => row.log_inv_numb,
            width: "190px"
        },
        {
            name: 'Trans Date',
            selector: row => row.log_transdate,
            width: "170px"
        },
        {
            name: 'RRN',
            selector: row => row.log_rrn,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Code',
            selector: row => row.log_code,
            wrap: true,
            width: "130px"
        },
        {
            name: 'MPAN',
            selector: row => row.log_merchant_pan,
            wrap: true,
            width: "150px"
        },
        {
            name: 'CPAN',
            selector: row => row.log_cardnumber,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Terminal_loc',
            selector: row => row.log_terminal_loc,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Amount',
            selector: row => convertToRupiah(row.log_amount),
            wrap: true,
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.log_status,
            // style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
        },
    ];

    async function uploadFileCsvHandler(fileCsv) {
        try {
            const auth = "Bearer " + getToken()
            const formData = new FormData()
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            formData.append('file', fileCsv)
            const dataUploadFile = await axios.post(BaseURL + "/QRIS/UploadRintisSuspendTransaction", formData, { headers: headers })
            // console.log(dataUploadFile, "ini data riwayat");
            if (dataUploadFile.data.response_code === 200 && dataUploadFile.status === 200 && dataUploadFile.data.response_new_token === null) {
                alert(dataUploadFile.data.response_data.results)
                window.location.reload()
            } else if (dataUploadFile.data.response_code === 200 && dataUploadFile.status === 200 && dataUploadFile.data.response_new_token !== null) {
                setUserSession(dataUploadFile.data.response_new_token)
                alert(dataUploadFile.data.response_data.results)
                window.location.reload()
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function getListRiwayatLogRintisHandler(currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"type": "", "filename": "", "rrn": "", "partner_trans_id": "", "tracenumber": "", "status": "APP,SPN,DEC", "date_from": "", "date_to": "", "period": 2, "page":${(currentPage !== 0) ? currentPage : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            const listDataLogRintis = await axios.post(BaseURL + "/QRIS/GetRintisLog", { data: dataParams }, { headers: headers })
            // console.log(listDataLogRintis, "ini data riwayat");
            if (listDataLogRintis.data.response_code === 200 && listDataLogRintis.status === 200 && listDataLogRintis.data.response_new_token === null) {
                listDataLogRintis.data.response_data.results = listDataLogRintis.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataReportLogRintis(listDataLogRintis.data.response_data.results)
                setPageNumberReportLogRintis(listDataLogRintis.data.response_data)
                setTotalPageReportLogRintis(listDataLogRintis.data.response_data.max_page)
                setPendingReportLogRintis(false)
            } else if (listDataLogRintis.data.response_code === 200 && listDataLogRintis.status === 200 && listDataLogRintis.data.response_new_token !== null) {
                setUserSession(listDataLogRintis.data.response_new_token)
                listDataLogRintis.data.response_data.results = listDataLogRintis.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataReportLogRintis(listDataLogRintis.data.response_data.results)
                setPageNumberReportLogRintis(listDataLogRintis.data.response_data)
                setTotalPageReportLogRintis(listDataLogRintis.data.response_data.max_page)
                setPendingReportLogRintis(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListRiwayatLogRintisHandler(type, fileName, rrn, partnerTransId, status, dateId, periode, page, rowPerPage) {
        try {
            setPendingReportLogRintis(true)
            setIsFilterReportLogRintis(true)
            setActivePageReportLogRintis(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"type": "${type}", "filename":"${fileName}", "rrn": "${rrn}", "partner_trans_id": "${partnerTransId}", "tracenumber": "", "status": "${status}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            const listDataLogRintis = await axios.post(BaseURL + "/QRIS/GetRintisLog", { data: dataParams }, { headers: headers })
            // console.log(listDataLogRintis, "ini data riwayat");
            if (listDataLogRintis.data.response_code === 200 && listDataLogRintis.status === 200 && listDataLogRintis.data.response_new_token === null) {
                listDataLogRintis.data.response_data.results = listDataLogRintis.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataReportLogRintis(listDataLogRintis.data.response_data.results)
                setPageNumberReportLogRintis(listDataLogRintis.data.response_data)
                setTotalPageReportLogRintis(listDataLogRintis.data.response_data.max_page)
                setPendingReportLogRintis(false)
            } else if (listDataLogRintis.data.response_code === 200 && listDataLogRintis.status === 200 && listDataLogRintis.data.response_new_token !== null) {
                setUserSession(listDataLogRintis.data.response_new_token)
                listDataLogRintis.data.response_data.results = listDataLogRintis.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataReportLogRintis(listDataLogRintis.data.response_data.results)
                setPageNumberReportLogRintis(listDataLogRintis.data.response_data)
                setTotalPageReportLogRintis(listDataLogRintis.data.response_data.max_page)
                setPendingReportLogRintis(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonReportLogRintis () {
        getListRiwayatLogRintisHandler(activePageReportLogRintis)
        setInputHandleReportLogRintis({
            ...inputHandleReportLogRintis,
            type: "",
            rrn: "",
            fileName: "",
            statusLog: "",
            periode: 0, 
            partnerTransId: ""
        })
        setStateReportLogRintis(null)
        setDateRangeReportLogRintis([])
        setShowDateReportLogRintis("none")
    }

    const customStylesLogRintis = {
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
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        getListRiwayatLogRintisHandler(activePageReportLogRintis)
    }, [])


    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}> Beranda </span> &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Log Rintis</span>
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Riwayat Log Rintis</div>
            </div>
            <div className='base-content mt-3'>
                <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                    File CSV
                </span>
                <div className='viewDragDrop mt-3 mb-3' onClick={handleClickCsv}  style={{cursor: "pointer"}}>
                    {
                        !imageFileCsv && fileSizeCsv === false ?
                        <>
                            <div className='pt-4 text-center'>Masukkan File CSV.</div>
                            <input
                                type="file"
                                onChange={(e) => handleFileChangeCsv(e)}
                                accept=".csv"
                                style={{ display: "none" }}
                                ref={hiddenFileInputCsv}
                                id="image"
                                name="image"
                            />
                            <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .csv</div>
                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                        </> : (fileSizeCsv === true) ?
                        <>
                            <div className='mt-4 d-flex justify-content-center align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "Nunito" }}>
                                <img src={noteIconRed} className="me-2" alt="icon notice" />
                                <div>File lebih dari 500kb</div>
                            </div>
                            <input
                                type="file"
                                onChange={(e) => handleFileChangeCsv(e)}
                                accept=".csv"
                                style={{ display: "none" }}
                                ref={hiddenFileInputCsv}
                                id="image"
                                name="image"
                            />
                            <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .csv</div>
                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                        </> :
                        <>
                            <img src={fileCsv} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                            <input
                                type="file"
                                onChange={(e) => handleFileChangeCsv(e)}
                                accept=".csv"
                                style={{ display: "none" }}
                                ref={hiddenFileInputCsv}
                                id="image"
                                name="image"
                            />
                            <div className='mt-2 ms-4'>{nameImageCsv}</div>
                            <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format: .csv</div>
                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                        </>
                    }
                </div>
                <div className='d-flex justify-content-end align-items-center mt-3 pb-3'>
                    <button
                        className='btn-ez-on'
                        style={{ width: "20%" }}
                        onClick={() => uploadFileCsvHandler(imageCsv)}
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div className="base-content mt-3">
                <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                    Filter
                </span>
                <Row className="">
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <div>Partner Trans ID</div>
                        <input
                            name="partnerTransId"
                            value={inputHandleReportLogRintis.partnerTransId}
                            onChange={(e) => handleChangeReportLogRintis(e)}
                            type="text"
                            className="input-text-riwayat"
                            placeholder="Masukkan Partner Trans ID"
                        />
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <div>Tipe <span style={{ color: "red" }}>*</span></div>
                        <Form.Select name="type" value={inputHandleReportLogRintis.type} onChange={(e) => handleChangeReportLogRintis(e)} className='input-text-riwayat' style={{ display: "inline" }}>
                            <option defaultChecked disabled value={""}>Pilih Tipe</option>
                            <option value={"Q1"}>Issuer</option>
                            <option value={"Q4"}>Acquirer</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <div>Filename</div>
                        <input
                            name="fileName"
                            value={inputHandleReportLogRintis.fileName}
                            onChange={(e) => handleChangeReportLogRintis(e)}
                            type="text"
                            className="input-text-riwayat"
                            placeholder="Masukkan Filename"
                        />
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <div>RRN</div>
                        <input
                            name="rrn"
                            value={inputHandleReportLogRintis.rrn}
                            onChange={(e) => handleChangeReportLogRintis(e)}
                            type="text"
                            className="input-text-riwayat"
                            placeholder="Masukkan RRN"
                        />
                    </Col>
                    <Col
                        xs={4}
                        className="d-flex justify-content-between align-items-center mt-4"
                        style={{ width: (showDateReportLogRintis === "none") ? "" : "33%" }}
                    >
                        <div>Periode <span style={{ color: "red" }}>*</span></div>
                        <Form.Select
                            name="periode"
                            className="input-text-riwayat"
                            value={inputHandleReportLogRintis.periode}
                            onChange={(e) => handleChangePeriodeReportLogRintis(e)}
                        >
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>Status</span>
                        <Form.Select name="statusLog" value={inputHandleReportLogRintis.statusLog} onChange={(e) => handleChangeReportLogRintis(e)} className='input-text-riwayat'>
                            <option defaultChecked disabled value={""}>Pilih Status</option>
                            <option value={"APP"}>Approved</option>
                            <option value={"SPN"}>Suspend</option>
                            <option value={"DEC"}>Decline</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4}></Col>
                    <Col xs={4} className='d-flex justify-content-end align-items-center mt-4' >
                        <div style={{ display: showDateReportLogRintis }}>
                            <DateRangePicker
                                onChange={pickDateReportLogRintis}
                                value={stateReportLogRintis}
                                clearIcon={null}
                            />
                        </div>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={6} style={{ width: "15%", padding: "0px 15px" }}>
                        <button
                            className={(((inputHandleReportLogRintis.periode === "2" || inputHandleReportLogRintis.periode === "3" || inputHandleReportLogRintis.periode === "4" || inputHandleReportLogRintis.periode === "5" || inputHandleReportLogRintis.periode === "6") && inputHandleReportLogRintis.type.length !== 0) || ((inputHandleReportLogRintis.periode === "7" && dateRangeReportLogRintis.length !== 0) && inputHandleReportLogRintis.type.length !== 0)) ? 'btn-ez-on' : 'btn-ez'}
                            disabled={((inputHandleReportLogRintis.periode === 0 || (inputHandleReportLogRintis.periode === "7" && dateRangeReportLogRintis.length === 0)) || inputHandleReportLogRintis.type.length === 0)}
                            onClick={() => filterListRiwayatLogRintisHandler(inputHandleReportLogRintis.type, inputHandleReportLogRintis.fileName, inputHandleReportLogRintis.rrn, inputHandleReportLogRintis.partnerTransId, inputHandleReportLogRintis.statusLog, inputHandleReportLogRintis.periode, dateRangeReportLogRintis, activePageReportLogRintis, 10)}
                        >
                            Terapkan
                        </button>
                    </Col>
                    <Col xs={6} style={{ width: "15%", padding: "0px 15px" }}>
                        <button
                            className={(inputHandleReportLogRintis.type.length !== 0 || inputHandleReportLogRintis.fileName.length !== 0 || inputHandleReportLogRintis.rrn.length !== 0 || (inputHandleReportLogRintis.periode === "2" || inputHandleReportLogRintis.periode === "3" || inputHandleReportLogRintis.periode === "4" || inputHandleReportLogRintis.periode === "5" || inputHandleReportLogRintis.periode === "6") || (inputHandleReportLogRintis.periode === "7" && dateRangeReportLogRintis.length !== 0) || inputHandleReportLogRintis.statusLog.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                            disabled={(inputHandleReportLogRintis.type.length === 0 && inputHandleReportLogRintis.fileName.length === 0 && inputHandleReportLogRintis.rrn.length === 0 && (inputHandleReportLogRintis.periode === 0 || (inputHandleReportLogRintis.periode === "7" && dateRangeReportLogRintis.length === 0)) && inputHandleReportLogRintis.statusLog.length === 0)}
                            onClick={() => resetButtonReportLogRintis()}
                        >
                            Atur Ulang
                        </button>
                    </Col>
                </Row>
                <div className="div-table mt-5 pb-4">
                    <DataTable
                        columns={columnsAdmin}
                        data={dataReportLogRintis}
                        customStyles={customStylesLogRintis}
                        highlightOnHover
                        progressPending={pendingReportLogRintis}
                        progressComponent={<CustomLoader />}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageReportLogRintis}</div>
                    <Pagination
                        activePage={activePageReportLogRintis}
                        itemsCountPerPage={pageNumberReportLogRintis.row_per_page}
                        totalItemsCount={(pageNumberReportLogRintis.row_per_page*pageNumberReportLogRintis.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeReportLogRintis}
                    />
                </div>
            </div>
        </div>
    )
}

export default ReportLogRintis