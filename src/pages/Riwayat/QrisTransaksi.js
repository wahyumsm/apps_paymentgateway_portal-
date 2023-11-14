import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import axios from 'axios'
import encryptData from '../../function/encryptData'
import ReactSelect, { components } from 'react-select'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Pagination from 'react-js-pagination'
import * as XLSX from "xlsx"

const QrisTransaksi = () => {
    const user_role = getRole()
    const access_token = getToken();
    const history = useHistory()
    const [inputHandleTransactionReposrtQrisAdmin, setInputHandleTransactionReposrtQrisAdmin] = useState({
        idTransaksi: "",
        rrn: "",
        jenisUsaha: 0,
        statusQris: 0,
        periode: 0
    })
    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [selectedGrupName, setSelectedGrupName] = useState([])

    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [inputHandleBrand, setInputHandleBrand] = useState({
        brandName: 0
    })

    const [dataOutletInQris, setDataOutletInQris] = useState([])
    const [inputHandleOutlet, setInputHandleOutlet] = useState({
        outletName: 0
    })

    const [dataIdKasirInQris, setDataIdKasirInQris] = useState([])
    const [inputHandleIdKasir, setInputHandleIdKasir] = useState({
        idKasirName: 0
    })

    const [dataTransactionReportQris, setDataTransactionReportQris] = useState([])
    const [showDateTransactionReportQris, setShowDateTransactionReportQris] = useState("none")
    const [dateRangeTransactionReportQris, setDateRangeTransactionReportQris] = useState([])
    const [stateTransactionReportQris, setStateTransactionReportQris] = useState(null)
    const [activePageTransactionReportQris, setActivePageTransactionReportQris] = useState(1)
    const [pageNumberTransactionReportQris, setPageNumberTransactionReportQris] = useState({})
    const [totalPageTransactionReportQris, setTotalPageTransactionReportQris] = useState(0)
    const [pendingTransactionReportQris, setPendingTransactionReportQris] = useState(true)
    const [isFilterTransactionReportQris, setIsFilterTransactionReportQris] = useState(false)

    function handleChange(e) {
        getBrandInQrisTransactionHandler(e.value)
        setSelectedGrupName([e])
    }

    function handleChangeBrand(e) {
        getOutletInQrisTransactionHandler(e.target.value)
        setInputHandleBrand({
            ...inputHandleBrand,
            [e.target.name]: e.target.value,
        });
    }

    function handleChangeOutlet(e) {
        getIdKasirInQrisTransactionHandler(selectedGrupName.map((item, idx) => item.value), e.target.value)
        setInputHandleOutlet({
            ...inputHandleOutlet,
            [e.target.name]: e.target.value,
        });
    }

    console.log(selectedGrupName.map((item, idx) => item.value), "selectedGrupName");

    function handleChangeIdKasir(e) {
        setInputHandleIdKasir({
            ...inputHandleIdKasir,
            [e.target.name]: e.target.value,
        });
    }

    function handleChangeTransactionReposrtQris(e) {
        setInputHandleTransactionReposrtQrisAdmin({
            ...inputHandleTransactionReposrtQrisAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionReportQris(e) {
        if (e.target.value === "7") {
            setShowDateTransactionReportQris("")
            setInputHandleTransactionReposrtQrisAdmin({
                ...inputHandleTransactionReposrtQrisAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionReportQris("none")
            setInputHandleTransactionReposrtQrisAdmin({
                ...inputHandleTransactionReposrtQrisAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionReportQris(item) {
        setStateTransactionReportQris(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeTransactionReportQris(item)
        }
    }

    function handlePageChangeDanaMasuk(page) {
        if (isFilterTransactionReportQris) {
            setActivePageTransactionReportQris(page)
            filterGetTransactionReportQris(inputHandleTransactionReposrtQrisAdmin.idTransaksi, inputHandleTransactionReposrtQrisAdmin.rrn, inputHandleTransactionReposrtQrisAdmin.jenisUsaha, selectedGrupName.length !== 0 ? selectedGrupName[0].value : 0, inputHandleBrand.brandName, inputHandleOutlet.outletName, inputHandleIdKasir.idKasirName, inputHandleTransactionReposrtQrisAdmin.statusQris, inputHandleTransactionReposrtQrisAdmin.periode, dateRangeTransactionReportQris, page, 10)
        } else {
            setActivePageTransactionReportQris(page)
            getTransactionReportQris(page)
        }
    }

    console.log(inputHandleIdKasir.idKasirName, "inputHandleIdKasir.idKasirName");
    console.log(dataIdKasirInQris, "dataIdKasirInQris");
    console.log(selectedGrupName.map((item, idx) => item.nou), "selectedGrupName.map((item, idx) => item.nou)");

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transaction_code,
            width: "170px"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "100px"
        },
        {
            name: 'Waktu',
            selector: row => row.trans_date,
            width: "150px"
        },
        {
            name: 'Jenis Usaha',
            selector: row => row.business_type,
            width: "150px"
        },
        {
            name: 'Nama Grup',
            selector: row => row.merchant_name,
            width: "180px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.store_name,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.outlet_name,
            width: "150px"
        },
        {
            name: 'Nama Kasir',
            selector: row => row.cashier_name,
            width: "200px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.cashier_id,
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.amount,
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => row.MDR,
            width: "150px"
        },
        {
            name: 'Pendapatan',
            selector: row => row.net_amount,
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
        },
    ];

    async function getGrupInQrisTransactionHandler() {
        try {
            const auth = "Bearer " + access_token
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGrupQris = await axios.post(BaseURL + "/QRIS/MasterGroup", { data: "" }, { headers: headers })
            // console.log(dataGrupQris, 'ini user detal funct');
            if (dataGrupQris.status === 200 && dataGrupQris.data.response_code === 200 && dataGrupQris.data.response_new_token === null) {
                let newArr = []
                dataGrupQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataGrupInQris(newArr)
            } else if (dataGrupQris.status === 200 && dataGrupQris.data.response_code === 200 && dataGrupQris.data.response_new_token !== null) {
                setUserSession(dataGrupQris.data.response_new_token)
                let newArr = []
                dataGrupQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataGrupInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    console.log(dataGrupInQris, "dataGrupInQris");
    console.log(selectedGrupName, "selectedGrupName");

    async function getBrandInQrisTransactionHandler(nouGrup) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mmerchant_nou": ${nouGrup}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataBrandQris = await axios.post(BaseURL + "/QRIS/MasterBrand", { data: dataParams }, { headers: headers })
            // console.log(dataBrandQris, 'ini user detal funct');
            if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token === null) {
                setDataBrandInQris(dataBrandQris.data.response_data.results)
            } else if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token !== null) {
                setUserSession(dataBrandQris.data.response_new_token)
                setDataBrandInQris(dataBrandQris.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getOutletInQrisTransactionHandler(nouBrand) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"moutlet_nou": ${nouBrand}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataOutletQris = await axios.post(BaseURL + "/QRIS/MasterOutlet", { data: dataParams }, { headers: headers })
            // console.log(dataOutletQris, 'ini user detal funct');
            if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token === null) {
                setDataOutletInQris(dataOutletQris.data.response_data.results)
            } else if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token !== null) {
                setUserSession(dataOutletQris.data.response_new_token)
                setDataOutletInQris(dataOutletQris.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getIdKasirInQrisTransactionHandler(nouOutlet, storeNou) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mmerchant_nou": ${nouOutlet}, "mstore_nou": ${storeNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataIdKasirQris = await axios.post(BaseURL + "/QRIS/MasterCashier", { data: dataParams }, { headers: headers })
            // console.log(dataIdKasirQris, 'ini user detal funct');
            if (dataIdKasirQris.status === 200 && dataIdKasirQris.data.response_code === 200 && dataIdKasirQris.data.response_new_token === null) {
                setDataIdKasirInQris(dataIdKasirQris.data.response_data.results)
            } else if (dataIdKasirQris.status === 200 && dataIdKasirQris.data.response_code === 200 && dataIdKasirQris.data.response_new_token !== null) {
                setUserSession(dataIdKasirQris.data.response_new_token)
                setDataIdKasirInQris(dataIdKasirQris.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getTransactionReportQris(currentPage) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"transaction_code": "", "RRN": "", "mbustype_id": 0, "merchant_nou": 0, "mstore_nou": 0, "outletCode": 0, "mterminal_id": 0, "status": 0, "period": 1, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getDataQrisReport = await axios.post(BaseURL + "/QRIS/TransactionReport", { data: dataParams }, { headers: headers })
            // console.log(getDataQrisReport, 'ini user detal funct');
            if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                setPageNumberTransactionReportQris(getDataQrisReport.data.response_data)
                setTotalPageTransactionReportQris(getDataQrisReport.data.response_data.max_page)
                setDataTransactionReportQris(getDataQrisReport.data.response_data.results)
                setPendingTransactionReportQris(false)
            } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                setUserSession(getDataQrisReport.data.response_new_token)
                getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                setPageNumberTransactionReportQris(getDataQrisReport.data.response_data)
                setTotalPageTransactionReportQris(getDataQrisReport.data.response_data.max_page)
                setDataTransactionReportQris(getDataQrisReport.data.response_data.results)
                setPendingTransactionReportQris(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterGetTransactionReportQris(idTransaksi, rrn, jenisUsaha, grupCode, brandCode, outletCode, idKasir, status, dateId, periode, page, rowPerPage) {
        try {
            setPendingTransactionReportQris(true)
            setIsFilterTransactionReportQris(true)
            setActivePageTransactionReportQris(page)
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"transaction_code": "${idTransaksi}", "RRN": "${rrn}", "mbustype_id": ${jenisUsaha}, "merchant_nou": ${grupCode}, "mstore_nou": ${brandCode}, "moutlet_nou": ${outletCode}, "mterminal_id": ${idKasir}, "status": ${status}, "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getDataQrisReport = await axios.post(BaseURL + "/QRIS/TransactionReport", { data: dataParams }, { headers: headers })
            // console.log(getDataQrisReport, 'ini user detal funct');
            if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1})) 
                setPageNumberTransactionReportQris(getDataQrisReport.data.response_data)
                setTotalPageTransactionReportQris(getDataQrisReport.data.response_data.max_page)
                setDataTransactionReportQris(getDataQrisReport.data.response_data.results)
                setPendingTransactionReportQris(false)
            } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                setUserSession(getDataQrisReport.data.response_new_token)
                getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1})) 
                setPageNumberTransactionReportQris(getDataQrisReport.data.response_data)
                setTotalPageTransactionReportQris(getDataQrisReport.data.response_data.max_page)
                setDataTransactionReportQris(getDataQrisReport.data.response_data.results)
                setPendingTransactionReportQris(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function ExportReportTransactionReportQrisHandler(isFilter, idTransaksi, rrn, jenisUsaha, grupCode, brandCode, outletCode, idKasir, status, dateId, periode) {
        if (isFilter) {
            async function dataExportFilter(idTransaksi, rrn, jenisUsaha, grupCode, brandCode, outletCode, idKasir, status, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transaction_code": "${idTransaksi}", "RRN": "${rrn}", "mbustype_id": ${jenisUsaha}, "merchant_nou": ${grupCode}, "mstore_nou": ${brandCode}, "moutlet_nou": ${outletCode}, "mterminal_id": ${idKasir}, "status": ${status}, "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/QRIS/TransactionReport", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Jenis Usaha": data[i].business_type, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].store_name, "Nama Outlet": data[i].outlet_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].cashier_id, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Jenis Usaha": data[i].business_type, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].store_name, "Nama Outlet": data[i].outlet_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].cashier_id, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(idTransaksi, rrn, jenisUsaha, grupCode, brandCode, outletCode, idKasir, status, dateId, periode)
        } else {
            async function dataExportTransactionQris() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transaction_code": "", "RRN": "", "mbustype_id": 0, "merchant_nou": 0, "mstore_nou": 0, "outletCode": 0, "mterminal_id": 0, "status": 0, "period": 1, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportTransactionQris = await axios.post(BaseURL + "/QRIS/TransactionReport", {data: dataParams}, { headers: headers });
                    if (dataExportTransactionQris.status === 200 && dataExportTransactionQris.data.response_code === 200 && dataExportTransactionQris.data.response_new_token === null) {
                        const data = dataExportTransactionQris.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Jenis Usaha": data[i].business_type, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].store_name, "Nama Outlet": data[i].outlet_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].cashier_id, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                    } else if (dataExportTransactionQris.status === 200 && dataExportTransactionQris.data.response_code === 200 && dataExportTransactionQris.data.response_new_token !== null) {
                        setUserSession(dataExportTransactionQris.data.response_new_token)
                        const data = dataExportTransactionQris.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Jenis Usaha": data[i].business_type, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].store_name, "Nama Outlet": data[i].outlet_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].cashier_id, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportTransactionQris()
        }
    }

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.IDAgen,
        },
        {
            name: 'RRN',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu',
            selector: row => row.noHp
        },
        {
            name: 'Nama Brand',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nama Outlet',
            selector: row => row.namaAgen,
        },
        {
            name: 'ID Kasir',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Nama Kasir',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Potongan MDR',
            selector: row => row.noRekening,
        },
        {
            name: 'Pendapatan',
            selector: row => row.noRekening,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
    ];

    function resetButtonQrisTransaction () {
        getTransactionReportQris(activePageTransactionReportQris)
        setSelectedGrupName([])
        setInputHandleBrand({
            brandName: 0
        })
        setInputHandleOutlet({
            outletName: 0
        })
        setInputHandleIdKasir({
            idKasirName:0
        })
        setInputHandleTransactionReposrtQrisAdmin({
            idTransaksi: "",
            rrn: "",
            jenisUsaha: 0,
            statusQris: 0,
            periode: 0
        })
        setDataBrandInQris([])
        setDataOutletInQris([])
        setShowDateTransactionReportQris("none")
        setDateRangeTransactionReportQris([])
        setStateTransactionReportQris(null)
    }

    const customStylesDanaMasuk = {
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

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "#888888",
            fontSize: "14px",
            fontFamily: "Nunito"
        }),
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Nunito",
            height: "40px",
        })
    }

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "100") {
            getGrupInQrisTransactionHandler()
            getTransactionReportQris(activePageTransactionReportQris)
        }
    }, [access_token])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                user_role !== "102" ? (
                    <>
                        <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Transaksi &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" value={inputHandleTransactionReposrtQrisAdmin.idTransaksi} onChange={(e) => handleChangeTransactionReposrtQris(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode' value={inputHandleTransactionReposrtQrisAdmin.periode} onChange={(e) => handleChangePeriodeTransactionReportQris(e)} className="input-text-riwayat ms-3">
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className='text-end mt-4' style={{ display: showDateTransactionReportQris }}>
                                    <DateRangePicker
                                        onChange={pickDateTransactionReportQris}
                                        value={stateTransactionReportQris}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="me-4">RRN</span>
                                    <input name="rrn" value={inputHandleTransactionReposrtQrisAdmin.rrn} onChange={(e) => handleChangeTransactionReposrtQris(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Jenis Usaha</span>
                                    <Form.Select name='jenisUsaha' value={inputHandleTransactionReposrtQrisAdmin.jenisUsaha} onChange={(e) => handleChangeTransactionReposrtQris(e)} className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                        <option defaultValue disabled value={0}>Pilih Jenis Usaha</option>
                                        <option value={1}>Badan Usaha</option>
                                        <option value={2}>Perseorangan</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span >Nama Grup</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataGrupInQris}
                                            value={selectedGrupName}
                                            onChange={(selected) => handleChange(selected)}
                                            placeholder="Pilih Grup"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <Form.Select name='brandName' value={inputHandleBrand.brandName} onChange={(e) => handleChangeBrand(e)} className='input-text-riwayat'>
                                        <option defaultValue value={0}>Pilih Brand</option>
                                        {
                                            dataBrandInQris.map((item, idx) => {
                                                return (
                                                    <option key={idx} value={item.nou}>{item.name}</option>
                                                )
                                            }) 
                                        }
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <Form.Select name='outletName' value={inputHandleOutlet.outletName} onChange={(e) => handleChangeOutlet(e)} className='input-text-riwayat'>
                                        <option defaultValue value={0}>Pilih Outlet</option>
                                        {
                                            dataOutletInQris.map((item, idx) => {
                                                return (
                                                    <option key={idx} value={item.nou}>{item.name}</option>
                                                )
                                            }) 
                                        }
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <Form.Select name='idKasirName' value={inputHandleIdKasir.idKasirName} onChange={(e) => handleChangeIdKasir(e)} className='input-text-riwayat'>
                                        <option defaultValue value={0}>Pilih Kasir</option>
                                        {
                                            dataIdKasirInQris.map((item, idx) => {
                                                return (
                                                    <option key={idx} value={item.id}>{item.name}</option>
                                                )
                                            }) 
                                        }
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionReposrtQrisAdmin.statusQris} onChange={(e) => handleChangeTransactionReposrtQris(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Status</option>
                                        <option value={1}>Sedang Berjalan</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={9}>Gagal</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterGetTransactionReportQris(inputHandleTransactionReposrtQrisAdmin.idTransaksi, inputHandleTransactionReposrtQrisAdmin.rrn, inputHandleTransactionReposrtQrisAdmin.jenisUsaha, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, inputHandleBrand.brandName, inputHandleOutlet.outletName, inputHandleIdKasir.idKasirName, inputHandleTransactionReposrtQrisAdmin.statusQris, inputHandleTransactionReposrtQrisAdmin.periode, dateRangeTransactionReportQris, activePageTransactionReportQris, 10)}
                                                className={(inputHandleTransactionReposrtQrisAdmin.periode !== 0 || dateRangeTransactionReportQris.length !== 0 || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.idTransaksi.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.rrn.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.jenisUsaha !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.statusQris !== 0) ? 'btn-ez-on' : 'btn-ez')}
                                                disabled={inputHandleTransactionReposrtQrisAdmin.periode === 0 || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.idTransaksi.length === 0) || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.rrn.length === 0) || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.jenisUsaha === 0) || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.statusQris === 0)}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonQrisTransaction()}
                                                className={(inputHandleTransactionReposrtQrisAdmin.periode !== 0 || dateRangeTransactionReportQris.length !== 0 || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.idTransaksi.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.rrn.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.jenisUsaha !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReposrtQrisAdmin.statusQris !== 0) ? 'btn-reset' : 'btn-ez-reset')}
                                                disabled={inputHandleTransactionReposrtQrisAdmin.periode === 0 || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.idTransaksi.length === 0) || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.rrn.length === 0) || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.jenisUsaha === 0) || (inputHandleTransactionReposrtQrisAdmin.periode === 0 && inputHandleTransactionReposrtQrisAdmin.statusQris === 0)}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataTransactionReportQris.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQris, inputHandleTransactionReposrtQrisAdmin.idTransaksi, inputHandleTransactionReposrtQrisAdmin.rrn, inputHandleTransactionReposrtQrisAdmin.jenisUsaha, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, inputHandleBrand.brandName, inputHandleOutlet.outletName, inputHandleIdKasir.idKasirName, inputHandleTransactionReposrtQrisAdmin.statusQris, inputHandleTransactionReposrtQrisAdmin.periode, dateRangeTransactionReportQris)}>Export</Link>
                                    </div>
                                )
                            }
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsAdmin}
                                    data={dataTransactionReportQris}
                                    customStyles={customStylesDanaMasuk}
                                    highlightOnHover
                                    progressPending={pendingTransactionReportQris}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionReportQris}</div>
                                <Pagination
                                    activePage={activePageTransactionReportQris}
                                    itemsCountPerPage={pageNumberTransactionReportQris.row_per_page}
                                    totalItemsCount={(pageNumberTransactionReportQris.row_per_page*pageNumberTransactionReportQris.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeDanaMasuk}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Transaksi &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksiDanaMasukAdmin" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periodeDanaMasukAdmin' className="input-text-riwayat ms-3 ">
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
                                    <span className="me-4">RRN</span>
                                    <input name="idTransaksiDanaMasukAdmin" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                        <option defaultValue disabled value={0}>Pilih Brand</option>
                                        <option value={1}>Periode Buat</option>
                                        <option value={2}>Periode Proses</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                        <option defaultValue disabled value={0}>Pilih Outlet</option>
                                        <option value={1}>Periode Buat</option>
                                        <option value={2}>Periode Proses</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                        <option defaultValue disabled value={0}>Pilih Kasir</option>
                                        <option value={1}>Periode Buat</option>
                                        <option value={2}>Periode Proses</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusDanaMasukAdmin" className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value="">Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={7}>Menunggu Pembayaran</option>
                                        <option value={9}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                className='btn-ez-on'
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                className='btn-reset'
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div style={{ marginBottom: 30 }} className='mt-3'>
                                <Link className="export-span">Export</Link>
                            </div>
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsPartner}
                                    data={agenLists}
                                    customStyles={customStylesDanaMasuk}
                                    highlightOnHover
                                    // progressPending={pendingTransferAdmin}
                                    progressComponent={<CustomLoader />}
                                    // pagination
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default QrisTransaksi