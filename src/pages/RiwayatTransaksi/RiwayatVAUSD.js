import React, { useEffect, useState } from 'react'
import { BaseURL, CustomLoader, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers'
import { eng } from '../../components/Language'
import ReactSelect from 'react-select'
import { Col, Form, FormControl, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Link, useHistory } from 'react-router-dom'
import DataTable, { defaultThemes } from 'react-data-table-component';
import Pagination from 'react-js-pagination'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData'
import axios from 'axios'

function RiwayatVAUSD() {

    const user_role = getRole()
    const history = useHistory()

    // ADMIN STATE MANAGEMENT SECTION

    const [inputHandleVAUSDAdmin, setInputHandleVAUSDAdmin] = useState({
        idTransaksiVAUSDAdmin: "",
        partnerTransIdVAUSDAdmin: "",
        noVAVAUSDAdmin: "",
        periodeVAUSDAdmin: 0,
        namaMerchantVAUSDAdmin: "",
        namaPayerVAUSDAdmin: "",
    })
    const [showDateVAUSDAdmin, setShowDateVAUSDAdmin] = useState("none")
    const [stateVAUSDAdmin, setStateVAUSDAdmin] = useState(null)
    const [dateRangeVAUSDAdmin, setDateRangeVAUSDAdmin] = useState([])
    const [activePageVAUSDAdmin, setActivePageVAUSDAdmin] = useState(1)
    const [listTransaksiVAUSDAdmin, setListTransaksiVAUSDAdmin] = useState([])
    const [pageNumberVAUSDAdmin, setPageNumberVAUSDAdmin] = useState({})
    const [totalPageVAUSDAdmin, setTotalPageVAUSDAdmin] = useState(0)
    const [pendingTransaksiVAUSDAdmin, setPendingTransaksiVAUSDAdmin] = useState(false)

    // ADMIN STATE MANAGEMENT SECTION END

    // PARTNER STATE MANAGEMENT SECTION

    const [inputHandleVAUSDPartner, setInputHandleVAUSDPartner] = useState({
        idTransaksiVAUSDPartner: "",
        partnerTransIdVAUSDPartner: "",
        noVAVAUSDPartner: "",
        namaPayer: "",
        periodeVAUSDPartner: 0,
    })
    const [showDateVAUSDPartner, setShowDateVAUSDPartner] = useState("none")
    const [stateVAUSDPartner, setStateVAUSDPartner] = useState(null)
    const [dateRangeVAUSDPartner, setDateRangeVAUSDPartner] = useState([])
    const [activePageVAUSDPartner, setActivePageVAUSDPartner] = useState(1)
    const [listTransaksiVAUSDPartner, setListTransaksiVAUSDPartner] = useState([])
    const [pageNumberVAUSDPartner, setPageNumberVAUSDPartner] = useState({})
    const [totalPageVAUSDPartner, setTotalPageVAUSDPartner] = useState(0)
    const [pendingTransaksiVAUSDPartner, setPendingTransaksiVAUSDPartner] = useState(false)

    // PARTNER STATE MANAGEMENT SECTION END

    // ADMIN FUNCTION SECTION

    function handleChangeAdmin(e) {
        setInputHandleVAUSDAdmin({
            ...inputHandleVAUSDAdmin,
            [ e.target.name ]: e.target.value
        })
    }

    function handleChangePeriodeVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDateVAUSDAdmin("")
            setInputHandleVAUSDAdmin({
                ...inputHandleVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateVAUSDAdmin("none")
            setDateRangeVAUSDAdmin([])
            setInputHandleVAUSDAdmin({
                ...inputHandleVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateVAUSDAdmin(item) {
        setStateVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeVAUSDAdmin(item)
        }
    }

    function handlePageChangeVAUSDAdmin(page) {
        setActivePageVAUSDAdmin(page)
        getListTransaksiVAUSDAdmin(page, inputHandleVAUSDAdmin.idTransaksiVAUSDAdmin, inputHandleVAUSDAdmin.partnerTransIdVAUSDAdmin, inputHandleVAUSDAdmin.noVAVAUSDAdmin, inputHandleVAUSDAdmin.periodeVAUSDAdmin, dateRangeVAUSDAdmin, inputHandleVAUSDAdmin.namaMerchantVAUSDAdmin, inputHandleVAUSDAdmin.namaPayerVAUSDAdmin)
    }

    function resetButtonVAUSDAdminHandle() {
        setInputHandleVAUSDAdmin({
            idTransaksiVAUSDAdmin: "",
            partnerTransIdVAUSDAdmin: "",
            noVAVAUSDAdmin: "",
            periodeVAUSDAdmin: 0,
            namaMerchantVAUSDAdmin: "",
            namaPayerVAUSDAdmin: "",
        })
        setShowDateVAUSDAdmin("none")
        setStateVAUSDAdmin(null)
        setDateRangeVAUSDAdmin([])
    }

    async function getListTransaksiVAUSDAdmin(page, idTransaksi, partnerTransId, noVa, dateId, dateRange, merchantName, payerName) {
        try {
            console.log(page, 'page');
            console.log(idTransaksi, 'idTransaksi');
            console.log(partnerTransId, 'partnerTransId');
            console.log(noVa, 'noVa');
            console.log(dateId, 'dateId');
            console.log(dateRange, 'dateRange');
            console.log(merchantName, 'merchantName');
            console.log(payerName, 'payerName');
            setPendingTransaksiVAUSDAdmin(true)
            setActivePageVAUSDAdmin(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "transaction_id": "${idTransaksi}", "partner_trans_id": "${partnerTransId}", "va_number": "${noVa}", "merchant_name": "${merchantName}", "payer_name": "${payerName}", "page" : ${page}, "row_per_page": 10, "date_from": "${Number(dateId) === 7 ? dateRange[0] : ""}", "date_to": "${Number(dateId) === 7 ? dateRange[1] : ""}", "period": ${Number(dateId) !== 0 ? Number(dateId) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : "ID"
            }
            console.log(dataParams, 'dataParams');
            const dataListTransaksiVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/GetTransactionHistoryVAUSD", {data: dataParams}, {headers: headers})
            console.log(dataListTransaksiVAUSD, 'dataListTransaksiVAUSD');
            if (dataListTransaksiVAUSD.status === 200 && dataListTransaksiVAUSD.data.response_code === 200 && dataListTransaksiVAUSD.data.response_new_token === null) {
                dataListTransaksiVAUSD.data.response_data.results = dataListTransaksiVAUSD.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberVAUSDAdmin(dataListTransaksiVAUSD.data.response_data)
                setTotalPageVAUSDAdmin(dataListTransaksiVAUSD.data.response_data.max_page)
                setListTransaksiVAUSDAdmin(dataListTransaksiVAUSD.data.response_data.results)
                setPendingTransaksiVAUSDAdmin(false)
            } else if (dataListTransaksiVAUSD.status === 200 && dataListTransaksiVAUSD.data.response_code === 200 && dataListTransaksiVAUSD.data.response_new_token !== null) {
                setUserSession(dataListTransaksiVAUSD.data.response_new_token)
                dataListTransaksiVAUSD.data.response_data.results = dataListTransaksiVAUSD.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberVAUSDAdmin(dataListTransaksiVAUSD.data.response_data)
                setTotalPageVAUSDAdmin(dataListTransaksiVAUSD.data.response_data.max_page)
                setListTransaksiVAUSDAdmin(dataListTransaksiVAUSD.data.response_data.results)
                setPendingTransaksiVAUSDAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // ADMIN FUNCTION SECTION END

    // PARTNER FUNCTION SECTION

    function handleChangePartner(e) {
        setInputHandleVAUSDPartner({
            ...inputHandleVAUSDPartner,
            [ e.target.name ]: e.target.value
        })
    }

    function handleChangePeriodeVAUSDPartner(e) {
        if (e.target.value === "7") {
            setShowDateVAUSDPartner("")
            setInputHandleVAUSDPartner({
                ...inputHandleVAUSDPartner,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateVAUSDPartner("none")
            setDateRangeVAUSDPartner([])
            setInputHandleVAUSDPartner({
                ...inputHandleVAUSDPartner,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateVAUSDPartner(item) {
        setStateVAUSDPartner(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeVAUSDPartner(item)
        }
    }

    function handlePageChangeVAUSDPartner(page) {
        setActivePageVAUSDPartner(page)
        getListTransaksiVAUSDPartner(page, inputHandleVAUSDPartner.idTransaksiVAUSDPartner, inputHandleVAUSDPartner.partnerTransIdVAUSDPartner, inputHandleVAUSDPartner.noVAVAUSDPartner, inputHandleVAUSDPartner.namaPayer, inputHandleVAUSDPartner.periodeVAUSDPartner, dateRangeVAUSDPartner, language === null ? 'EN' : language.flagName)
    }

    function resetButtonVAUSDPartnerHandle() {
        setInputHandleVAUSDPartner({
            idTransaksiVAUSDPartner: "",
            partnerTransIdVAUSDPartner: "",
            noVAVAUSDPartner: "",
            namaPayer: "",
            periodeVAUSDPartner: 0,
        })
        setShowDateVAUSDPartner("none")
        setStateVAUSDPartner(null)
        setDateRangeVAUSDPartner([])
    }

    async function getListTransaksiVAUSDPartner(page, idTransaksi, partnerTransId, noVa, payerName, dateId, dateRange, lang) {
        try {
            setPendingTransaksiVAUSDPartner(true)
            setActivePageVAUSDPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "transaction_id": "${idTransaksi}", "partner_trans_id": "${partnerTransId}", "va_number": "${noVa}", "payer_name" : "${payerName}", "partner_id": "", "page" : ${page}, "row_per_page": 10, "date_from": "${Number(dateId) === 7 ? dateRange[0] : ""}", "date_to": "${Number(dateId) === 7 ? dateRange[1] : ""}", "period": ${Number(dateId) !== 0 ? Number(dateId) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            console.log(dataParams, 'dataParams');
            const dataListTransaksiVAUSDPartner = await axios.post(BaseURL + "/VirtualAccountUSD/GetTransactionHistoryVaUSDPartner", {data: dataParams}, {headers: headers})
            console.log(dataListTransaksiVAUSDPartner, 'dataListTransaksiVAUSDPartner');
            if (dataListTransaksiVAUSDPartner.status === 200 && dataListTransaksiVAUSDPartner.data.response_code === 200 && dataListTransaksiVAUSDPartner.data.response_new_token === null) {
                dataListTransaksiVAUSDPartner.data.response_data.results = dataListTransaksiVAUSDPartner.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberVAUSDPartner(dataListTransaksiVAUSDPartner.data.response_data)
                setTotalPageVAUSDPartner(dataListTransaksiVAUSDPartner.data.response_data.max_page)
                setListTransaksiVAUSDPartner(dataListTransaksiVAUSDPartner.data.response_data.results)
                setPendingTransaksiVAUSDPartner(false)
            } else if (dataListTransaksiVAUSDPartner.status === 200 && dataListTransaksiVAUSDPartner.data.response_code === 200 && dataListTransaksiVAUSDPartner.data.response_new_token !== null) {
                setUserSession(dataListTransaksiVAUSDPartner.data.response_new_token)
                dataListTransaksiVAUSDPartner.data.response_data.results = dataListTransaksiVAUSDPartner.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberVAUSDPartner(dataListTransaksiVAUSDPartner.data.response_data)
                setTotalPageVAUSDPartner(dataListTransaksiVAUSDPartner.data.response_data.max_page)
                setListTransaksiVAUSDPartner(dataListTransaksiVAUSDPartner.data.response_data.results)
                setPendingTransaksiVAUSDPartner(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // PARTNER FUNCTION SECTION END

    useEffect(() => {
        if (user_role !== "102") {
            getListTransaksiVAUSDAdmin(activePageVAUSDAdmin, inputHandleVAUSDAdmin.idTransaksiVAUSDAdmin, inputHandleVAUSDAdmin.partnerTransIdVAUSDAdmin, inputHandleVAUSDAdmin.noVAVAUSDAdmin, inputHandleVAUSDAdmin.periodeVAUSDAdmin, dateRangeVAUSDAdmin, inputHandleVAUSDAdmin.namaMerchantVAUSDAdmin, inputHandleVAUSDAdmin.namaPayerVAUSDAdmin)
        } else {
            getListTransaksiVAUSDPartner(activePageVAUSDPartner, inputHandleVAUSDPartner.idTransaksiVAUSDPartner, inputHandleVAUSDPartner.partnerTransIdVAUSDPartner, inputHandleVAUSDPartner.noVAVAUSDPartner, inputHandleVAUSDPartner.namaPayer, inputHandleVAUSDPartner.periodeVAUSDPartner, dateRangeVAUSDPartner, language === null ? 'EN' : language.flagName)
        }
    }, [])

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Transaksi',
            selector: row => row.trans_id,
            wrap: true,
            width: "150px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            // sortable: true,
            width: "180px",
            wrap: true,
        },
        {
            name: 'Tanggal Request',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal Bayar',
            selector: row => row.process_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'No. VA',
            selector: row => row.va_number,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nama Merchant',
            selector: row => row.partner_name,
            // sortable: true
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nama Payer',
            selector: row => row.member_name,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nominal Diminta',
            selector: row => row.request_amount,
            // sortable: true,
            wrap: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "200px",
        },
        {
            name: 'Harus Dibayar',
            selector: row => row.pay_amount,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.pay_amount, false, 2)}` }</div>,
            width: "175px"
        },
        {
            name: 'Ditransfer Oleh Payer',
            selector: row => row.transferred_amount,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.transferred_amount, false, 2)}` }</div>,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Biaya Bank',
            selector: row => row.bank_fee,
            width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.bank_fee, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Biaya Admin',
            selector: row => row.admin_fee,
            width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.admin_fee, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'PPN atas Biaya Admin',
            selector: row => row.tax_fee,
            width: "210px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.tax_fee, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Settle ke Merchant',
            selector: row => row.settled_amount,
            width: "190px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.settled_amount, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_id !== 13 ? row.status_name : "Ditutup",
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9 || row.status_id === 13,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Transaksi',
            selector: row => row.trans_id,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            // sortable: true,
            width: "180px",
            wrap: true,
        },
        {
            name: 'Tanggal Request',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal Bayar',
            selector: row => row.process_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'No. VA',
            selector: row => row.va_number,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nama Payer',
            selector: row => row.member_name,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nominal Diminta',
            selector: row => row.request_amount,
            // sortable: true,
            wrap: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "200px",
        },
        {
            name: 'Harus Dibayar',
            selector: row => row.pay_amount,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.pay_amount, false, 2)}` }</div>,
            width: "175px"
        },
        {
            name: 'Ditransfer Oleh Payer',
            selector: row => row.transferred_amount,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.transferred_amount, false, 2)}` }</div>,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Biaya Admin',
            selector: row => row.admin_fee,
            width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.admin_fee, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'PPN atas Biaya Admin',
            selector: row => row.tax_fee,
            width: "210px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.tax_fee, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Nominal Disettle',
            selector: row => row.settled_amount,
            width: "190px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.settled_amount, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9 || row.status_id === 13,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const customStylesTransaksiVAUSD = {
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

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                user_role === "102" ? (
                    <>
                        <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>{"Riwayat Transaksi"}</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; VA USD</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{"Transaksi VA USD"}</h2>
                            {/* <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{language === null ? eng.laporan : language.laporan}</h2> */}
                        </div>
                        <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>{"Tabel Riwayat Transaksi VA USD"}</h2>
                        {/* <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>{language === null ? eng.danaMasuk : language.danaMasuk}</h2> */}
                        <div className='base-content'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>{language === null ? eng.filter : language.filter}</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 64 }}>ID Transaksi</span>
                                    <input onChange={(e) => handleChangePartner(e)} value={inputHandleVAUSDPartner.idTransaksiVAUSDPartner} name="idTransaksiVAUSDPartner" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Partner Trans ID</span>
                                    <input onChange={(e) => handleChangePartner(e)} value={inputHandleVAUSDPartner.partnerTransIdVAUSDPartner} name="partnerTransIdVAUSDPartner" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 32 }}>No. VA</span>
                                    <input onChange={(e) => handleChangePartner(e)} value={inputHandleVAUSDPartner.noVAVAUSDPartner} name="noVAVAUSDPartner" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan No. VA'/>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <span>Nama Payer</span>
                                    <input onChange={(e) => handleChangePartner(e)} value={inputHandleVAUSDPartner.namaPayer} name="namaPayer" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Nama Payer'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateVAUSDPartner === "none") ? "33%" : "33%" }}>
                                    <span className="me-3">{language === null ? eng.periode : language.periode}<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeVAUSDPartner' className="input-text-riwayat ms-5" value={inputHandleVAUSDPartner.periodeVAUSDPartner} onChange={(e) => handleChangePeriodeVAUSDPartner(e)}>
                                        <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                        <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} style={{ display: showDateVAUSDPartner }} className='text-start ps-5'>
                                    <DateRangePicker
                                        onChange={pickDateVAUSDPartner}
                                        value={stateVAUSDPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => getListTransaksiVAUSDPartner(1, inputHandleVAUSDPartner.idTransaksiVAUSDPartner, inputHandleVAUSDPartner.partnerTransIdVAUSDPartner, inputHandleVAUSDPartner.noVAVAUSDPartner, inputHandleVAUSDPartner.namaPayer, inputHandleVAUSDPartner.periodeVAUSDPartner, dateRangeVAUSDPartner, language === null ? 'EN' : language.flagName)}
                                                className={(inputHandleVAUSDPartner.periodeVAUSDPartner === 0 || (inputHandleVAUSDPartner.periodeVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                                disabled={(inputHandleVAUSDPartner.periodeVAUSDPartner === 0 || (inputHandleVAUSDPartner.periodeVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0))}
                                            >
                                                {language === null ? eng.terapkan : language.terapkan}
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={resetButtonVAUSDPartnerHandle}
                                                className={(inputHandleVAUSDPartner.periodeVAUSDPartner === 0 || (inputHandleVAUSDPartner.periodeVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                                disabled={(inputHandleVAUSDPartner.periodeVAUSDPartner === 0 || (inputHandleVAUSDPartner.periodeVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0))}
                                            >
                                                {language === null ? eng.aturUlang : language.aturUlang}
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                            <div className="div-table pb-4">
                                <DataTable
                                    columns={columnsPartner}
                                    data={listTransaksiVAUSDPartner}
                                    customStyles={customStylesTransaksiVAUSD}
                                    noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
                                    highlightOnHover
                                    progressPending={pendingTransaksiVAUSDPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>{language === null ? eng.totalHalaman : language.totalHalaman} : {totalPageVAUSDPartner}</div>
                                <Pagination
                                    activePage={activePageVAUSDPartner}
                                    itemsCountPerPage={pageNumberVAUSDPartner.row_per_page}
                                    totalItemsCount={(pageNumberVAUSDPartner.row_per_page*pageNumberVAUSDPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeVAUSDPartner}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Transaksi  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; VA USD</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi VA USD</h2>
                        </div>
                        <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Tabel Transaksi VA USD</h2>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 64 }}>ID Transaksi</span>
                                    <input onChange={(e) => handleChangeAdmin(e)} value={inputHandleVAUSDAdmin.idTransaksiVAUSDAdmin} name="idTransaksiVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Partner Trans ID</span>
                                    <input onChange={(e) => handleChangeAdmin(e)} value={inputHandleVAUSDAdmin.partnerTransIdVAUSDAdmin} name="partnerTransIdVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 32 }}>No. VA</span>
                                    <input onChange={(e) => handleChangeAdmin(e)} value={inputHandleVAUSDAdmin.noVAVAUSDAdmin} name="noVAVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan No. VA'/>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                    <span style={{ marginRight: 25 }}>Periode Request <span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeVAUSDAdmin' className="input-text-riwayat ms-3" value={inputHandleVAUSDAdmin.periodeVAUSDAdmin} onChange={(e) => handleChangePeriodeVAUSDAdmin(e)}>
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 8 }}>Nama Merchant</span>
                                    <input onChange={(e) => handleChangeAdmin(e)} value={inputHandleVAUSDAdmin.namaMerchantVAUSDAdmin} name="namaMerchantVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan Nama Merchant'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Nama Payer</span>
                                    <input onChange={(e) => handleChangeAdmin(e)} value={inputHandleVAUSDAdmin.namaPayerVAUSDAdmin} name="namaPayerVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan Nama Payer'/>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} style={{ display: showDateVAUSDAdmin, paddingRight: 38 }} className='text-end'>
                                    <DateRangePicker
                                        onChange={pickDateVAUSDAdmin}
                                        value={stateVAUSDAdmin}
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
                                                onClick={() => getListTransaksiVAUSDAdmin(1, inputHandleVAUSDAdmin.idTransaksiVAUSDAdmin, inputHandleVAUSDAdmin.partnerTransIdVAUSDAdmin, inputHandleVAUSDAdmin.noVAVAUSDAdmin, inputHandleVAUSDAdmin.periodeVAUSDAdmin, dateRangeVAUSDAdmin, inputHandleVAUSDAdmin.namaMerchantVAUSDAdmin, inputHandleVAUSDAdmin.namaPayerVAUSDAdmin)}
                                                className={(inputHandleVAUSDAdmin.periodeVAUSDAdmin === 0 || (inputHandleVAUSDAdmin.periodeVAUSDAdmin === 7 && dateRangeVAUSDAdmin.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                                disabled={(inputHandleVAUSDAdmin.periodeVAUSDAdmin === 0 || (inputHandleVAUSDAdmin.periodeVAUSDAdmin === 7 && dateRangeVAUSDAdmin.length === 0))}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={resetButtonVAUSDAdminHandle}
                                                className={(inputHandleVAUSDAdmin.periodeVAUSDAdmin === 0 || (inputHandleVAUSDAdmin.periodeVAUSDAdmin === 7 && dateRangeVAUSDAdmin.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                                disabled={(inputHandleVAUSDAdmin.periodeVAUSDAdmin === 0 || (inputHandleVAUSDAdmin.periodeVAUSDAdmin === 7 && dateRangeVAUSDAdmin.length === 0))}
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
                                    data={listTransaksiVAUSDAdmin}
                                    customStyles={customStylesTransaksiVAUSD}
                                    highlightOnHover
                                    progressPending={pendingTransaksiVAUSDAdmin}
                                    progressComponent={<CustomLoader />}
                                    // pagination
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageVAUSDAdmin}</div>
                                <Pagination
                                    activePage={activePageVAUSDAdmin}
                                    itemsCountPerPage={pageNumberVAUSDAdmin.row_per_page}
                                    totalItemsCount={(pageNumberVAUSDAdmin.row_per_page*pageNumberVAUSDAdmin.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeVAUSDAdmin}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default RiwayatVAUSD