import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { useHistory } from 'react-router';
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap';
import ReactSelect, { components } from 'react-select';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import axios from 'axios';
import encryptData from '../../function/encryptData';
import Pagination from 'react-js-pagination';

const DisbursementTimeout = () => {
    const history = useHistory()
    const user_role = getRole();
    const [dataListPartner, setDataListPartner] = useState([])
    const [selectedPartnerDisbursement, setSelectedPartnerDisbursement] = useState([])
    const [dataDisbursementTimeout, setDataDisbursementTimeout] = useState([])
    const [pendingDisbursementTimeout, setPendingDisbursementTimeout] = useState(true)
    const [activePageDisbursementTimeout, setActivePageDisbursementTimeout] = useState(1)
    const [pageNumberDisbursementTimeout, setPageNumberDisbursementTimeout] = useState({})
    const [totalPageDisbursementTimeout, setTotalPageDisbursementTimeout] = useState(0)
    const [isFilterDisburseTimeout, setIsFilterDisburseTimeout] = useState(false)

    const [stateDateDisbursementTimeout, setStateDisbursementTimeout] = useState(null)
    const [dateRangeDisbursementTimeout, setDateRangeDisbursementTimeout] = useState([])
    const [showDateDisbursementTimeout, setShowDateDisbursementTimeout] = useState("none")

    const [inputHandleTimeout, setInputHandleTimeout] = useState({
        transID: "",
        periodeDisburseTimeout: 0,
        partnerTransId: "",
        reffNo: "",
    })

    function toDashboard() {
        history.push("/");
    }

    function pickDateDisbursementTimeout(item) {
        setStateDisbursementTimeout(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeDisbursementTimeout(item)
        }
    }

    function handleChangePeriodeDisburseTimeout(e) {
        
        if (e.target.value === "7") {
            setShowDateDisbursementTimeout("")
            setInputHandleTimeout({
                ...inputHandleTimeout,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateDisbursementTimeout("none")
            setInputHandleTimeout({
                ...inputHandleTimeout,
                [e.target.name] : e.target.value
            })
        }
    }

    function handlePageChangeDisbursement(page) {
        if (isFilterDisburseTimeout) {
            setActivePageDisbursementTimeout(page)
            filterDisbursementTimeout(inputHandleTimeout.transID, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandleTimeout.periodeDisburseTimeout, dateRangeDisbursementTimeout, inputHandleTimeout.partnerTransId, inputHandleTimeout.reffNo, page, 10)
        } else {
            setActivePageDisbursementTimeout(page)
            disbursementTimeoutReport(page)
        }
    }

    function resetButtonHandle() {
        disbursementTimeoutReport(activePageDisbursementTimeout)
        setInputHandleTimeout({
            ...inputHandleTimeout,
            transID: "",
            periodeDisburseTimeout: 0,
            partnerTransId: "",
            reffNo: ""
        })
        setSelectedPartnerDisbursement([])
        setStateDisbursementTimeout(null)
        setDateRangeDisbursementTimeout([])
        setShowDateDisbursementTimeout("none")
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
                // setDataListPartner(listPartner.data.response_data)
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
                // setDataListPartner(listPartner.data.response_data)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function disbursementTimeoutReport(currentPage) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transID" : "", "sub_partner_id":"", "dateID": 7, "date_from": "2023-04-11", "date_to": "2023-04-16", "partner_trans_id":"", "partner_reference_no": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataDisburseTimeout = await axios.post(BaseURL + "/Report/HistoryTimeoutDisburse", {data: dataParams}, { headers: headers });
            if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length === 0) {
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                setPendingDisbursementTimeout(false)
            } else if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length !== 0) {
                setUserSession(dataDisburseTimeout.data.response_new_token)
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                setPendingDisbursementTimeout(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterDisbursementTimeout(transId, subPartnerId, dateId, periode, partnerTransId, reffNo, page, rowPerPage) {
        try {
            setPendingDisbursementTimeout(true)
            setIsFilterDisburseTimeout(true)
            setActivePageDisbursementTimeout(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transID" : "${transId}", "sub_partner_id":"${subPartnerId}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", "partner_reference_no": "${reffNo}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataDisburseTimeout = await axios.post(BaseURL + "/Report/HistoryTimeoutDisburse", {data: dataParams}, { headers: headers });
            if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length === 0) {
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                // setTotalDisbursement(dataDisburseTimeout.data.response_data.results.total_settlement)
                setPendingDisbursementTimeout(false)
            } else if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length !== 0) {
                setUserSession(dataDisburseTimeout.data.response_new_token)
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                // setTotalDisbursement(dataDisburseTimeout.data.response_data.results.total_settlement)
                setPendingDisbursementTimeout(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    const columnDisburseTimeout = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transID,
            width: "160px"
        },
        {
            name: 'Waktu',
            selector: row => row.processDate,
            width: "170px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            width: "200px",
            wrap: true
        },
        {
            name: 'Nama Partner',
            selector: row => row.partnerName,
            width: "140px"
        },
        {
            name: 'Nominal',
            selector: row => row.amount,
            width: "150px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
        },
        {
            name: 'Biaya Bank',
            selector: row => row.feeBank,
            width: "130px"
        },
        {
            name: 'Total Biaya',
            selector: row => row.totalAmount,
            width: "130px"
        },
        {
            name: 'Reference No',
            selector: row => row.partner_reference_no,
            width: "190px",
            wrap: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px 0px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.statusID === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.statusID === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                }
            ]
        },

    ]

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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    const customStylesDisbursement = {
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

    useEffect(() => {
      listPartner()
      if (user_role !== "102") {
          disbursementTimeoutReport(activePageDisbursementTimeout)
      }
      
    }, [])
    

    return (
        <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement Timeout</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{(user_role === "102") ? "Riwayat Disbursement" : "Disbursement Timeout"}</h2>
            </div>
            <div className='main-content mt-2'>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-3'>ID Transaksi</span>
                            <input type='text'className='input-text-report' placeholder='Masukkan ID Transaksi'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-4'>Nama Partner</span>
                            <div className="dropdown dropDisbursePartner">
                                <ReactSelect
                                    // isMulti
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataListPartner}
                                    // allowSelectAll={true}
                                    value={selectedPartnerDisbursement}
                                    onChange={(selected) => setSelectedPartnerDisbursement([selected])}
                                    placeholder="Pilih Nama Partner"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </div>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{  width: (showDateDisbursementTimeout === "none") ? "33.2%" : "33.2%" }}>
                            <span style={{ marginRight: 26 }}>Periode <span style={{ color: "red" }}>*</span></span>
                            <Form.Select name='periodeDisburseTimeout' className="input-text-ez" value={inputHandleTimeout.periodeDisburseTimeout} onChange={(e) => handleChangePeriodeDisburseTimeout(e)}>
                                <option defaultChecked disabled value={0}>Pilih Periode</option> 
                                <option value={2}>Hari Ini</option>
                                <option value={3}>Kemarin</option>
                                <option value={4}>7 Hari Terakhir</option>
                                <option value={5}>Bulan Ini</option>
                                <option value={6}>Bulan Kemarin</option>
                                <option value={7}>Pilih Range Tanggal</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Partner Trans ID</span>
                            <input type='text'className='input-text-report ms-2' placeholder='Masukkan Partner Trans ID'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-2'>Reference No</span>
                            <input type='text'className='input-text-report' placeholder='Masukkan Reference No'/>
                        </Col>
                        <Col xs={4} style={{ display: showDateDisbursementTimeout }}>
                            <div className='text-end me-4'>
                                <DateRangePicker 
                                    onChange={pickDateDisbursementTimeout}
                                    value={stateDateDisbursementTimeout}
                                    clearIcon={null}
                                    // calendarIcon={null}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={5}>
                            <Row>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        className='btn-ez-on'
                                        onClick={() => filterDisbursementTimeout(inputHandleTimeout.transID, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandleTimeout.periodeDisburseTimeout, dateRangeDisbursementTimeout, inputHandleTimeout.partnerTransId, inputHandleTimeout.reffNo, 1, 10)}
                                        // className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.referenceNo.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                        // disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        className='btn-reset'
                                        onClick={() => resetButtonHandle()}
                                        // className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.referenceNo.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                        // disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                                    >
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="div-table mt-4 pb-4">
                        <DataTable
                                columns={columnDisburseTimeout}
                                data={dataDisbursementTimeout}
                                customStyles={customStylesDisbursement}
                                progressPending={pendingDisbursementTimeout}
                                progressComponent={<CustomLoader />}
                                // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                // pagination
                            />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDisbursementTimeout}</div>
                            <Pagination
                                activePage={activePageDisbursementTimeout}
                                itemsCountPerPage={pageNumberDisbursementTimeout.row_per_page}
                                totalItemsCount={(pageNumberDisbursementTimeout.row_per_page*pageNumberDisbursementTimeout.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeDisbursement}
                            />
                        </div>
                </div>
            </div>
        </div>
    )
}

export default DisbursementTimeout