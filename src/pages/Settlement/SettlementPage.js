import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination';
import { Link, useHistory } from 'react-router-dom';
import ReactSelect, { components } from 'react-select'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import * as XLSX from "xlsx"
import axios from 'axios';
import encryptData from '../../function/encryptData';
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"

function SettlementPage() {

    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
    const [dataListPartner, setDataListPartner] = useState([])
    const [listBank, setListBank] = useState([])
    const [dataRiwayatSettlement, setDataRiwayatSettlement] = useState([])
    const [dataRiwayatSettlementPartner, setDataRiwayatSettlementPartner] = useState([])
    const [totalSettlement, setTotalSettlement] = useState([])
    const [stateSettlement, setStateSettlement] = useState(null)
    const [stateSettlementPartner, setStateSettlementPartner] = useState(null)
    const [dateRangeSettlement, setDateRangeSettlement] = useState([])
    const [dateRangeSettlementPartner, setDateRangeSettlementPartner] = useState([])
    const [showDateSettlement, setShowDateSettlement] = useState("none")
    const [showDateSettlementPartner, setShowDateSettlementPartner] = useState("none")
    const [inputHandle, setInputHandle] = useState({
        idTransaksiSettlement: "",
        namaPartnerSettlement: "",
        statusSettlement: [],
        periodeSettlement: 0,
        bankSettlement: "",
        fiturSettlement: 0,
        idTransaksiSettlementPartner: "",
        periodeSettlementPartner: 0,
        statusSettlementPartner: [],
        fiturSettlementPartner: 0
    })
    const [pendingSettlement, setPendingSettlement] = useState(true)
    const [pendingSettlementPartner, setPendingSettlementPartner] = useState(true)
    const [activePageSettlement, setActivePageSettlement] = useState(1)
    const [activePageSettlementPartner, setActivePageSettlementPartner] = useState(1)
    const [pageNumberSettlement, setPageNumberSettlement] = useState({})
    const [pageNumberSettlementPartner, setPageNumberSettlementPartner] = useState({})
    const [totalPageSettlement, setTotalPageSettlement] = useState(0)
    const [totalPageSettlementPartner, setTotalPageSettlementPartner] = useState(0)
    const [isFilterSettlement, setIsFilterSettlement] = useState(false)
    const [isFilterSettlementPartner, setIsFilterSettlementPartner] = useState(false)
    const [selectedPartnerSettlement, setSelectedPartnerSettlement] = useState([])
    const [selectedBankSettlement, setSelectedBankSettlement] = useState([])
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).toISOString().split('T')[0]

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

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeSettlement(e, role) {
        if (role !== "partner") {
            if (e.target.value === "7") {
                setShowDateSettlement("")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateSettlement("none")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            }
        } else {
            if (e.target.value === "7") {
                setShowDateSettlementPartner("")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateSettlementPartner("none")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            }
        }
    }

    function handlePageChangeSettlement(page) {
        if (isFilterSettlement) {
            setActivePageSettlement(page)
            filterSettlement(page, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")
        } else {
            setActivePageSettlement(page)
            riwayatSettlement(page)
        }
    }

    function handlePageChangeSettlementPartner(page) {
        if (isFilterSettlementPartner) {
            setActivePageSettlementPartner(page)
            filterSettlementPartner(inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, page, 0, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner)
        } else {
            setActivePageSettlementPartner(page)
            riwayatSettlementPartner(page, currentDate)
        }
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
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatSettlement(currentPage) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0, "bank_code": ""}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
            if (dataRiwayatSettlement.status === 200 && dataRiwayatSettlement.data.response_code === 200 && dataRiwayatSettlement.data.response_new_token.length === 0) {
                dataRiwayatSettlement.data.response_data.results.list_data = dataRiwayatSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberSettlement(dataRiwayatSettlement.data.response_data)
                setTotalPageSettlement(dataRiwayatSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(dataRiwayatSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataRiwayatSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            } else if (dataRiwayatSettlement.status === 200 && dataRiwayatSettlement.data.response_code === 200 && dataRiwayatSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatSettlement.data.response_new_token)
                dataRiwayatSettlement.data.response_data.results.list_data = dataRiwayatSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberSettlement(dataRiwayatSettlement.data.response_data)
                setTotalPageSettlement(dataRiwayatSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(dataRiwayatSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataRiwayatSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatSettlementPartner(currentPage, currentDate) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"tvasettl_code":"", "statusID": [], "date_from":"", "date_to":"", "period": 2, "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataSettlement = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
            // console.log(dataSettlement, "data settlement");
            if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlementPartner(dataSettlement.data.response_data)
                setTotalPageSettlementPartner(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlementPartner(dataSettlement.data.response_data.results)        
                setPendingSettlementPartner(false)
            } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataSettlement.data.response_new_token)
                dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlementPartner(dataSettlement.data.response_data)
                setTotalPageSettlementPartner(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlementPartner(dataSettlement.data.response_data.results)        
                setPendingSettlementPartner(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBankNameHandler() {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"fitur_id":"100"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listBankName = await axios.post(BaseURL + "/Home/BankGetList", {data: dataParams}, { headers: headers });
            if (listBankName.status === 200 && listBankName.data.response_code === 200 && listBankName.data.response_new_token.length === 0) {
                let newArr = []
                listBankName.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_code
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setListBank(newArr)
            } else if (listBankName.status === 200 && listBankName.data.response_code === 200 && listBankName.data.response_new_token.length !== 0) {
                setUserSession(listBankName.data.response_new_token)
                let newArr = []
                listBankName.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_code
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setListBank(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function pickDateSettlement(item) {
        setStateSettlement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlement(item)
        }
    }

    function pickDateSettlementPartner(item) {
        setStateSettlementPartner(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlementPartner(item)
        }
    }

    async function filterSettlement(page, statusId, transId, partnerId, dateId, periode, rowPerPage, fiturSettlement, bankSettlement) {
        try {
            setPendingSettlement(true)
            setIsFilterSettlement(true)
            setActivePageSettlement(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId !== undefined) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fiturSettlement}, "bank_code": "${bankSettlement !== undefined ? bankSettlement : ""}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const filterSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
            if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSettlement(filterSettlement.data.response_data)
                setTotalPageSettlement(filterSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(filterSettlement.data.response_data.results.list_data)
                setTotalSettlement(filterSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
                setUserSession(filterSettlement.data.response_new_token)
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSettlement(filterSettlement.data.response_data)
                setTotalPageSettlement(filterSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(filterSettlement.data.response_data.results.list_data)
                setTotalSettlement(filterSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterSettlementPartner(idTransaksi, periode, dateId, page, rowPerPage, status, fitur) {
        try {
            setPendingSettlementPartner(true)
            setIsFilterSettlementPartner(true)
            setActivePageSettlementPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"tvasettl_code": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "statusID": [${(status.length !== 0) ? status : []}], "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateId}, "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id":${fitur}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const filterSettlement = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
            if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
                filterSettlement.data.response_data.results = filterSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlementPartner(filterSettlement.data.response_data.results)
                setTotalPageSettlementPartner(filterSettlement.data.response_data.max_page)
                setPageNumberSettlementPartner(filterSettlement.data.response_data)
                setPendingSettlementPartner(false)
            } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
                setUserSession(filterSettlement.data.response_new_token)
                filterSettlement.data.response_data.results = filterSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlementPartner(filterSettlement.data.response_data.results)
                setTotalPageSettlementPartner(filterSettlement.data.response_data.max_page)
                setPageNumberSettlementPartner(filterSettlement.data.response_data)
                setPendingSettlementPartner(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle(role) {
        if (role === "admin") {
            setInputHandle({
                ...inputHandle,
                idTransaksiSettlement: "",
                namaPartnerSettlement: "",
                statusSettlement: [],
                periodeSettlement: 0,
                bankSettlement: "",
                fiturSettlement: 0
            })
            setSelectedPartnerSettlement([])
            setSelectedBankSettlement([])
            setStateSettlement(null)
            setDateRangeSettlement([])
            setShowDateSettlement("none")
        } else {
            setInputHandle({
                ...inputHandle,
                idTransaksiSettlementPartner: "",
                periodeSettlementPartner: 0,
                statusSettlementPartner: [],
                fiturSettlementPartner: 0
            })
            setStateSettlementPartner(null)
            setDateRangeSettlementPartner([])
            setShowDateSettlementPartner("none")
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102" || user_role === "104") {
            // history.push('/404');
            riwayatSettlementPartner(activePageSettlementPartner, currentDate)
        } else {
            listPartner()
            riwayatSettlement(activePageSettlement)
            getBankNameHandler()
        }
    }, [access_token, user_role])

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvasettl_code,
            width: "224px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}`} >{row.tvasettl_code}</Link>
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            wrap: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.mfitur_desc,
            width: "224px",
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tvasettl_amount),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.total_trx,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.total_partner_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.total_fee_tax),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.total_fee_bank),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Settlement',
            selector: row => convertToRupiah(row.tvasettl_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "140px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tvasettl_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 1 || row.tvasettl_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 9 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsSettlementPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvasettl_code,
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${'0'}`}>{row.tvasettl_code}</Link>,
            width: "251px"
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.mfitur_desc,
            // sortable: true
        },
        {
            name: 'Jumlah',
            selector: row => row.tvasettl_amount,
            cell: row => <div style={{ padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name,
            width: "127px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: 6, margin: "6px 16px", width: "50%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                when: row => row.tvasettl_status_id === 2,
                style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                when: row => row.tvasettl_status_id === 1 || row.tvasettl_status_id === 7,
                style: { background: "#FEF4E9", color: "#F79421" }
                },
                {
                when: row => row.tvasettl_status_id === 4,
                style: { background: "#FDEAEA", color: "#EE2E2C" }
                },
                {
                when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 9 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
                style: { background: "#F0F0F0", color: "#888888" }
                }
            ],
        },
    ];

    const customStylesPartner = {
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
    
    const customStylesSettlement = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
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

    function ExportReportSettlementHandler(isFilter, statusId, transId, partnerId, dateId, periode, bankCode) {
        if (isFilter) {
            async function dataExportFilter(statusId, transId, partnerId, dateId, periode, codeBank) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "bank_code": "${codeBank}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, partnerId, dateId, periode, bankCode)
        } else {
            async function dataExportSettlement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "bank_code": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
                    if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length === 0) {
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    } else if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length !== 0) {
                        setUserSession(dataExportSettlement.data.response_new_token)
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportSettlement()
        }
    }

    function ExportReportSettlementPartnerHandler(isFilter, idTransaksi, periode, dateId, status, fitur, oneMonthAgo, currentDate) {
        if (isFilter) {
            async function exportFilterSettlement(idTransaksi, periode, dateId, status, fitur) {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"tvasettl_code": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "statusID": [${(status.length !== 0) ? status : []}], "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateId}, "page": 1, "row_per_page": 1000000, "fitur_id":${fitur}}`)
                const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
                }
                const dataExportFilter = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
                if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                const data = dataExportFilter.data.response_data.results = dataExportFilter.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
                } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {            
                setUserSession(dataExportFilter.data.response_new_token)
                const data = dataExportFilter.data.response_data.results = dataExportFilter.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
                }
            } catch (error) {
                // console.log(error)
                history.push(errorCatch(error.response.status))
            }
            }
            exportFilterSettlement(idTransaksi, periode, dateId, status, fitur)
        } else {
            async function exportGetSettlement(oneMonthAgo, currentDate) {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"tvasettl_code":"", "statusID": [], "date_from":"${currentDate}", "date_to":"${currentDate}", "period": 2, "page": 1, "row_per_page": 1000000, "fitur_id": 0}`)
                const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
                }
                const dataSettlement = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
                // console.log(dataSettlement, "data settlement");
                if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                const data = dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
                } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataSettlement.data.response_new_token)
                const data = dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
                }
            } catch (error) {
                // console.log(error)
                history.push(errorCatch(error.response.status))
            }
            }
            exportGetSettlement(oneMonthAgo, currentDate)
        }
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    // console.log(user_role, user_role !== "102" || user_role !== "104",'user_role' );

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Settlement</span>
            <div className='head-title'>
                <h2 className="h5 mb-1 mt-4">Settlement</h2>
            </div>
            <div className='main-content'>
                {
                    (user_role !== "102") ?
                    <div className='riwayat-settlement-div mt-3 mb-4'>
                        <span className='mt-4' style={{fontWeight: 600}}>Table Riwayat Settlement Partner</span>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>ID Transaksi</span>
                                    <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlement} name="idTransaksiSettlement" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className='me-3'>Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListPartner}
                                            value={selectedPartnerSettlement}
                                            onChange={(selected) => setSelectedPartnerSettlement([selected])}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Status</span>
                                    <Form.Select name="statusSettlement" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={7}>Menunggu Pembayaran</option>
                                        <option value={9}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlement === "none") ? "33.2%" : "33.2%" }}>
                                    <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeSettlement' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlement} onChange={(e) => handleChangePeriodeSettlement(e, "admin")}>
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
                                    <span>Jenis Transaksi</span>
                                    <Form.Select name='fiturSettlement' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.fiturSettlement} onChange={(e) => handleChange(e)}>
                                        <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                                        <option value={104}>Payment Link</option>
                                        <option value={100}>Virtual Account</option>
                                        <option value={107}>Direct Debit</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className="me-2">Nama Bank</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={listBank}
                                            value={selectedBankSettlement}
                                            onChange={(selected) => setSelectedBankSettlement([selected])}
                                            placeholder="Pilih Nama Bank"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} style={{ display: showDateSettlement }} className='text-end'>
                                    <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                        <DateRangePicker
                                            onChange={pickDateSettlement}
                                            value={stateSettlement}
                                            clearIcon={null}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")}
                                                className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-ez-on" : "btn-ez"}
                                                disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonHandle("admin")}
                                                className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className='settlement-amount'>
                                <div className="card-information mt-3" style={{border: '1px solid #EBEBEB'}}>
                                    <p className="p-info">Total Settlement</p>
                                    <p className="p-amount">{convertToRupiah(totalSettlement)}</p>
                                </div>
                            </div>
                            {
                                dataRiwayatSettlement.length !== 0 &&
                                <div style={{ marginBottom: 30 }}>
                                    <Link to={"#"} onClick={() => ExportReportSettlementHandler(isFilterSettlement, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")} className="export-span">Export</Link>
                                </div>
                            }
                            <div className="div-table mt-4 pb-4">
                                <DataTable
                                    columns={columnsSettl}
                                    data={dataRiwayatSettlement}
                                    customStyles={customStylesSettlement}
                                    progressPending={pendingSettlement}
                                    progressComponent={<CustomLoader />}
                                    dense
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlement}</div>
                                <Pagination
                                    activePage={activePageSettlement}
                                    itemsCountPerPage={pageNumberSettlement.row_per_page}
                                    totalItemsCount={(pageNumberSettlement.row_per_page*pageNumberSettlement.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeSettlement}
                                />
                            </div>
                        </div>
                    </div> :
                    <div className='base-content'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
                        {/* {dataChartTransfer.length > 0 ? */}
                            {/* <Line
                                    className="mt-3 mb-3"
                                    data={{
                                    labels: dataChartTransfer.map(obj => obj.dates),
                                    datasets: [
                                        {
                                        label: null,
                                        fill: true,
                                        // backgroundColor: gradient,
                                        backgroundColor: "rgba(156, 67, 223, 0.38)",
                                        borderColor: "#9C43DF",
                                        pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                        pointBorderColor: "#9C43DF",
                                        data: dataChartTransfer.map(obj => obj.nominal_day)
                                        },
                                    ],
                                    }}
                                    height={100}
                                    width={200}
                                    options= {{
                                    plugins: {
                                        legend: {
                                        display: false
                                        },
                                    },
                                    responsive: true,
                                    scales: {
                                        xAxes: {
                                        beginAtZero: false,
                                        ticks: {
                                            autoSkip: false,
                                            maxRotation: 45,
                                            minRotation: 45
                                        }
                                        },
                                        yAxes: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 2000
                                        }
                                        }
                                    }
                                    }}
                                />
                            */}
                            {/* <Row>
                                    <Col xs={12}>
                                        <div className="div-chart">
                                            <Chart type='line' data={data} />
                                        </div>
                                    </Col>
                                </Row>
                            */}
                            {/* <br/> */}
                        <Row className='mt-4'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className="me-1">ID Transaksi</span>
                                <input name="idTransaksiSettlementPartner" onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlementPartner} type='text'className='input-text-riwayat' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlementPartner === "none") ? "33%" : "33%" }}>
                                <span >Periode<span style={{ color: "red" }}>*</span></span>
                                <Form.Select name='periodeSettlementPartner' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlementPartner} onChange={(e) => handleChangePeriodeSettlement(e, "partner")}>
                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>                    
                            </Col>                
                            <Col xs={4}>
                                <span>Status</span>
                                <Form.Select name="statusSettlementPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusSettlementPartner} onChange={(e) => handleChange(e)}>
                                    <option defaultChecked disabled value="">Pilih Status</option>
                                    <option value={2}>Berhasil</option>
                                    <option value={1}>Dalam Proses</option>
                                    <option value={4}>Gagal</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Jenis Transaksi</span>
                                <Form.Select name="fiturSettlementPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.fiturSettlementPartner} onChange={(e) => handleChange(e)}>
                                    <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                                    <option value={104}>Payment Link</option>
                                    <option value={100}>VA Partner</option>
                                    <option value={107}>Direct Debit</option>
                                </Form.Select>
                            </Col>
                            <Col xs={4} style={{ display: showDateSettlementPartner }}>
                                <DateRangePicker
                                    onChange={pickDateSettlementPartner}
                                    value={stateSettlementPartner}
                                    clearIcon={null}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => filterSettlementPartner(inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, 1, 0, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner)}
                                            className={(inputHandle.periodeSettlementPartner !== 0 || dateRangeSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.idTransaksiSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.statusSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.fiturSettlementPartner.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            disabled={inputHandle.periodeSettlementPartner === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.idTransaksiSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.statusSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.fiturSettlementPartner.length === 0}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle("partner")}
                                            className={(inputHandle.periodeSettlementPartner || dateRangeSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.idTransaksiSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.statusSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.fiturSettlementPartner.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                            disabled={inputHandle.periodeSettlementPartner === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.idTransaksiSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.statusSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.fiturSettlementPartner.length === 0}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            dataRiwayatSettlementPartner.length !== 0 &&
                                <div>
                                    <Link onClick={() => ExportReportSettlementPartnerHandler(isFilterSettlementPartner, inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner, oneMonthAgo, currentDate)} className="export-span">Export</Link>
                                </div>
                        }
                        <br/>
                        <br/>
                        <div className="div-table">
                            <DataTable
                                columns={columnsSettlementPartner}
                                data={dataRiwayatSettlementPartner}
                                customStyles={customStylesPartner}
                                progressPending={pendingSettlementPartner}
                                progressComponent={<CustomLoader />}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlementPartner}</div>
                            <Pagination
                                activePage={activePageSettlementPartner}
                                itemsCountPerPage={pageNumberSettlementPartner.row_per_page}
                                totalItemsCount={(pageNumberSettlementPartner.row_per_page*pageNumberSettlementPartner.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeSettlementPartner}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SettlementPage