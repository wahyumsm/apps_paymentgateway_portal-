import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { BaseURL, convertToRupiah, errorCatch, getToken, setUserSession } from '../../function/helpers'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Pagination from 'react-js-pagination'
import DataTable from 'react-data-table-component'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import axios from 'axios'
import encryptData from '../../function/encryptData'

function TransaksiTopUp() {

    const history = useHistory()
    const access_token = getToken()
    const [dataRiwayatTransaksiTopup, setDataRiwayatTransaksiTopup] = useState([])
    const [inputHandle, setInputHandle] = useState({
        idTransaksiTransaksiTopup: "",
        walletTransaksiTopup: "",
        statusTransaksiTopup: 0,
        periodeTransaksiTopup: 0,
    })
    const [isFilterTransaksiTopup, setIsFilterTransaksiTopup] = useState(false)
    const [pendingTransaksiTopup, setPendingTransaksiTopup] = useState(true)
    const [activePageTransaksiTopup, setActivePageTransaksiTopup] = useState(1)
    const [pageNumberTransaksiTopup, setPageNumberTransaksiTopup] = useState({})
    const [totalPageTransaksiTopup, setTotalPageTransaksiTopup] = useState(0)
    const [showDateTransaksiTopup, setShowDateTransaksiTopup] = useState("none")
    const [stateTransaksiTopup, setStateTransaksiTopup] = useState(null)
    const [dateRangeTransaksiTopup, setDateRangeTransaksiTopup] = useState([])

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [ e.target.name ]: e.target.value
        })
    }

    function handleChangePeriodeTransaksiTopup(e) {
        if (Number(e.target.value) === 7) {
            setShowDateTransaksiTopup("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : Number(e.target.value)
            })
        } else {
            setShowDateTransaksiTopup("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : Number(e.target.value)
            })
        }
    }

    function pickDateTransaksiTopup(item) {
        setStateTransaksiTopup(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeTransaksiTopup(item)
        }
    }

    function handlePageChangeTransaksiTopup(page) {
        if (isFilterTransaksiTopup) {
            setActivePageTransaksiTopup(page)
            // filterRiwayatTransaksiTopup(page, partnerId, inputHandle.idTransaksiTransaksiTopup, inputHandle.periodeTransaksiTopup, dateRangeTransaksiTopup, inputHandle.statusTransaksiTopup, 0)
        } else {
            setActivePageTransaksiTopup(page)
            getListTransaskiTopup(page)
        }
    }

    async function getListTransaskiTopup(currentPage) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mewallet_code" : "", "partner_transid": "", "period": 7, "date_from": "1999-11-20", "date_to": "2999-11-26", "page": 1, "row_per_page": 10, "ttopupewalletlog_status_id": [1,2,7,9]}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listTransaksiTopup = await axios.post(BaseURL + "/Report/GetListHistoryTopUpEwallet", {data: dataParams}, {headers: headers})
            console.log(listTransaksiTopup, 'listTransaksiTopup');
            if (listTransaksiTopup.status === 200 && listTransaksiTopup.data.response_code === 200 && listTransaksiTopup.data.response_new_token.length === 0) {
                listTransaksiTopup.data.response_data.results.list_data = listTransaksiTopup.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberTransaksiTopup(listTransaksiTopup.data.response_data)
                setTotalPageTransaksiTopup(listTransaksiTopup.data.response_data.max_page)
                setDataRiwayatTransaksiTopup(listTransaksiTopup.data.response_data.results.list_data)
                setPendingTransaksiTopup(false)
            } else if (listTransaksiTopup.status === 200 && listTransaksiTopup.data.response_code === 200 && listTransaksiTopup.data.response_new_token.length !== 0) {
                setUserSession(listTransaksiTopup.data.response_new_token)
                listTransaksiTopup.data.response_data.results.list_data = listTransaksiTopup.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberTransaksiTopup(listTransaksiTopup.data.response_data)
                setTotalPageTransaksiTopup(listTransaksiTopup.data.response_data.max_page)
                setDataRiwayatTransaksiTopup(listTransaksiTopup.data.response_data.results.list_data)
                setPendingTransaksiTopup(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterRiwayatTransaksiTopup(params) {
        try {
            console.log('masuk filter function');
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle() {
        setInputHandle({
            idTransaksiTransaksiTopup: "",
            walletTransaksiTopup: "",
            statusTransaksiTopup: 0,
            periodeTransaksiTopup: 0,
        })
        setShowDateTransaksiTopup("none")
        setStateTransaksiTopup(null)
        setDateRangeTransaksiTopup([])
    }

    useEffect(() => {
        getListTransaskiTopup(activePageTransaksiTopup)
    }, [])
    

    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            wrap: true,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.ttopupewalletlog_id,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.id)}>{row.id}</Link>
            width: "145px"
        },
        {
            name: 'Waktu',
            selector: row => row.ttopupewalletlog_crtdt_format,
            width: "145px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.ttopupewalletlog_partner_trans_id,
            // sortable: true,          
            wrap: true,
            // width: "170px",
        },
        {
            name: 'eWallet Code',
            selector: row => row.mewallet_code,
            wrap: true,
            width: "160px"
        },
        {
            name: 'No Handphone',
            selector: row => row.ttopupewalletlog_phone_number,
            wrap: true,
            style: { paddingRight: 'unset' },
          // width: "160px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.ttopupewalletlog_trx_amount,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItem: "center" }}>{ convertToRupiah(row.ttopupewalletlog_trx_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "170px"
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px 20px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.ttopupewalletlog_status_id === "2",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.ttopupewalletlog_status_id === "1" || row.ttopupewalletlog_status_id === "7",
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.ttopupewalletlog_status_id === "4" || row.ttopupewalletlog_status_id === "9",
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.ttopupewalletlog_status_id === "3" || row.ttopupewalletlog_status_id === "5" || row.ttopupewalletlog_status_id === "6" || row.ttopupewalletlog_status_id === "8" || row.ttopupewalletlog_status_id === "10" || row.ttopupewalletlog_status_id === "11" || row.ttopupewalletlog_status_id === "12" || row.ttopupewalletlog_status_id === "13" || row.ttopupewalletlog_status_id === "14" || row.ttopupewalletlog_status_id === "15",
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
                justifyContent: 'flex-start',
                width: '150px'
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
            <div>Loading...</div>
        </div>
    );

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Transaksi Topup</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Riwayat Transaksi Topup</h2>
            </div>
            {/* <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Riwayat Dana Masuk</h2> */}
            <div className='base-content mt-3'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <span>ID Transaksi</span>
                        <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiTransaksiTopup} name="idTransaksiTransaksiTopup" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <span style={{ marginRight: 41 }}>Wallet</span>
                        <Form.Select name="walletTransaksiTopup" className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.walletTransaksiTopup} onChange={(e) => handleChange(e)}>
                            <option defaultChecked disabled value="">Pilih eWallet</option>
                            <option value={"DANA"}>DANA</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <span style={{ marginRight: 41 }}>Status</span>
                        <Form.Select name="statusTransaksiTopup" className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.statusTransaksiTopup} onChange={(e) => handleChange(e)}>
                            <option defaultChecked disabled value={0}>Pilih Status</option>
                            <option value={2}>Berhasil</option>
                            <option value={1}>Dalam Proses</option>
                            <option value={7}>Menunggu Pembayaran</option>
                            <option value={9}>Kadaluwarsa</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateTransaksiTopup === "none") ? "33%" : "33%" }}>
                        <span style={{ marginRight: 40 }}>Periode<span style={{ color: "red" }}>*</span></span>
                        <Form.Select name='periodeTransaksiTopup' className="input-text-riwayat ms-1" value={inputHandle.periodeTransaksiTopup} onChange={(e) => handleChangePeriodeTransaksiTopup(e)}>
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
                <Row className="mt-4">
                    <Col xs={4} style={{ display: showDateTransaksiTopup, marginLeft: 106 }} className='text-start'>
                        <DateRangePicker 
                            onChange={pickDateTransaksiTopup}
                            value={stateTransaksiTopup}
                            clearIcon={null}
                            // calendarIcon={null}
                        />
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button
                                    onClick={() => filterRiwayatTransaksiTopup(1, inputHandle.statusTransaksiTopup, inputHandle.idTransaksiTransaksiTopup, inputHandle.periodeTransaksiTopup, dateRangeTransaksiTopup, 10)}
                                    className={(inputHandle.periodeTransaksiTopup !== 0 || dateRangeTransaksiTopup.length !== 0 || dateRangeTransaksiTopup.length !== 0 && inputHandle.idTransaksiTransaksiTopup.length !== 0 || dateRangeTransaksiTopup.length !== 0 && inputHandle.statusTransaksiTopup.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                    disabled={inputHandle.periodeTransaksiTopup === 0 || inputHandle.periodeTransaksiTopup === 0 && inputHandle.idTransaksiTransaksiTopup.length === 0 || inputHandle.periodeTransaksiTopup === 0 && inputHandle.statusTransaksiTopup.length === 0}
                                >
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button
                                    onClick={resetButtonHandle}
                                    className={(inputHandle.periodeTransaksiTopup || dateRangeTransaksiTopup.length !== 0 || dateRangeTransaksiTopup.length !== 0 && inputHandle.idTransaksiTransaksiTopup.length !== 0 || dateRangeTransaksiTopup.length !== 0 && inputHandle.statusTransaksiTopup.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                    disabled={inputHandle.periodeTransaksiTopup === 0 || inputHandle.periodeTransaksiTopup === 0 && inputHandle.idTransaksiTransaksiTopup.length === 0 || inputHandle.periodeTransaksiTopup === 0 && inputHandle.statusTransaksiTopup.length === 0}
                                >
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    dataRiwayatTransaksiTopup.length !== 0 &&
                    <div style={{ marginBottom: 30 }}>
                        {/* <Link onClick={() => ExportReportTransaksiTopupHandler(isFilterTransaksiTopup, inputHandle.statusTransaksiTopup, inputHandle.idTransaksiTransaksiTopup, inputHandle.periodeTransaksiTopup, dateRangeTransaksiTopup)} className="export-span">Export</Link> */}
                    </div>
                }
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columns}
                        data={dataRiwayatTransaksiTopup}
                        customStyles={customStyles}
                        highlightOnHover
                        progressPending={pendingTransaksiTopup}
                        progressComponent={<CustomLoader />}
                        // pagination
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransaksiTopup}</div>
                    <Pagination
                        activePage={activePageTransaksiTopup}
                        itemsCountPerPage={pageNumberTransaksiTopup.row_per_page}
                        totalItemsCount={(pageNumberTransaksiTopup.row_per_page*pageNumberTransaksiTopup.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeTransaksiTopup}
                    />
                </div>
            </div>
        </div>
    )
}

export default TransaksiTopUp