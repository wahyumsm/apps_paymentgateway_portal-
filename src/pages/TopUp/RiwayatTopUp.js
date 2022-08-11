import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Pagination from 'react-js-pagination'
import { Link, useHistory } from 'react-router-dom'
import { convertToRupiah, getToken, setUserSession } from '../../function/helpers'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import axios from 'axios'
import encryptData from '../../function/encryptData'

function RiwayatTopUp() {

    const history = useHistory()
    const access_token = getToken()
    const [listRiwayat, setListRiwayat] = useState([])
    const [showDateRiwayatTopUp, setShowDateRiwayatTopUp] = useState("none")
    const [stateRiwayatTopup, setStateRiwayatTopup] = useState([])
    const [pageNumberRiwayatTopUp, setPageNumberRiwayatTopUp] = useState(0)
    const [activePageRiwayatTopUp, setActivePageRiwayatTopUp] = useState(1)
    const [totalPageRiwayatTopUp, setTotalPageRiwayatTopUp] = useState(1)
    const [pendingTopup, setPendingTopup] = useState(true)
    const [dateRangeRiwayatTopUp, setDateRangeRiwayatTopUp] = useState([])
    const [inputHandle, setInputHandle] = useState({
        idTransaksiRiwayatTopUp: "",
        statusRiwayatTopUp: [],
        periodeRiwayatTopUp: 0,
    })

    async function listRiwayatTopUp (statusId, transaksiId, dateId, dateRange, currentPage) {
        try {
            console.log(statusId, 'ini status id');
            console.log(transaksiId, 'ini transaksi id');
            console.log(dateId, 'ini date id');
            console.log(dateRange, 'ini date range');
            console.log(currentPage, 'ini current page');
            // setActivePageRiwayatTopUp(currentPage)
            setPendingTopup(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"statusID": [${(statusId !== undefined) ? statusId :[1,2,7,9]}], "transID" : "${(transaksiId !== undefined) ? transaksiId : ""}", "dateID": ${(dateId !== undefined) ? dateId : 2}, "date_from": "${(dateRange.length !== 0) ? dateRange[0] : ""}", "date_to": "${(dateRange.length !== 0) ? dateRange[1] : ""}", "page": ${(currentPage !== undefined) ? currentPage : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listRiwayat = await axios.post("/partner/HistoryTopUpPartnerFilter", { data: dataParams }, { headers: headers })
            console.log(listRiwayat, 'ini data user ');
            if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length === 0) {
                listRiwayat.data.response_data.results = listRiwayat.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberRiwayatTopUp(listRiwayat.data.response_data)
                setTotalPageRiwayatTopUp(listRiwayat.data.response_data.max_page)
                setListRiwayat(listRiwayat.data.response_data.results)
                setPendingTopup(false)
            } else if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listRiwayat.data.response_new_token)
                listRiwayat.data.response_data.results = listRiwayat.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setListRiwayat(listRiwayat.data.response_data.results)
                setPendingTopup(false)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeRiwayatTopUp(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatTopUp("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatTopUp("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
            console.log(inputHandle.periodeRiwayatTopUp, 'ini periode handle');
        }
    }

    function pickDateSettlement(item) {
        console.log(item, 'ini item');
        setStateRiwayatTopup(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            console.log(item, 'ini item');
            setDateRangeRiwayatTopUp(item)
        }
    }

    function handlePageChangeSettlement(page) {
        console.log(page, 'ini page');
        setActivePageRiwayatTopUp(page)
        listRiwayatTopUp(inputHandle.statusRiwayatTopUp, inputHandle.idTransaksiRiwayatTopUp, inputHandle.periodeRiwayatTopUp, dateRangeRiwayatTopUp, page)
    }

    function resetButtonHandle(nol) {
        console.log('reset button handle');
        setInputHandle({
            ...inputHandle,
            idTransaksiRiwayatTopUp: "",
            statusRiwayatTopUp: [],
            periodeRiwayatTopUp: nol,
        })
        console.log(inputHandle.periodeRiwayatTopUp, 'ini periode');
        setStateRiwayatTopup([])
        setDateRangeRiwayatTopUp(undefined)
        setShowDateRiwayatTopUp("none")
        console.log('reset button handle2');
        setInputHandle({
            ...inputHandle,
            periodeRiwayatTopUp: nol,
        })
        console.log(inputHandle.periodeRiwayatTopUp, 'ini periode2');
    }

    function ExportReportSettlementHandler(params) {
        
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
            history.push('/login');
        }
        listRiwayatTopUp(undefined, undefined, undefined, [], undefined)
    }, [access_token])
    

    const columnsRiwayatTopUp = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tparttopup_code,
            // sortable: true
            width: "224px",
            style: { justifyContent: "center", }
        },
        {
            name: 'Nominal',
            selector: row => row.tparttopup_trf_amount_rp,
            style: { justifyContent: "end" },
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Tanggal',
            selector: row => row.tparttopup_crtdt_format,
            // width: "224px",
            style: { justifyContent: "center", },
            // sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tparttopup_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 1 || row.tparttopup_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 4 || row.tparttopup_status_id === 9,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 3 || row.tparttopup_status_id === 5 || row.tparttopup_status_id === 6 || row.tparttopup_status_id === 8 || row.tparttopup_status_id === 10 || row.tparttopup_status_id === 11 || row.tparttopup_status_id === 12 || row.tparttopup_status_id === 13 || row.tparttopup_status_id === 14 || row.tparttopup_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'center',
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          {/* <div>Loading...</div> */}
        </div>
    );

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Top Up</span>
            <div className='main-content'>
                <div className='riwayat-settlement-div mt-4'>
                    <span className='mt-4' style={{fontWeight: 600}}>Riwayat Top Up</span>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>ID Transaksi</span>
                                <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiRiwayatTopUp} name="idTransaksiRiwayatTopUp" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "30%" }}>
                                <span>Periode*</span>
                                <Form.Select name='periodeRiwayatTopUp' className="input-text-ez me-4" value={inputHandle.periodeRiwayatTopUp} onChange={(e) => handleChangePeriodeRiwayatTopUp(e)}>
                                    <option defaultChecked>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Status</span>
                                <Form.Select name="statusRiwayatTopUp" className='input-text-ez me-4' style={{ display: "inline" }} value={inputHandle.statusRiwayatTopUp} onChange={(e) => handleChange(e)}>
                                    <option>Pilih Status</option>
                                    <option value={2}>Berhasil</option>
                                    <option value={1}>In Progress</option>
                                    <option value={7}>Menunggu Pembayaran</option>
                                    <option value={9}>Kadaluwarsa</option>
                                </Form.Select>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ marginLeft: 458, marginTop: 10 }}>
                                <div style={{ display: showDateRiwayatTopUp }}>
                                    <DateRangePicker 
                                        onChange={pickDateSettlement}
                                        value={stateRiwayatTopup}
                                        clearIcon={null}
                                        // calendarIcon={null}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={3}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => listRiwayatTopUp(inputHandle.statusRiwayatTopUp, inputHandle.idTransaksiRiwayatTopUp, inputHandle.periodeRiwayatTopUp, dateRangeRiwayatTopUp, 1)}
                                            className={(inputHandle.periodeRiwayatTopUp || (dateRangeRiwayatTopUp === undefined || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0)) || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.idTransaksiRiwayatTopUp.length !== 0 || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.statusRiwayatTopUp.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            disabled={inputHandle.periodeRiwayatTopUp === 0 || inputHandle.periodeRiwayatTopUp === 0 && inputHandle.idTransaksiRiwayatTopUp.length === 0 || inputHandle.periodeRiwayatTopUp === 0 && inputHandle.statusRiwayatTopUp.length === 0}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle(0)}
                                            className={(inputHandle.periodeRiwayatTopUp || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.idTransaksiRiwayatTopUp.length !== 0 || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.statusRiwayatTopUp.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            disabled={inputHandle.periodeRiwayatTopUp === 0 || inputHandle.periodeRiwayatTopUp === 0 && inputHandle.idTransaksiRiwayatTopUp.length === 0 || inputHandle.periodeRiwayatTopUp === 0 && inputHandle.statusRiwayatTopUp.length === 0}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {/* <div className='settlement-amount'>
                            <div className="card-information mt-3" style={{border: '1px solid #EBEBEB'}}>
                                <p className="p-info">Total Settlement</p>
                            <p className="p-amount">{convertToRupiah(totalSettlement)}</p>
                            </div>
                        </div> */}
                        {/* {
                            dataRiwayatSettlement.length !== 0 &&
                            <div style={{ marginBottom: 30 }}>
                                <Link onClick={() => ExportReportSettlementHandler(isFilterSettlement, inputHandle.statusRiwayatTopUp, inputHandle.idTransaksiRiwayatTopUp, inputHandle.namaPartnerSettlement, inputHandle.periodeRiwayatTopUp, dateRangeRiwayatTopUp, 0)} className="export-span">Export</Link>
                            </div>
                        } */}
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columnsRiwayatTopUp}
                                data={listRiwayat}
                                customStyles={customStyles}
                                progressPending={pendingTopup}
                                progressComponent={<CustomLoader />}
                                // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                // pagination
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageRiwayatTopUp}</div>
                            <Pagination
                                activePage={activePageRiwayatTopUp}
                                itemsCountPerPage={pageNumberRiwayatTopUp.row_per_page}
                                totalItemsCount={(pageNumberRiwayatTopUp.row_per_page*pageNumberRiwayatTopUp.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeSettlement}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiwayatTopUp