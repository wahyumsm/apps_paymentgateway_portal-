import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { BaseURL, convertToRupiah, customFilter, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect from 'react-select'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import Pagination from 'react-js-pagination'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { eng } from '../../components/Language';

const TransaksiQrisApi = () => {
    const user_role = getRole()
    const access_token = getToken();
    const history = useHistory()
    const [partnerId, setPartnerId] = useState("")
    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [dataOutletInQris, setDataOutletInQris] = useState([])
    const [dataIdKasirInQris, setDataIdKasirInQris] = useState([])

    async function userDetails() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
          // console.log(userDetail, 'ini user detal funct');
          if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getGrupInQrisTransactionHandler()
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getGrupInQrisTransactionHandler()
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

    async function getTransactionQrisApiReport(currentPage, lang, partnerId) {
        try {
            if (user_role === "102") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"trans_id": "", "partner_trans_id": "", "sub_partner_id": "${partnerId}", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": "", "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth,
                    'Accept-Language' : lang
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionQrisApiPartner(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiPartner(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiPartner(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiPartner(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionQrisApiPartner(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiPartner(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiPartner(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiPartner(false)
                }
            } else if (user_role === "100") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"trans_id": "", "partner_trans_id": "", "sub_partner_id": "", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": "", "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth,
                    'Accept-Language' : lang
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionQrisApiAdmin(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiAdmin(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiAdmin(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiAdmin(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1})) 
                    setPageNumberTransactionQrisApiAdmin(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiAdmin(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiAdmin(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiAdmin(false)
                }

            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const [dataTransactionQrisApiAdmin, setDataTransactionQrisApiAdmin] = useState([])
    const [showDateTransactionQrisApiAdmin, setShowDateTransactionQrisApiAdmin] = useState("none")
    const [dateRangeTransactionQrisApiAdmin, setDateRangeTransactionQrisApiAdmin] = useState([])
    const [stateTransactionQrisApiAdmin, setStateTransactionQrisApiAdmin] = useState(null)
    const [activePageTransactionQrisApiAdmin, setActivePageTransactionQrisApiAdmin] = useState(1)
    const [pageNumberTransactionQrisApiAdmin, setPageNumberTransactionQrisApiAdmin] = useState({})
    const [totalPageTransactionQrisApiAdmin, setTotalPageTransactionQrisApiAdmin] = useState(0)
    const [pendingTransactionQrisApiAdmin, setPendingTransactionQrisApiAdmin] = useState(true)
    const [isFilterTransactionQrisApiAdmin, setIsFilterTransactionQrisApiAdmin] = useState(false)
    const [inputHandleTransactionApiAdmin, setInputHandleTransactionApiAdmin] = useState({
        idTransaksi: "",
        periode: 0,
        rrn: "",
        parterTransId: "",
        namaBrand: 0,
        namaOutlet: 0,
        idKasir: 0,
        statusQris: ""
    })
    const [selectedPartnerName, setSelectedPartnerName] = useState([])
    const [selectedBrandNameAdmin, setSelectedBrandNameAdmin] = useState([])
    const [selectedOutletNameAdmin, setSelectedOutletNameAdmin] = useState([])
    const [selectedIdKasirAdmin, setSelectedIdKasirAdmin] = useState([])

    function handleChangeTransactionQrisApiAdmin(e) {
        setInputHandleTransactionApiAdmin({
            ...inputHandleTransactionApiAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionQrisApiAdmin(e) {
        if (e.target.value === "7") {
            setShowDateTransactionQrisApiAdmin("")
            setInputHandleTransactionApiAdmin({
                ...inputHandleTransactionApiAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionQrisApiAdmin("none")
            setDateRangeTransactionQrisApiAdmin([])
            setInputHandleTransactionApiAdmin({
                ...inputHandleTransactionApiAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionQrisApiAdmin(item) {
        setStateTransactionQrisApiAdmin(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeTransactionQrisApiAdmin(item)
        }
    }

    function handlePageChangeTransactionQrisApiAdmin(page) {
        if (isFilterTransactionQrisApiAdmin) {
            setActivePageTransactionQrisApiAdmin(page)
            // filterGetTransactionReportQris(inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName[0].value : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris, page, 10)
        } else {
            setActivePageTransactionQrisApiAdmin(page)
            // getTransactionReportQris(page, partnerId)
        }
    }

    function handleChangeBrandAdmin(e) {
        getOutletInQrisTransactionHandler(e.value)
        setDataIdKasirInQris([])
        setSelectedBrandNameAdmin([e])
        setSelectedOutletNameAdmin([])
        setSelectedIdKasirAdmin([])
    }

    function handleChangeOutletAdmin(e) {
        getIdKasirInQrisTransactionHandler(e.value)
        setSelectedOutletNameAdmin([e])
        setSelectedIdKasirAdmin([])
    }

    function handleChangeIdKasirAdmin(e) {
        setSelectedIdKasirAdmin([e])
    }

    const [dataTransactionQrisApiPartner, setDataTransactionQrisApiPartner] = useState([])
    const [showDateTransactionQrisApiPartner, setShowDateTransactionQrisApiPartner] = useState("none")
    const [dateRangeTransactionQrisApiPartner, setDateRangeTransactionQrisApiPartner] = useState([])
    const [stateTransactionQrisApiPartner, setStateTransactionQrisApiPartner] = useState(null)
    const [activePageTransactionQrisApiPartner, setActivePageTransactionQrisApiPartner] = useState(1)
    const [pageNumberTransactionQrisApiPartner, setPageNumberTransactionQrisApiPartner] = useState({})
    const [totalPageTransactionQrisApiPartner, setTotalPageTransactionQrisApiPartner] = useState(0)
    const [pendingTransactionQrisApiPartner, setPendingTransactionQrisApiPartner] = useState(true)
    const [isFilterTransactionQrisApiPartner, setIsFilterTransactionQrisApiPartner] = useState(false)
    const [inputHandleTransactionApiPartner, setInputHandleTransactionApiPartner] = useState({
        idTransaksi: "",
        periode: 0,
        rrn: "",
        parterTransId: "",
        namaGrup: "",
        namaBrand: 0,
        namaOutlet: 0,
        idKasir: 0,
        statusQris: ""
    })
    const [selectedGrupName, setSelectedGrupName] = useState([])
    const [selectedBrandNamePartner, setSelectedBrandNamePartner] = useState([])
    const [selectedOutletNamePartner, setSelectedOutletNamePartner] = useState([])
    const [selectedIdKasirPartner, setSelectedIdKasirPartner] = useState([])

    function handleChangeTransactionQrisApiPartner(e) {
        setInputHandleTransactionApiPartner({
            ...inputHandleTransactionApiPartner,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionQrisApiPartner(e) {
        if (e.target.value === "7") {
            setShowDateTransactionQrisApiPartner("")
            setInputHandleTransactionApiPartner({
                ...inputHandleTransactionApiPartner,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionQrisApiPartner("none")
            setDateRangeTransactionQrisApiPartner([])
            setInputHandleTransactionApiPartner({
                ...inputHandleTransactionApiPartner,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionQrisApiPartner(item) {
        setStateTransactionQrisApiPartner(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeTransactionQrisApiPartner(item)
        }
    }

    function handlePageChangeTransactionQrisApiPartner(page) {
        if (isFilterTransactionQrisApiPartner) {
            setActivePageTransactionQrisApiPartner(page)
            // filterGetTransactionReportQris(inputHandleTransactionReportQrisPartner.idTransaksi, inputHandleTransactionReportQrisPartner.rrn, selectedGrupName.length !== 0 ? selectedGrupName[0].value : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisPartner.statusQris, inputHandleTransactionReportQrisPartner.periode, dateRangeTransactionReportQris, page, 10)
        } else {
            setActivePageTransactionQrisApiPartner(page)
            // getTransactionReportQris(page, partnerId)
        }
    }

    function handleChange(e) {
        getBrandInQrisTransactionHandler(e.value)
        setDataOutletInQris([])
        setDataIdKasirInQris([])
        setSelectedGrupName([e])
        setSelectedBrandNamePartner([])
        setSelectedOutletNamePartner([])
        setSelectedIdKasirPartner([])
    }

    function handleChangeBrandPartner(e) {
        getOutletInQrisTransactionHandler(e.value)
        setDataIdKasirInQris([])
        setSelectedBrandNamePartner([e])
        setSelectedOutletNamePartner([])
        setSelectedIdKasirPartner([])
    }

    function handleChangeOutletPartner(e) {
        getIdKasirInQrisTransactionHandler(e.value)
        setSelectedOutletNamePartner([e])
        setSelectedIdKasirPartner([])
    }

    function handleChangeIdKasirPartner(e) {
        setSelectedIdKasirPartner([e])
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
            name: 'Waktu Request',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Waktu Bayar',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Tipe QR',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.RRN,
            width: "150px"
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
            name: 'Pendapatan Ezee',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan Partner',
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

    const columnsPartner = [
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
            name: 'Waktu Request',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Waktu Bayar',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Tipe QR',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.RRN,
            width: "150px"
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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        userDetails()
        getTransactionQrisApiReport(user_role === "102" ? activePageTransactionQrisApiPartner : activePageTransactionQrisApiAdmin, language === null ? 'EN' : language.flagName, partnerId)
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                user_role === "102" ? (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS API</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS API</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" value={inputHandleTransactionApiPartner.idTransaksi} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode'  value={inputHandleTransactionApiPartner.periode} onChange={(e) => handleChangePeriodeTransactionQrisApiPartner(e)} className="input-text-riwayat ms-3">
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col 
                                    xs={4} 
                                    className='text-end mt-4' 
                                    style={{ display: showDateTransactionQrisApiPartner }}
                                >
                                    <DateRangePicker
                                        onChange={pickDateTransactionQrisApiPartner}
                                        value={stateTransactionQrisApiPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="me-4">RRN</span>
                                    <input name="rrn" value={inputHandleTransactionApiPartner.rrn} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Partner Trans ID</span>
                                    <input name="partnerTransId" value={inputHandleTransactionApiPartner.parterTransId} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
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
                                            value={selectedBrandNamePartner}
                                            onChange={(selected) => handleChangeBrandPartner(selected)}
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
                                            value={selectedOutletNamePartner}
                                            onChange={(selected) => handleChangeOutletPartner(selected)}
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
                                            value={selectedIdKasirPartner}
                                            onChange={(selected) => handleChangeIdKasirPartner(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionApiPartner.statusQris} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={""}>Pilih Status</option>
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
                            {/* {
                                dataTransactionReportQris.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQris, inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris)}>Export</Link>
                                    </div>
                                )
                            } */}
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsPartner}
                                    data={agenLists}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    // progressPending={pendingTransactionQrisApiPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionQrisApiPartner}</div>
                                <Pagination
                                    activePage={activePageTransactionQrisApiPartner}
                                    itemsCountPerPage={pageNumberTransactionQrisApiPartner.row_per_page}
                                    totalItemsCount={(pageNumberTransactionQrisApiPartner.row_per_page*pageNumberTransactionQrisApiPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeTransactionQrisApiPartner}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS API</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS API</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" value={inputHandleTransactionApiAdmin.idTransaksi} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode' value={inputHandleTransactionApiAdmin.periode} onChange={(e) => handleChangePeriodeTransactionQrisApiAdmin(e)} className="input-text-riwayat ms-3">
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
                                    <input name="rrn" value={inputHandleTransactionApiAdmin.rrn} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Partner Trans ID</span>
                                    <input name="partnerTransId" value={inputHandleTransactionApiAdmin.parterTransId} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col 
                                    xs={4} 
                                    className='text-end mt-4' 
                                    style={{ display: showDateTransactionQrisApiAdmin }}
                                >
                                    <DateRangePicker
                                        onChange={pickDateTransactionQrisApiAdmin}
                                        value={stateTransactionQrisApiAdmin}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span >Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataGrupInQris}
                                            value={selectedPartnerName}
                                            // onChange={(selected) => handleChange(selected)}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
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
                                            value={selectedBrandNameAdmin}
                                            onChange={(selected) => handleChangeBrandAdmin(selected)}
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
                                            value={selectedOutletNameAdmin}
                                            onChange={(selected) => handleChangeOutletAdmin(selected)}
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
                                            value={selectedIdKasirAdmin}
                                            onChange={(selected) => handleChangeIdKasirAdmin(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionApiAdmin.statusQris} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={""}>Pilih Status</option>
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
                            {/* {
                                dataTransactionReportQris.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQris, inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris)}>Export</Link>
                                    </div>
                                )
                            } */}
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsAdmin}
                                    data={agenLists}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    // progressPending={pendingTransactionQrisApiAdmin}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionQrisApiAdmin}</div>
                                <Pagination
                                    activePage={activePageTransactionQrisApiAdmin}
                                    itemsCountPerPage={pageNumberTransactionQrisApiAdmin.row_per_page}
                                    totalItemsCount={(pageNumberTransactionQrisApiAdmin.row_per_page*pageNumberTransactionQrisApiAdmin.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeTransactionQrisApiAdmin}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default TransaksiQrisApi