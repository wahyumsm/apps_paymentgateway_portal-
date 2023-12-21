import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, convertToRupiah, customFilter, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
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
    const [partnerId, setPartnerId] = useState("")
    const [inputHandleTransactionReportQrisAdmin, setInputHandleTransactionReportQrisAdmin] = useState({
        idTransaksi: "",
        rrn: "",
        statusQris: 0,
        periode: 0
    })
    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [selectedGrupName, setSelectedGrupName] = useState([])

    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [selectedBrandName, setSelectedBrandName] = useState([])

    const [dataOutletInQris, setDataOutletInQris] = useState([])
    const [selectedOutletName, setSelectedOutletName] = useState([])

    const [dataIdKasirInQris, setDataIdKasirInQris] = useState([])
    const [selectedIdKasirName, setSelectedIdKasirName] = useState([])

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
        setDataOutletInQris([])
        setDataIdKasirInQris([])
        setSelectedGrupName([e])
        setSelectedBrandName([])
        setSelectedOutletName([])
        setSelectedIdKasirName([])
    }

    console.log(selectedGrupName, "selectedGrupName");
    console.log(selectedBrandName, "selectedBrandName");
    console.log(selectedOutletName, "selectedGOutletame");
    console.log(selectedIdKasirName, "selectedGIdKasirame");

    function handleChangeBrand(e) {
        getOutletInQrisTransactionHandler(e.value)
        setDataIdKasirInQris([])
        setSelectedBrandName([e])
        setSelectedOutletName([])
        setSelectedIdKasirName([])
    }

    function handleChangeOutlet(e) {
        getIdKasirInQrisTransactionHandler(e.value)
        setSelectedOutletName([e])
        setSelectedIdKasirName([])
    }

    function handleChangeIdKasir(e) {
        setSelectedIdKasirName([e])
    }

    function handleChangeTransactionReposrtQris(e) {
        setInputHandleTransactionReportQrisAdmin({
            ...inputHandleTransactionReportQrisAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionReportQris(e) {
        if (e.target.value === "7") {
            setShowDateTransactionReportQris("")
            setInputHandleTransactionReportQrisAdmin({
                ...inputHandleTransactionReportQrisAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionReportQris("none")
            setDateRangeTransactionReportQris([])
            setInputHandleTransactionReportQrisAdmin({
                ...inputHandleTransactionReportQrisAdmin,
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

    function handlePageChangeTransactionReportQris(page) {
        if (isFilterTransactionReportQris) {
            setActivePageTransactionReportQris(page)
            filterGetTransactionReportQris(inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName[0].value : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris, page, 10)
        } else {
            setActivePageTransactionReportQris(page)
            getTransactionReportQris(page, partnerId)
        }
    }

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transaction_code,
            width: "170px",
            wrap: "true"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Waktu',
            selector: row => row.trans_date,
            width: "150px"
        },
        // {
        //     name: 'Jenis Usaha',
        //     selector: row => row.business_type,
        //     width: "150px"
        // },
        {
            name: 'Nama Grup',
            selector: row => row.merchant_name,
            width: "180px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.outlet_name,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.store_name,
            width: "150px"
        },
        {
            name: 'Nama Kasir',
            selector: row => row.cashier_name,
            width: "200px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.mterminal_name,
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.MDR, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"}
                },
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86"}
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}
                },
            ]
        },
    ];

    async function userDetails() {
        try {
          const auth = "Bearer " + access_token
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
          // console.log(userDetail, 'ini user detal funct');
          if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            if (user_role === "106") {
                getBrandInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                getOutletInQrisTransactionHandler(0)
            } else if (user_role === "107") {
                getOutletInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
            } else if (user_role === "108") {
                getIdKasirInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
            }
            getTransactionReportQris(activePageTransactionReportQrisMerchant, userDetail.data.response_data.muser_partnerdtl_id)
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            if (user_role === "106") {
                getBrandInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                getOutletInQrisTransactionHandler(0)
            } else if (user_role === "107") {
                getOutletInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
            } else if (user_role === "108") {
                getIdKasirInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
            }
            getTransactionReportQris(activePageTransactionReportQrisMerchant, userDetail.data.response_data.muser_partnerdtl_id)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

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
                let newArr = []
                dataBrandQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataBrandInQris(newArr)
            } else if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token !== null) {
                setUserSession(dataBrandQris.data.response_new_token)
                let newArr = []
                dataBrandQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataBrandInQris(newArr)
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
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataOutletInQris(newArr)
            } else if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token !== null) {
                setUserSession(dataOutletQris.data.response_new_token)
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataOutletInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    console.log(dataOutletInQris, "dataOutletInQris");

    async function getIdKasirInQrisTransactionHandler(storeNou) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mstore_nou": ${storeNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataIdKasirQris = await axios.post(BaseURL + "/QRIS/MasterCashier", { data: dataParams }, { headers: headers })
            // console.log(dataIdKasirQris, 'ini user detal funct');
            if (dataIdKasirQris.status === 200 && dataIdKasirQris.data.response_code === 200 && dataIdKasirQris.data.response_new_token === null) {
                let newArr = []
                dataIdKasirQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.id
                    newArr.push(obj)
                })
                setDataIdKasirInQris(newArr)
            } else if (dataIdKasirQris.status === 200 && dataIdKasirQris.data.response_code === 200 && dataIdKasirQris.data.response_new_token !== null) {
                setUserSession(dataIdKasirQris.data.response_new_token)
                let newArr = []
                dataIdKasirQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.id
                    newArr.push(obj)
                })
                setDataIdKasirInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getTransactionReportQris(currentPage, IdNou) {
        try {
            if (user_role === "106" || user_role === "107" || user_role === "108") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"transaction_code": "", "RRN": "", "merchant_nou": ${user_role === "106" ? IdNou : 0}, "brand_nou": ${user_role === "107" ? IdNou : 0}, "outlet_nou": ${user_role === "108" ? IdNou : 0}, "mterminal_id": 0, "status": 0, "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/TransactionReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionReportQrisMerchant(getDataQrisReport.data.response_data)
                    setTotalPageTransactionReportQrisMerchant(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionReportQrisMerchant(getDataQrisReport.data.response_data.results)
                    setPendingTransactionReportQrisMerchant(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionReportQrisMerchant(getDataQrisReport.data.response_data)
                    setTotalPageTransactionReportQrisMerchant(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionReportQrisMerchant(getDataQrisReport.data.response_data.results)
                    setPendingTransactionReportQrisMerchant(false)
                }
            } else if (user_role !== "102" || user_role !== "104") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"transaction_code": "", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": 0, "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
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

            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    console.log(dateRangeTransactionReportQris, "dateRangeTransactionReportQris");
    console.log(inputHandleTransactionReportQrisAdmin.periode, "inputHandleTransactionReportQrisAdmin.periode");

    async function filterGetTransactionReportQris(idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode, page, rowPerPage) {
        try {
            if (user_role === "106" || user_role === "107" || user_role === "108") {
                setPendingTransactionReportQrisMerchant(true)
                setIsFilterTransactionReportQrisMerchant(true)
                setActivePageTransactionReportQrisMerchant(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"transaction_code": "${idTransaksi}", "RRN": "${rrn}", "merchant_nou": ${grupCode}, "brand_nou": ${brandCode}, "outlet_nou": ${outletCode}, "mterminal_id": ${idKasir}, "status": ${status}, "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/TransactionReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionReportQrisMerchant(getDataQrisReport.data.response_data)
                    setTotalPageTransactionReportQrisMerchant(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionReportQrisMerchant(getDataQrisReport.data.response_data.results)
                    setPendingTransactionReportQrisMerchant(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionReportQrisMerchant(getDataQrisReport.data.response_data)
                    setTotalPageTransactionReportQrisMerchant(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionReportQrisMerchant(getDataQrisReport.data.response_data.results)
                    setPendingTransactionReportQrisMerchant(false)
                }
            } else if (user_role !== "102" || user_role !== "104") {
                setPendingTransactionReportQris(true)
                setIsFilterTransactionReportQris(true)
                setActivePageTransactionReportQris(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"transaction_code": "${idTransaksi}", "RRN": "${rrn}", "merchant_nou": ${grupCode}, "brand_nou": ${brandCode}, "outlet_nou": ${outletCode}, "mterminal_id": ${idKasir}, "status": ${status}, "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
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
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function ExportReportTransactionReportQrisHandler(isFilter, idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode) {
        if (isFilter) {
            async function dataExportFilter(idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transaction_code": "${idTransaksi}", "RRN": "${rrn}", "merchant_nou": ${grupCode}, "brand_nou": ${brandCode}, "outlet_nou": ${outletCode}, "mterminal_id": ${idKasir}, "status": ${status}, "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/QRIS/TransactionReport", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
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
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
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
            dataExportFilter(idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode)
        } else {
            async function dataExportTransactionQris() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transaction_code": "", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": 0, "period": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportTransactionQris = await axios.post(BaseURL + "/QRIS/TransactionReport", {data: dataParams}, { headers: headers });
                    if (dataExportTransactionQris.status === 200 && dataExportTransactionQris.data.response_code === 200 && dataExportTransactionQris.data.response_new_token === null) {
                        const data = dataExportTransactionQris.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
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
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
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

    function ExportReportTransactionReportQrisMerchantHandler(isFilter, idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode) {
        if (isFilter) {
            async function dataExportFilter(idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transaction_code": "${idTransaksi}", "RRN": "${rrn}", "merchant_nou": ${grupCode}, "brand_nou": ${brandCode}, "outlet_nou": ${outletCode}, "mterminal_id": ${idKasir}, "status": ${status}, "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/QRIS/TransactionReport", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            if (user_role === "106") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else if (user_role === "107") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            }
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
                            if (user_role === "106") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else if (user_role === "107") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            }
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
            dataExportFilter(idTransaksi, rrn, grupCode, brandCode, outletCode, idKasir, status, dateId, periode)
        } else {
            async function dataExportTransactionQris() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transaction_code": "", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": 0, "period": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportTransactionQris = await axios.post(BaseURL + "/QRIS/TransactionReport", {data: dataParams}, { headers: headers });
                    if (dataExportTransactionQris.status === 200 && dataExportTransactionQris.data.response_code === 200 && dataExportTransactionQris.data.response_new_token === null) {
                        const data = dataExportTransactionQris.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            if (user_role === "106") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else if (user_role === "107") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            }
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
                            if (user_role === "106") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else if (user_role === "107") {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            } else {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "RRN": data[i].RRN, "Waktu": data[i].trans_date, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, Status: data[i].status_name })
                            }
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

    const [dataTransactionReportQrisMerchant, setDataTransactionReportQrisMerchant] = useState([])
    const [showDateTransactionReportQrisMerchant, setShowDateTransactionReportQrisMerchant] = useState("none")
    const [dateRangeTransactionReportQrisMerchant, setDateRangeTransactionReportQrisMerchant] = useState([])
    const [stateTransactionReportQrisMerchant, setStateTransactionReportQrisMerchant] = useState(null)
    const [activePageTransactionReportQrisMerchant, setActivePageTransactionReportQrisMerchant] = useState(1)
    const [pageNumberTransactionReportQrisMerchant, setPageNumberTransactionReportQrisMerchant] = useState({})
    const [totalPageTransactionReportQrisMerchant, setTotalPageTransactionReportQrisMerchant] = useState(0)
    const [pendingTransactionReportQrisMerchant, setPendingTransactionReportQrisMerchant] = useState(true)
    const [isFilterTransactionReportQrisMerchant, setIsFilterTransactionReportQrisMerchant] = useState(false)
    const [inputHandleTransactionReportQrisMerchant, setInputHandleTransactionReportQrisMerchant] = useState({
        idTransaksi: "",
        rrn: "",
        statusQris: 0,
        periode: 0
    })
    const [selectedBrandNameMerchant, setSelectedBrandNameMerchant] = useState([])
    const [selectedOutletNameMerchant, setSelectedOutletNameMerchant] = useState([])
    const [selectedIdKasirNameMerchant, setSelectedIdKasirNameMerchant] = useState([])

    function handleChangeBrandMerchant(e) {
        getOutletInQrisTransactionHandler(e.value)
        setSelectedBrandNameMerchant([e])
        setSelectedOutletNameMerchant([])
        setSelectedIdKasirNameMerchant([])
    }

    function handleChangeOutletMerchant(e) {
        getIdKasirInQrisTransactionHandler(e.value)
        setSelectedOutletNameMerchant([e])
        setSelectedIdKasirNameMerchant([])
    }

    function handleChangeIdKasirMerchant(e) {
        setSelectedIdKasirNameMerchant([e])
    }

    function handleChangeTransactionReportQrisMerchant(e) {
        setInputHandleTransactionReportQrisMerchant({
            ...inputHandleTransactionReportQrisMerchant,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionReportQrisMerchant(e) {
        if (e.target.value === "7") {
            setShowDateTransactionReportQrisMerchant("")
            setInputHandleTransactionReportQrisMerchant({
                ...inputHandleTransactionReportQrisMerchant,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionReportQris("none")
            setDateRangeTransactionReportQrisMerchant([])
            setInputHandleTransactionReportQrisMerchant({
                ...inputHandleTransactionReportQrisMerchant,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionReportQrisMerchant(item) {
        setStateTransactionReportQrisMerchant(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeTransactionReportQrisMerchant(item)
        }
    }

    function handlePageChangeTransactionReportQrisMerchant(page) {
        if (isFilterTransactionReportQrisMerchant) {
            setActivePageTransactionReportQrisMerchant(page)
            filterGetTransactionReportQris(inputHandleTransactionReportQrisMerchant.idTransaksi, inputHandleTransactionReportQrisMerchant.rrn, (user_role !== "102" || user_role !== "104") ? (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0) : user_role === "106" ? partnerId : 0, (user_role !== "102" || user_role !== "104") ? (selectedBrandNameMerchant.length !== 0 ? selectedBrandNameMerchant.map((item, idx) => item.value) : 0) : (user_role === "106" ? (selectedBrandNameMerchant.length !== 0 ? selectedBrandNameMerchant.map((item, idx) => item.value) : 0) : user_role === "107" ? partnerId : 0), (user_role !== "102" || user_role !== "104") ? (selectedOutletNameMerchant.length !== 0 ? selectedOutletNameMerchant.map((item, idx) => item.value) : 0) : (user_role === "106" || user_role === "107" ? (selectedOutletNameMerchant.length !== 0 ? selectedOutletNameMerchant.map((item, idx) => item.value) : 0) : partnerId), (selectedIdKasirNameMerchant.length !== 0 ? selectedIdKasirNameMerchant.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisMerchant.statusQris, inputHandleTransactionReportQrisMerchant.periode, dateRangeTransactionReportQrisMerchant, page, 10)
        } else {
            setActivePageTransactionReportQrisMerchant(page)
            getTransactionReportQris(page, partnerId)
        }
    }

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transaction_code,
            width: "170px", 
            wrap: "true"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Waktu',
            selector: row => row.trans_date,
            width: "150px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.outlet_name,
            omit: user_role === "106" ? false : true,
            width: "150px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.store_name,
            omit: (user_role === "106" || user_role === "107") ? false : true,
            width: "150px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.mterminal_name,
            width: "100px"
        },
        {
            name: 'Nama Kasir',
            selector: row => row.cashier_name,
            width: "150px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "170px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.MDR, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"}
                },
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86"}
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}
                },
            ]
        },
    ];

    function resetButtonQrisTransaction (param) {
        if (param === "admin") {
            getTransactionReportQris(activePageTransactionReportQris, partnerId)
            setSelectedGrupName([])
            getGrupInQrisTransactionHandler()
            setSelectedBrandName([])
            setSelectedOutletName([])
            setSelectedIdKasirName([])
            setInputHandleTransactionReportQrisAdmin({
                idTransaksi: "",
                rrn: "",
                jenisUsaha: 0,
                statusQris: 0,
                periode: 0
            })
            setDataBrandInQris([])
            setDataOutletInQris([])
            setDataIdKasirInQris([])
            setIsFilterTransactionReportQris(false)
            setShowDateTransactionReportQris("none")
            setDateRangeTransactionReportQris([])
            setStateTransactionReportQris(null)
        } else {
            getTransactionReportQris(activePageTransactionReportQris, partnerId)
            setSelectedBrandNameMerchant([])
            if (user_role === "106") {
                getBrandInQrisTransactionHandler(partnerId)
                getOutletInQrisTransactionHandler(0)
            }
            setSelectedOutletNameMerchant([])
            if (user_role === "107") {
                getOutletInQrisTransactionHandler(partnerId)
            }
            setSelectedIdKasirNameMerchant([])
            if (user_role === "108") {
                getIdKasirInQrisTransactionHandler(partnerId)
            }
            setInputHandleTransactionReportQrisMerchant({
                idTransaksi: "",
                rrn: "",
                jenisUsaha: 0,
                statusQris: 0,
                periode: 0
            })
            setDataBrandInQris([])
            setDataOutletInQris([])
            setDataIdKasirInQris([])
            setIsFilterTransactionReportQrisMerchant(false)
            setShowDateTransactionReportQrisMerchant("none")
            setDateRangeTransactionReportQrisMerchant([])
            setStateTransactionReportQrisMerchant(null)
        }
    }

    const customStylesQris = {
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
        if (user_role !== "102" || user_role !== "104") {
            getGrupInQrisTransactionHandler()
            getTransactionReportQris(activePageTransactionReportQris, partnerId)
        }
        if (user_role === "106" || user_role === "107" || user_role === "108") {
            userDetails()
        }
    }, [access_token])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                (user_role === "106" || user_role === "107" || user_role === "108") ? (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Riwayat Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" value={inputHandleTransactionReportQrisMerchant.idTransaksi} onChange={(e) => handleChangeTransactionReportQrisMerchant(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode <span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periode' value={inputHandleTransactionReportQrisMerchant.periode} onChange={(e) => handleChangePeriodeTransactionReportQrisMerchant(e)} className="input-text-riwayat ms-3">
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
                                    <input name="rrn" value={inputHandleTransactionReportQrisMerchant.rrn} onChange={(e) => handleChangeTransactionReportQrisMerchant(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                {
                                    (user_role === "106") && (
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Nama Brand</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataBrandInQris}
                                                    value={selectedBrandNameMerchant}
                                                    onChange={(selected) => handleChangeBrandMerchant(selected)}
                                                    placeholder="Pilih Brand"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                    ) 
                                }
                                {
                                    user_role === "106" && (
                                        <Col xs={4} className='text-end mt-4' style={{ display: showDateTransactionReportQrisMerchant }}>
                                            <DateRangePicker
                                                onChange={pickDateTransactionReportQrisMerchant}
                                                value={stateTransactionReportQrisMerchant}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    )
                                }
                                {
                                    (user_role === "106" || user_role === "107") && (
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Nama Outlet</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataOutletInQris}
                                                    value={selectedOutletNameMerchant}
                                                    onChange={(selected) => handleChangeOutletMerchant(selected)}
                                                    placeholder="Pilih Outlet"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                    )
                                }
                                {
                                    user_role === "107" && (
                                        <Col xs={4} className='text-end mt-4' style={{ display: showDateTransactionReportQrisMerchant }}>
                                            <DateRangePicker
                                                onChange={pickDateTransactionReportQrisMerchant}
                                                value={stateTransactionReportQrisMerchant}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    )
                                }
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataIdKasirInQris}
                                            value={selectedIdKasirNameMerchant}
                                            onChange={(selected) => handleChangeIdKasirMerchant(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                {
                                    user_role === "108" && (
                                        <Col xs={4} className='text-end mt-4' style={{ display: showDateTransactionReportQrisMerchant }}>
                                            <DateRangePicker
                                                onChange={pickDateTransactionReportQrisMerchant}
                                                value={stateTransactionReportQrisMerchant}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    )
                                }
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionReportQrisMerchant.statusQris} onChange={(e) => handleChangeTransactionReportQrisMerchant(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Status</option>
                                        <option value={3}>Dalam Proses</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                        <option value={6}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterGetTransactionReportQris(inputHandleTransactionReportQrisMerchant.idTransaksi, inputHandleTransactionReportQrisMerchant.rrn, (user_role !== "102" || user_role !== "104") ? (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0) : user_role === "106" ? partnerId : 0, (user_role !== "102" || user_role !== "104") ? (selectedBrandNameMerchant.length !== 0 ? selectedBrandNameMerchant.map((item, idx) => item.value) : 0) : (user_role === "106" ? (selectedBrandNameMerchant.length !== 0 ? selectedBrandNameMerchant.map((item, idx) => item.value) : 0) : user_role === "107" ? partnerId : 0), (user_role !== "102" || user_role !== "104") ? (selectedOutletNameMerchant.length !== 0 ? selectedOutletNameMerchant.map((item, idx) => item.value) : 0) : (user_role === "106" || user_role === "107" ? (selectedOutletNameMerchant.length !== 0 ? selectedOutletNameMerchant.map((item, idx) => item.value) : 0) : partnerId), (selectedIdKasirNameMerchant.length !== 0 ? selectedIdKasirNameMerchant.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisMerchant.statusQris, inputHandleTransactionReportQrisMerchant.periode, dateRangeTransactionReportQrisMerchant, 1, 10)}
                                                className={(inputHandleTransactionReportQrisMerchant.periode !== 0 || dateRangeTransactionReportQrisMerchant.length !== 0 || (dateRangeTransactionReportQrisMerchant.length !== 0 && inputHandleTransactionReportQrisMerchant.idTransaksi.length !== 0) || (dateRangeTransactionReportQrisMerchant.length !== 0 && inputHandleTransactionReportQrisMerchant.rrn.length !== 0) || (dateRangeTransactionReportQrisMerchant.length !== 0 && inputHandleTransactionReportQrisMerchant.statusQris !== 0) ? 'btn-ez-on' : 'btn-ez')}
                                                disabled={inputHandleTransactionReportQrisMerchant.periode === 0 || (inputHandleTransactionReportQrisMerchant.periode === 0 && inputHandleTransactionReportQrisMerchant.idTransaksi.length === 0) || (inputHandleTransactionReportQrisMerchant.periode === 0 && inputHandleTransactionReportQrisMerchant.rrn.length === 0) || (inputHandleTransactionReportQrisMerchant.periode === 0 && inputHandleTransactionReportQrisMerchant.statusQris === 0)}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonQrisTransaction("merchant")}
                                                className={(inputHandleTransactionReportQrisMerchant.periode !== 0 || dateRangeTransactionReportQrisMerchant.length !== 0 || inputHandleTransactionReportQrisMerchant.idTransaksi.length !== 0 || inputHandleTransactionReportQrisMerchant.rrn.length !== 0 || inputHandleTransactionReportQrisMerchant.statusQris !== 0 || selectedBrandNameMerchant.length !== 0 || selectedOutletNameMerchant.length !== 0 || selectedIdKasirNameMerchant.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputHandleTransactionReportQrisMerchant.periode === 0 && dateRangeTransactionReportQrisMerchant.length === 0 && inputHandleTransactionReportQrisMerchant.idTransaksi.length === 0 && inputHandleTransactionReportQrisMerchant.rrn.length === 0 && inputHandleTransactionReportQrisMerchant.statusQris === 0 && selectedBrandNameMerchant.length === 0 && selectedOutletNameMerchant.length === 0 && selectedIdKasirNameMerchant.length === 0}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataTransactionReportQrisMerchant.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisMerchantHandler(isFilterTransactionReportQrisMerchant, inputHandleTransactionReportQrisMerchant.idTransaksi, inputHandleTransactionReportQrisMerchant.rrn, (user_role !== "102" || user_role !== "104") ? (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0) : user_role === "106" ? partnerId : 0, (user_role !== "102" || user_role !== "104") ? (selectedBrandNameMerchant.length !== 0 ? selectedBrandNameMerchant.map((item, idx) => item.value) : 0) : (user_role === "106" ? (selectedBrandNameMerchant.length !== 0 ? selectedBrandNameMerchant.map((item, idx) => item.value) : 0) : user_role === "107" ? partnerId : 0), (user_role !== "102" || user_role !== "104") ? (selectedOutletNameMerchant.length !== 0 ? selectedOutletNameMerchant.map((item, idx) => item.value) : 0) : (user_role === "106" || user_role === "107" ? (selectedOutletNameMerchant.length !== 0 ? selectedOutletNameMerchant.map((item, idx) => item.value) : 0) : partnerId), (selectedIdKasirNameMerchant.length !== 0 ? selectedIdKasirNameMerchant.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisMerchant.statusQris, inputHandleTransactionReportQrisMerchant.periode, dateRangeTransactionReportQrisMerchant)}>Export</Link>
                                    </div>
                                )
                            }
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsPartner}
                                    data={dataTransactionReportQrisMerchant}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    progressPending={pendingTransactionReportQrisMerchant}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionReportQrisMerchant}</div>
                                <Pagination
                                    activePage={activePageTransactionReportQrisMerchant}
                                    itemsCountPerPage={pageNumberTransactionReportQrisMerchant.row_per_page}
                                    totalItemsCount={(pageNumberTransactionReportQrisMerchant.row_per_page*pageNumberTransactionReportQrisMerchant.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeTransactionReportQrisMerchant}
                                />
                            </div>
                        </div>
                    </>
                ) : (user_role !== "102" || user_role !== "104") ? (
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
                                    <input name="idTransaksi" value={inputHandleTransactionReportQrisAdmin.idTransaksi} onChange={(e) => handleChangeTransactionReposrtQris(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode <span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periode' value={inputHandleTransactionReportQrisAdmin.periode} onChange={(e) => handleChangePeriodeTransactionReportQris(e)} className="input-text-riwayat ms-3">
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
                                    <input name="rrn" value={inputHandleTransactionReportQrisAdmin.rrn} onChange={(e) => handleChangeTransactionReposrtQris(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                {/* <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Jenis Usaha</span>
                                    <Form.Select name='jenisUsaha' value={inputHandleTransactionReportQrisAdmin.jenisUsaha} onChange={(e) => handleChangeTransactionReposrtQris(e)} className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                        <option defaultValue disabled value={0}>Pilih Jenis Usaha</option>
                                        <option value={1}>Badan Usaha</option>
                                        <option value={2}>Perseorangan</option>
                                    </Form.Select>
                                </Col> */}
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
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataBrandInQris}
                                            value={selectedBrandName}
                                            onChange={(selected) => handleChangeBrand(selected)}
                                            placeholder="Pilih Brand"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataOutletInQris}
                                            value={selectedOutletName}
                                            onChange={(selected) => handleChangeOutlet(selected)}
                                            placeholder="Pilih Outlet"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataIdKasirInQris}
                                            value={selectedIdKasirName}
                                            onChange={(selected) => handleChangeIdKasir(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionReportQrisAdmin.statusQris} onChange={(e) => handleChangeTransactionReposrtQris(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Status</option>
                                        <option value={3}>Dalam Proses</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                        <option value={6}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterGetTransactionReportQris(inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris, 1, 10)}
                                                className={(inputHandleTransactionReportQrisAdmin.periode !== 0 || dateRangeTransactionReportQris.length !== 0 || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReportQrisAdmin.idTransaksi.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReportQrisAdmin.rrn.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReportQrisAdmin.statusQris !== 0) ? 'btn-ez-on' : 'btn-ez')}
                                                disabled={inputHandleTransactionReportQrisAdmin.periode === 0 || (inputHandleTransactionReportQrisAdmin.periode === 0 && inputHandleTransactionReportQrisAdmin.idTransaksi.length === 0) || (inputHandleTransactionReportQrisAdmin.periode === 0 && inputHandleTransactionReportQrisAdmin.rrn.length === 0) || (inputHandleTransactionReportQrisAdmin.periode === 0 && inputHandleTransactionReportQrisAdmin.statusQris === 0)}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonQrisTransaction("admin")}
                                                className={(inputHandleTransactionReportQrisAdmin.periode !== 0 || dateRangeTransactionReportQris.length !== 0 || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReportQrisAdmin.idTransaksi.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReportQrisAdmin.rrn.length !== 0) || (dateRangeTransactionReportQris.length !== 0 && inputHandleTransactionReportQrisAdmin.statusQris !== 0) ? 'btn-reset' : 'btn-ez-reset')}
                                                disabled={inputHandleTransactionReportQrisAdmin.periode === 0 || (inputHandleTransactionReportQrisAdmin.periode === 0 && inputHandleTransactionReportQrisAdmin.idTransaksi.length === 0) || (inputHandleTransactionReportQrisAdmin.periode === 0 && inputHandleTransactionReportQrisAdmin.rrn.length === 0) || (inputHandleTransactionReportQrisAdmin.periode === 0 && inputHandleTransactionReportQrisAdmin.statusQris === 0)}
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
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQris, inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris)}>Export</Link>
                                    </div>
                                )
                            }
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsAdmin}
                                    data={dataTransactionReportQris}
                                    customStyles={customStylesQris}
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
                                    onChange={handlePageChangeTransactionReportQris}
                                />
                            </div>
                        </div>
                    </>
                ) : ""
            }
        </div>
    )
}

export default QrisTransaksi