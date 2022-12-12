import { Col, Form, Image, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap'
import React from 'react'
import DataTable from 'react-data-table-component'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
// import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import Pagination from 'react-js-pagination'
import SubAccountComponent from '../../components/SubAccountComponent'
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { useState } from 'react'
import { DateRangePicker } from 'rsuite'
import "rsuite/dist/rsuite.css";
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { useEffect } from 'react'
import * as XLSX from "xlsx"
import triangleInfo from "../../assets/icon/triangle-info.svg"

const ListRiwayatSubAccount = () => {
    const user_role = getRole()
    const column = [
        {
            label: <><img src={triangleInfo} alt="triangle_info" style={{ marginRight: 3, marginTop: -6 }} /> Range Tanggal maksimal 7 hari dan periode mutasi paling lama 31 hari</>,
            style: {
                color: '#383838',
                width: 'max-content',
                padding: '14px 25px 14px 14px',
                fontSize: 13,
                fontStyle: 'italic',
                textAlign: 'left',
                whiteSpace: 'normal',
                backgroundColor: 'rgba(255, 214, 0, 0.16)',
                opacity: 'unset'
            },
            placement: 'bottom',
            
        },
    ]
    const [dateRangeRiwayatTranfer, setDateRangeRiwayatTranfer] = useState([])
    const [showDateRiwayatTranfer, setShowDateRiwayatTransfer] = useState("none")
    const [stateRiwayatTransfer, setStateRiwayatTransfer] = useState(null)
    const [dataRiwayatTransfer, setDataRiwayatTransfer] = useState([])
    const [pendingRiwayatTransfer, setPendingRiwayatTransfer] = useState(true)
    const [activePageRiwayatTransfer, setActivePageRiwayatTransfer] = useState(1)
    const [pageNumberRiwayatTransfer, setPageNumberRiwayatTransfer] = useState({})
    const [totalPageRiwayatTransfer, setTotalPageRiwayatTransfer] = useState(0)
    const [isFilterRiwayatTransfer, setIsFilterRiwayatTransfer] = useState(false)
    const history = useHistory()
    const [inputHandle, setInputHandle] = useState({
        idReff: "",
        namaPartner: "",
        fiturTransaksi: 0,
        periodeRiwayatTransfer : 0
    })
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    
    const Locale = {
        sunday: 'Min',
        monday: 'Sen',
        tuesday: 'Sel',
        wednesday: 'Rab',
        thursday: 'Kam',
        friday: 'Jum',
        saturday: 'Sab',
        ok: 'Terapkan',
    };
    console.log(stateRiwayatTransfer, "inin state");
    console.log(dateRangeRiwayatTranfer, "ini daterange");

    function handlePageChangeRiwayatTransfer(page) {
        if (isFilterRiwayatTransfer) {
            setActivePageRiwayatTransfer(page)
            filterListRiwayatTransaksi(inputHandle.idReff, inputHandle.fiturTransaksi, inputHandle.namaPartner, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer, page, 0)
        } else {
            setActivePageRiwayatTransfer(page)
            getListRiwayatTransfer(page)
        }
    }

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: '60px'

        },
        {
            name: 'ID Referensi',
            selector: row => row.toffshorebank_code,
            width: '165px',
            sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.toffshorebank_crtdt,
            width: '150px',
            sortable: true
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: '160px'
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.moffshorebank_type_name,
            width: '170px'
        },
        {
            name: 'Rekening Sub Account',
            selector: row => row.toffshorebank_account,
            width: '200px'
        },
        {
            name: 'Nominal',
            selector: row => row.toffshorebank_amount
        },
        {
            name: 'Biaya Admin',
            selector: row => row.toffshorebank_fee,
            width: '130px'
        },
        {
            name: 'Keterangan',
            selector: row => row.toffshorebank_desc,
            width: '135px'
        },
    ]

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: '60px'

        },
        {
            name: 'ID Referensi',
            selector: row => row.toffshorebank_code,
            width: '165px',
            sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.toffshorebank_crtdt,
            width: '150px',
            sortable: true
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.moffshorebank_type_name,
            width: '170px'
        },
        {
            name: 'Rekening Sub Account',
            selector: row => row.toffshorebank_account,
            width: '200px'
        },
        {
            name: 'Nominal',
            selector: row => row.toffshorebank_amount
        },
        {
            name: 'Biaya Admin',
            selector: row => row.toffshorebank_fee,
            width: '130px'
        },
        {
            name: 'Keterangan',
            selector: row => row.toffshorebank_desc,
            width: '135px'
        },
    ]

    function handleChangePeriodeTransfer (e) {
        if (e.target.value === "7") {
            setShowDateRiwayatTransfer("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatTransfer("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateRiwayatTransfer(item) {
        setStateRiwayatTransfer(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeRiwayatTranfer(item)
        }
    }

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function toDashboard() {
        history.push("/");
    }
    
    function toLaporan() {
        history.push("/laporan");
    }

    function resetButtonHandle () {
        setInputHandle({
            ...inputHandle,
            idReff: "",
            namaPartner: "",
            fiturTransaksi:0,
            periodeRiwayatTransfer: 0,
        })
        setStateRiwayatTransfer(null)
        setDateRangeRiwayatTranfer([])
        setShowDateRiwayatTransfer("none")
    }

    async function getListRiwayatTransfer(currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":4, "page":${(currentPage < 1) ? 1 : currentPage}, "row_per_page":10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            console.log(listDataRiwayat, "ini data riwayat");
            if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setPageNumberRiwayatTransfer(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransfer(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransfer(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransfer(false)
            } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listDataRiwayat.data.response_new_token)
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setPageNumberRiwayatTransfer(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransfer(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransfer(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransfer(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListRiwayatTransaksi(idReff, transType, namaPartner, periode, dateID, page, rowPerPage) {
        try {
            setPendingRiwayatTransfer(true)
            setIsFilterRiwayatTransfer(true)
            setActivePageRiwayatTransfer(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"${(idReff.length !== 0) ? idReff : ""}", "trans_type": ${transType !== 0 ? transType : 0}, "partner_name":"${namaPartner.length !== 0 ? namaPartner : ""}", "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateID}, "page":${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            console.log(listDataRiwayat, "ini data riwayat");
            if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setPageNumberRiwayatTransfer(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransfer(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransfer(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransfer(false)
            } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listDataRiwayat.data.response_new_token)
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setPageNumberRiwayatTransfer(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransfer(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransfer(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransfer(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function ExportReportRiwayatTransfer (isFilter, idReff, transType, namaPartner, periode, dateID) {
        if (isFilter) {
            async function dataExportFilter(idReff, transType, namaPartner, periode, dateID) {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"${(idReff.length !== 0) ? idReff : ""}", "trans_type": ${transType !== 0 ? transType : 0}, "partner_name":"${namaPartner.length !== 0 ? namaPartner : ""}", "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateID}, "page":1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
                    // console.log(listDataRiwayat, "ini data riwayat");
                    if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Sub Account .xlsx");
                    } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                        setUserSession(listDataRiwayat.data.response_new_token)
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Sub Account .xlsx");
                    }
                } catch (error) {
                  // console.log(error)
                  history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(idReff, transType, namaPartner, periode, dateID)
        } else {
            async function dataDefault() {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":4, "page":1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
                    console.log(listDataRiwayat, "ini data riwayat");
                    if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Sub Account .xlsx");
                    } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Sub Account .xlsx");
                    }
                } catch (error) {
                  // console.log(error)
                  history.push(errorCatch(error.response.status))
                }
            }
            dataDefault()
        }
    } 

    useEffect(() => {
        getListRiwayatTransfer(activePageRiwayatTransfer)
    }, [])
    

    const customStyles = {
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
          <div>Loading...</div>
        </div>
    );

    return (
        <div className="main-content mt-5" style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Transaksi Sub Account</span>
            <div className='head-title'>
                <h2 className="h4 mt-4 mb-4" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Riwayat Transaksi Sub Account Partner</h2>
            </div>
            {/* <SubAccountComponent/> */}
            <div className="base-content mt-3">
                <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                    Filter
                </span>
                <Row className="mt-4">
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <div>ID Referensi</div>
                        <input
                            name="idReff"
                            value={inputHandle.idReff}
                            onChange={(e) => handleChange(e)}
                            type="text"
                            className="input-text-sub"
                            placeholder="Masukkan ID Referensi"
                        />
                    </Col>
                    {
                        user_role !== "102" ?
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <div>Nama Partner</div>
                            <input
                                name="namaPartner"
                                value={inputHandle.namaPartner}
                                onChange={(e) => handleChange(e)}
                                type="text"
                                className="input-text-sub"
                                placeholder="Masukkan Nama Partner"
                            />
                        </Col> :
                        <Col
                            xs={4}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <div>Jenis Transaksi</div>
                            <Form.Select
                                name="fiturTransaksi"
                                value={inputHandle.fiturTransaksi}
                                onChange={(e) => handleChange(e)}
                                className="input-text-sub"
                                placeholder='Pilih Jenis Transaksi'
                            >
                                <option value={0}>Pilih Jenis Transaksi</option>
                                <option value={1}>Transaksi Masuk ( cr )</option>
                                <option value={2}>Transaksi Keluar ( db )</option>
                            </Form.Select>
                        </Col> 
                    }
                    
                    <Col
                        xs={4}
                        className="d-flex justify-content-between align-items-center"
                        style={{ width: (showDateRiwayatTranfer === "none") ? "33%" : "33%" }}
                    >
                        <div>Periode</div>
                        <Form.Select
                            name="periodeRiwayatTransfer"
                            className="input-text-sub"
                            value={inputHandle.periodeRiwayatTransfer}
                            onChange={(e) => handleChangePeriodeTransfer(e)}
                        >
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row style={{ display: showDateRiwayatTranfer }}>
                    <Col xs={4}></Col>
                    <Col xs={4}></Col>
                    <Col xs={4} className='d-flex justify-content-end align-items-center mt-4 pe-3' >
                        {/* <DateRangePicker
                            onChange={pickDateRiwayatTransfer}
                            value={stateRiwayatTransfer}
                            clearIcon={null}
                            showDoubleView={true}
                            selectRange={true}
                            closeCalendar={true}
                            format={'dd-MM-y'}
                            className="datePicker"
                            activeStartDate={new Date(new Date().setDate((new Date()).getDate() - 30))}
                        /> */}
                        {/* <OverlayTrigger
                            placement="bottom"
                            trigger={["hover"]}
                            overlay={
                            <Tooltip>Range Tanggal maksimal 7 hari dan periode mutasi paling lama 31 hari</Tooltip>
                            }
                        >
                            <img
                            src={triangleInfo}
                            alt="triangle_info"
                            style={{ marginRight: 15 }}
                            />
                        </OverlayTrigger> */}
                        <DateRangePicker 
                            value={stateRiwayatTransfer} 
                            ranges={column} 
                            onChange={(e) => pickDateRiwayatTransfer(e)} 
                            character=' - ' 
                            cleanable={true} 
                            placement={'bottomEnd'} 
                            size='lg' 
                            appearance="default" 
                            placeholder="Select Date Range" 
                            disabledDate={combine(allowedMaxDays(7), allowedRange(oneMonthAgo, currentDate))}  
                            className='datePicker'
                            locale={Locale}
                            format="yyyy-MM-dd"
                            defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                        />
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "unset" }}>
                                <button className={(inputHandle.periodeRiwayatTransfer !== 0 || dateRangeRiwayatTranfer.length !== 0 || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.idReff.length !== 0) || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.namaPartner.length !== 0) || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.fiturTransaksi !== 0)) ? "btn-ez-on" : "btn-ez"} disabled={inputHandle.periodeRiwayatTransfer === 0 || (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.idReff.length === 0) || (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.namaPartner.length === 0)|| (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.fiturTransaksi === 0)} onClick={() => filterListRiwayatTransaksi(inputHandle.idReff, inputHandle.fiturTransaksi, inputHandle.namaPartner, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer, 1, 10)}>
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button className={(inputHandle.periodeRiwayatTransfer !== 0 || dateRangeRiwayatTranfer.length !== 0 || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.idReff.length !== 0) || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.namaPartner.length !== 0) || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.fiturTransaksi !== 0)) ? "btn-reset" : "btn-ez"} disabled={inputHandle.periodeRiwayatTransfer === 0 || (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.idReff.length === 0) || (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.namaPartner.length === 0)|| (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.fiturTransaksi === 0)} onClick={() => resetButtonHandle()}>
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    dataRiwayatTransfer.length !== 0 && 
                    <div className='mt-3 mb-5'>
                        <Link to={"#"} onClick={() => ExportReportRiwayatTransfer(isFilterRiwayatTransfer, inputHandle.idReff, inputHandle.fiturTransaksi, inputHandle.namaPartner, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer)} className="export-span">Export</Link>
                    </div>
                }
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={user_role === "102" ? columnsPartner : columnsAdmin}
                        data={dataRiwayatTransfer}
                        customStyles={customStyles}
                        progressPending={pendingRiwayatTransfer}
                        progressComponent={<CustomLoader />}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageRiwayatTransfer}</div>
                    <Pagination
                        activePage={activePageRiwayatTransfer}
                        itemsCountPerPage={pageNumberRiwayatTransfer.row_per_page}
                        totalItemsCount={(pageNumberRiwayatTransfer.row_per_page*pageNumberRiwayatTransfer.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeRiwayatTransfer}
                    />
                </div>
            </div>
        </div>
    )
}

export default ListRiwayatSubAccount