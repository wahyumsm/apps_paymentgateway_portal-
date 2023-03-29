import { Col, Form, Image, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap'
import React from 'react'
import DataTable from 'react-data-table-component'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
// import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import Pagination from 'react-js-pagination'
import SubAccountComponent from '../../components/SubAccountComponent'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { useState } from 'react'
import { DateRangePicker } from 'rsuite'
import "rsuite/dist/rsuite.css";
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { useEffect } from 'react'
import * as XLSX from "xlsx"
import triangleInfo from "../../assets/icon/triangle-info.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSortUp,
    faSortDown,
} from "@fortawesome/free-solid-svg-icons";

const ListRiwayatSubAccount = () => {
    const user_role = getRole()
    const [listAkunPartner, setListAkunPartner] = useState([])
    const column = [
        {
            label: <><img src={triangleInfo} alt="triangle_info" style={{ marginRight: 3, marginTop: -6 }} /> Range Tanggal maksimal 7 hari dan periode mutasi paling lama 90 hari</>,
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
    const [pendingRiwayatTransfer, setPendingRiwayatTransfer] = useState(false)
    const [activePageRiwayatTransfer, setActivePageRiwayatTransfer] = useState(1)
    const [pageNumberRiwayatTransfer, setPageNumberRiwayatTransfer] = useState({})
    const [totalPageRiwayatTransfer, setTotalPageRiwayatTransfer] = useState(0)
    const [isFilterRiwayatTransfer, setIsFilterRiwayatTransfer] = useState(false)
    const [orderId, setOrderId] = useState(0);
    const [orderField, setOrderField] = useState("");
    const history = useHistory()
    const [inputHandle, setInputHandle] = useState({
        idReff: "",
        namaPartner: "",
        fiturTransaksi: 0,
        periodeRiwayatTransfer : 0,
        idTrans: "",
        idReffTrans: "",
        rowPerPage: 10
    })
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    const threeMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate() + 1).toISOString().split('T')[0]
    
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

    const [idTrans, setIdTrans] = useState({
        isDesc: false,
        id: 1
    })

    const [idReffBank, setIdReffBank] = useState({
        isDesc: false,
        id: 1
    })

    const [idReffTrans, setIdReffTrans] = useState({
        isDesc: false,
        id: 1
    })

    const [dates, setDates] = useState({
        isDesc: false,
        id: 1
    })

    const showIdTrans = () => {
        if (!idTrans.isDesc) {
          setIdTrans({ isDesc: true, id: 0 });
        } else {
          setIdTrans({ isDesc: false, id: 1 });
        }
    };

    const showIdReffBank = () => {
        if (!idReffBank.isDesc) {
          setIdReffBank({ isDesc: true, id: 0 });
        } else {
          setIdReffBank({ isDesc: false, id: 1 });
        }
    };

    const showIdReffTrans = () => {
        if (!idReffTrans.isDesc) {
          setIdReffTrans({ isDesc: true, id: 0 });
        } else {
          setIdReffTrans({ isDesc: false, id: 1 });
        }
    };

    const showDates = () => {
        if (!dates.isDesc) {
          setDates({ isDesc: true, id: 0 });
        } else {
          setDates({ isDesc: false, id: 1 });
        }
    };

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleClickSort (orderId, orderField, isFilter) {
        if (orderField === "toffshorebank_code" && isFilter === false) {
            setOrderField("toffshorebank_code");
            showIdTrans()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            getListRiwayatTransfer(1, inputHandle.rowPerPage, orderId, orderField)
        } else if (orderField === "toffshorebank_code" && isFilter === true) {
            setOrderField("toffshorebank_code");
            showIdTrans()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            filterListRiwayatTransaksi(
                inputHandle.idTrans,
                inputHandle.idReffTrans,
                inputHandle.idReff,
                orderId,
                orderField,
                inputHandle.fiturTransaksi,
                inputHandle.namaPartner,
                dateRangeRiwayatTranfer,
                inputHandle.periodeRiwayatTransfer,
                1,
                inputHandle.rowPerPage
            )
        } else if (orderField === "id_referensi" && isFilter === false) {
            setOrderField("id_referensi");
            showIdReffBank()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            getListRiwayatTransfer(1, inputHandle.rowPerPage, orderId, orderField)
        } else if (orderField === "id_referensi" && isFilter === true) {
            setOrderField("id_referensi");
            showIdReffBank()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            filterListRiwayatTransaksi(
                inputHandle.idTrans,
                inputHandle.idReffTrans,
                inputHandle.idReff,
                orderId,
                orderField,
                inputHandle.fiturTransaksi,
                inputHandle.namaPartner,
                dateRangeRiwayatTranfer,
                inputHandle.periodeRiwayatTransfer,
                1,
                inputHandle.rowPerPage
            )
        } else if (orderField === "id_referensi_transaksi" && isFilter === false) {
            setOrderField("id_referensi_transaksi");
            showIdReffTrans()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            getListRiwayatTransfer(1, inputHandle.rowPerPage, orderId, orderField)
        } else if (orderField === "id_referensi_transaksi" && isFilter === true) {
            setOrderField("id_referensi_transaksi");
            showIdReffTrans()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            filterListRiwayatTransaksi(
                inputHandle.idTrans,
                inputHandle.idReffTrans,
                inputHandle.idReff,
                orderId,
                orderField,
                inputHandle.fiturTransaksi,
                inputHandle.namaPartner,
                dateRangeRiwayatTranfer,
                inputHandle.periodeRiwayatTransfer,
                1,
                inputHandle.rowPerPage
            )
        } else if (orderField === "toffshorebank_crtdt" && isFilter === false) {
            setOrderField("toffshorebank_crtdt");
            showDates()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            getListRiwayatTransfer(1, inputHandle.rowPerPage, orderId, orderField)
        } else if (orderField === "toffshorebank_crtdt" && isFilter === true) {
            setOrderField("toffshorebank_crtdt");
            showDates()
            setOrderId(orderId)
            setActivePageRiwayatTransfer(1)
            filterListRiwayatTransaksi(
                inputHandle.idTrans,
                inputHandle.idReffTrans,
                inputHandle.idReff,
                orderId,
                orderField,
                inputHandle.fiturTransaksi,
                inputHandle.namaPartner,
                dateRangeRiwayatTranfer,
                inputHandle.periodeRiwayatTransfer,
                1,
                inputHandle.rowPerPage
            )
        }
    }

    function handlePageChangeRiwayatTransfer(page) {
        if (isFilterRiwayatTransfer) {
            setActivePageRiwayatTransfer(page)
            filterListRiwayatTransaksi(inputHandle.idTrans, inputHandle.idReffTrans, inputHandle.idReff, orderId, orderField, inputHandle.fiturTransaksi, inputHandle.namaPartner, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer, page, inputHandle.rowPerPage)
        } else {
            setActivePageRiwayatTransfer(page)
            getListRiwayatTransfer(page, inputHandle.rowPerPage, orderId, orderField)
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
            selector: row => convertToRupiah(row.toffshorebank_fee_bank, true, 0),
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
          item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
          setDateRangeRiwayatTranfer(item)
        }
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
            idTrans: "",
            idReffTrans: "",
        })
        setStateRiwayatTransfer(null)
        setDateRangeRiwayatTranfer([])
        setShowDateRiwayatTransfer("none")
    }

    async function getListRiwayatTransfer(currentPage, rowPerPage, orderId, orderFieldId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":2, "page":${(currentPage !== 0) ? currentPage : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderFieldId}", "id_referensi": "", "id_referensi_transaksi": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            // console.log(listDataRiwayat, "ini data riwayat");
            if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setPageNumberRiwayatTransfer(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransfer(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransfer(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransfer(false)
            } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listDataRiwayat.data.response_new_token)
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
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

    async function filterListRiwayatTransaksi(idTrans, idReffTrans, idReff, orderId, orderField, transType, namaPartner, periode, dateID, page, rowPerPage) {
        try {
            setPendingRiwayatTransfer(true)
            setIsFilterRiwayatTransfer(true)
            setActivePageRiwayatTransfer(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "id_referensi_transaksi": "${idReffTrans.length !== 0 ? idReffTrans : ""}", "id_referensi":"${(idReff.length !== 0) ? idReff : ""}", "order": ${orderId}, "order_field": "${orderField}", "trans_type": ${transType !== 0 ? transType : 0}, "partner_name":"${namaPartner.length !== 0 ? namaPartner : ""}", "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateID}, "page":${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            // console.log(listDataRiwayat, "ini data riwayat");
            if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setPageNumberRiwayatTransfer(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransfer(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransfer(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransfer(false)
            } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listDataRiwayat.data.response_new_token)
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
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

    function ExportReportRiwayatTransfer (isFilter, idTrans, idReffTrans, idReff, transType, namaPartner, orderId, orderField, periode, dateID) {
        if (isFilter) {
            async function dataExportFilter(idTrans, idReffTrans, idReff, transType, namaPartner, orderId, orderField, periode, dateID) {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "id_referensi_transaksi": "${idReffTrans.length !== 0 ? idReffTrans : ""}", "id_referensi":"${(idReff.length !== 0) ? idReff : ""}", "order": ${orderId}, "order_field": "${orderField}", "trans_type": ${transType !== 0 ? transType : 0}, "partner_name":"${namaPartner.length !== 0 ? namaPartner : ""}", "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateID}, "page":1, "row_per_page": 1000000}`)
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
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].toffshorebank_code, "ID Referensi Bank": data[i].id_referensi, "ID Referensi Transaksi": data[i].id_referensi_transaksi, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Tujuan": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Keterangan": data[i].toffshorebank_desc})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].toffshorebank_code, "ID Referensi Bank": data[i].id_referensi, "ID Referensi Transaksi": data[i].id_referensi_transaksi, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Tujuan": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Keterangan": data[i].toffshorebank_desc})
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
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].toffshorebank_code, "ID Referensi Bank": data[i].id_referensi, "ID Referensi Transaksi": data[i].id_referensi_transaksi, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Tujuan": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Keterangan": data[i].toffshorebank_desc})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].toffshorebank_code, "ID Referensi Bank": data[i].id_referensi, "ID Referensi Transaksi": data[i].id_referensi_transaksi, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Tujuan": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Keterangan": data[i].toffshorebank_desc})
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
            dataExportFilter(idTrans, idReffTrans, idReff, transType, namaPartner, orderId, orderField, periode, dateID)
        } else {
            async function dataDefault() {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":2, "page":1, "row_per_page": 1000000, "order": ${orderId}, "order_field": "${orderField}", "id_referensi": "", "id_referensi_transaksi": ""}`)
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

    async function getAkunPartner() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listPartnerAkun = await axios.post(BaseURL + "/SubAccount/GetAgenAccount", { data: "" }, { headers: headers })
            if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length === 0) {
                setListAkunPartner(listPartnerAkun.data.response_data)
            } else if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length !== 0) {
                setUserSession(listPartnerAkun.data.response_new_token)
                setListAkunPartner(listPartnerAkun.data.response_data)
            }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getListRiwayatTransfer(activePageRiwayatTransfer, inputHandle.rowPerPage, orderId, orderField)
        if (user_role !== '100') {
            getAkunPartner()
        }
    }, [])
    

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none',
                fontFamily: 'Exo'
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
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} /> Sub Account Bank &nbsp;<img alt="" src={breadcrumbsIcon} /> Riwayat Transaksi Sub Account</span>
            <div className='head-title'>
                <h2 className="h4 mt-4 mb-4" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Riwayat Transaksi Sub Account Partner</h2>
            </div>
            {
                user_role === "102" ?
                (
                    listAkunPartner.length !== 0 ?
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
                                    disabledDate={combine(allowedMaxDays(7), allowedRange(threeMonthAgo, currentDate))}  
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
                                <Link to={"#"} onClick={() => ExportReportRiwayatTransfer(isFilterRiwayatTransfer, inputHandle.idTrans, inputHandle.idReffTrans, inputHandle.idReff, inputHandle.fiturTransaksi, inputHandle.namaPartner,orderId, orderField, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer)} className="export-span">Export</Link>
                            </div>
                        }
                        <div className="div-table mt-4 pb-4">
                            {
                                dataRiwayatTransfer.length !== 0 ?
                                (
                                    <DataTable
                                        columns={user_role === "102" ? columnsPartner : columnsAdmin}
                                        data={dataRiwayatTransfer}
                                        customStyles={customStyles}
                                        progressPending={pendingRiwayatTransfer}
                                        progressComponent={<CustomLoader />}
                                        noDataComponent={<div style={{ marginBottom: 10 }}>Tidak ada data</div>}
                                    />
                                ) : (
                                    <div id='table-body' style={{ overflowX: 'auto', maxWidth: 'max-content' }} className='scroll-confirm'>
                                        <table className="table text-center mt-4" id="tableInvoice" hover>
                                            <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                <tr>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 60 }}>No</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 170 }}>ID Referensi</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 150 }}>Waktu</th>
                                                    {user_role !== "102" && <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 160 }}>Nama Partner</th>}
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 170 }}>Jenis Transaksi</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 200 }}>Rekening Sub Account</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 130 }}>Biaya Admin</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "16px", textTransform: 'unset', fontFamily: 'Exo', width: 135 }}>Keterangan</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div className='text-center mb-3'>Tidak ada data</div>
                                    </div>
                                )
                            }
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
                    </div> :
                    <SubAccountComponent/>
                ) : (
                    <div className="base-content mt-3">
                        <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                            Filter
                        </span>
                        <Row className="mt-4">
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>ID Transaksi</div>
                                <input
                                    name="idTrans"
                                    value={inputHandle.idTrans}
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Transaksi"
                                />
                            </Col>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>ID Referensi Bank</div>
                                <input
                                    name="idReff"
                                    value={inputHandle.idReff}
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Referensi"
                                />
                            </Col>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>ID Referensi Transaksi</div>
                                <input
                                    name="idReffTrans"
                                    value={inputHandle.idReffTrans}
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID ref Transaksi"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>Nama Partner</div>
                                <input
                                    name="namaPartner"
                                    value={inputHandle.namaPartner}
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan Nama Agen"
                                />
                            </Col>
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                                style={{ width: (showDateRiwayatTranfer === "none") ? "33%" : "33%" }}
                            >
                                <div>Periode <span style={{ color: "red" }}>*</span></div>
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
                        <Row className='mt-4'>
                            <Col xs={4}></Col>
                            <Col xs={4} className='d-flex justify-content-end align-items-center' >
                                <div style={{ display: showDateRiwayatTranfer }}>
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
                                        disabledDate={combine(allowedMaxDays(7), allowedRange(threeMonthAgo, currentDate))}  
                                        className='datePicker'
                                        locale={Locale}
                                        format="yyyy-MM-dd"
                                        defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset" }}>
                                        <button 
                                            className={((inputHandle.periodeRiwayatTransfer === "2") || (inputHandle.periodeRiwayatTransfer === "3") || (inputHandle.periodeRiwayatTransfer === "4") || (inputHandle.periodeRiwayatTransfer !== 0 && dateRangeRiwayatTranfer.length !== 0) ) ? "btn-ez-on" : "btn-ez"} 
                                            disabled={inputHandle.periodeRiwayatTransfer === 0 || ( inputHandle.periodeRiwayatTransfer === "7" && dateRangeRiwayatTranfer.length === 0) } 
                                            onClick={() => filterListRiwayatTransaksi(inputHandle.idTrans, inputHandle.idReffTrans, inputHandle.idReff, orderId, orderField, inputHandle.fiturTransaksi, inputHandle.namaPartner, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer, 1, inputHandle.rowPerPage)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button className={(inputHandle.periodeRiwayatTransfer !== 0 || dateRangeRiwayatTranfer.length !== 0 || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.idReff.length !== 0) || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.namaPartner.length !== 0) || (dateRangeRiwayatTranfer.length !== 0 && inputHandle.fiturTransaksi !== 0)) ? "btn-reset" : "btn-ez"} 
                                        disabled={inputHandle.periodeRiwayatTransfer === 0 || (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.idReff.length === 0) || (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.namaPartner.length === 0)|| (inputHandle.periodeRiwayatTransfer === 0 && inputHandle.fiturTransaksi === 0)} 
                                        onClick={() => resetButtonHandle()}
                                    >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            dataRiwayatTransfer.length !== 0 && 
                            <div className='mt-3 mb-5'>
                                <Link to={"#"} onClick={() => ExportReportRiwayatTransfer(isFilterRiwayatTransfer, inputHandle.idTrans, inputHandle.idReffTrans, inputHandle.idReff, inputHandle.fiturTransaksi, inputHandle.namaPartner,orderId, orderField, dateRangeRiwayatTranfer, inputHandle.periodeRiwayatTransfer)} className="export-span">Export</Link>
                            </div>
                        }
                        <div className="div-table mt-4 pb-4" id="tableInvoice" style={{  overflowX: "auto" }}>
                            {
                                dataRiwayatTransfer.length !== 0 ? (
                                    // <DataTable
                                    //     columns={user_role === "102" ? columnsPartner : columnsAdmin}
                                    //     data={dataRiwayatTransfer}
                                    //     customStyles={customStyles}
                                    //     progressPending={pendingRiwayatTransfer}
                                    //     progressComponent={<CustomLoader />}
                                    // />

                                    <>
                                        <table className="table mt-3"  hover>
                                            <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)", borderStyle: "hidden" }}>
                                                <tr>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 60 }}>No</th>
                                                    {!idTrans.isDesc ? <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                    {!idReffBank.isDesc ? <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                    {!idReffTrans.isDesc ? <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                    {!dates.isDesc ? <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Waktu <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterRiwayatTransfer)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Waktu <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 160 }}>Nama Partner</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 170 }}>Jenis Transaksi</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 200 }}>Rekening Tujuan</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo' }}>Nominal</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 135 }}>Keterangan</th>
                                                </tr>
                                            </thead>
                                            {
                                                !pendingRiwayatTransfer && (
                                                    <tbody>
                                                        {
                                                            dataRiwayatTransfer.map((item, idx) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center", padding: "0.75rem 1rem" }}>{ item.number }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_code }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi_transaksi.length === 0 ? `-` : item.id_referensi_transaksi }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_crtdt_format }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.mpartner_name }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.moffshorebank_type_name }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_account }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ convertToRupiah(item.offshore_amount, true, 0) }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.keterangan.length === 0 ? "-" : item.keterangan }</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                )
                                            }
                                        </table> 
                                        {pendingRiwayatTransfer && (<div className='text-center'><CustomLoader /></div>)}
                                    </>
                                    
                                ) : (
                                    <div id='table-body' style={{ overflowX: 'auto', maxWidth: 'max-content' }} className='scroll-confirm'>
                                        <>
                                            <table className="table text-center mt-4" id="tableInvoice" hover>
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 60 }}>No</th>
                                                        {!idTrans.isDesc ? <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                        {!idReffBank.isDesc ? <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!idReffTrans.isDesc ? <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!dates.isDesc ? <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Waktu <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterRiwayatTransfer)} style={{ textTransform: "none", ackground: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Waktu <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 160 }}>Nama Partner</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 170 }}>Jenis Transaksi</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 200 }}>Rekening Tujuan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo' }}>Nominal</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 135 }}>Keterangan</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            {!pendingRiwayatTransfer ? <div className='text-center pb-3' style={{ color: '#393939' }}>Tidak ada data</div> : <div className='text-center'><CustomLoader /></div>}
                                        </>
                                    </div>
                                )
                            }
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
                )
            }
        </div>
    )
}

export default ListRiwayatSubAccount