import React, { useState, useEffect } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { Link, useHistory } from 'react-router-dom'
import { Button, Col, Form, Image, Modal, Row, Toast } from '@themesberg/react-bootstrap'
import ReactSelect, { components } from 'react-select';
import axios from 'axios'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import DataTable, { defaultThemes } from 'react-data-table-component';
import encryptData from '../../function/encryptData'
import { DateRangePicker } from 'rsuite'
import "rsuite/dist/rsuite.css";
import triangleInfo from "../../assets/icon/triangle-info.svg"
import * as XLSX from "xlsx"
import CurrencyInput from "react-currency-input-field";
import Checklist from '../../assets/icon/checklist_icon.svg'

function SettlementManual() {

    const user_role = getRole()
    const history = useHistory()
    const [isSettlementVA, setIsSettlementVA] = useState(100)
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataListVA, setDataListVA] = useState([])
    const [dataListSummaryVA, setDataListSummaryVA] = useState([])
    const [dataListEMoney, setDataListEMoney] = useState([])
    const [dataListSummaryEMoney, setDataListSummaryEMoney] = useState([])
    const [selectedPartnerSettlementVA, setSelectedPartnerSettlementVA] = useState([])
    const [selectedPartnerSettlementEMoney, setSelectedPartnerSettlementEMoney] = useState([])
    const [stateSettlementVA, setStateSettlementVA] = useState(null)
    const [stateSettlementEMoney, setStateSettlementEMoney] = useState(null)
    const [dateRangeSettlementVA, setDateRangeSettlementVA] = useState([])
    const [dateRangeSettlementEMoney, setDateRangeSettlementEMoney] = useState([])
    const [pendingSettlementVA, setPendingSettlementVA] = useState(false)
    const [pendingSettlementEMoney, setPendingSettlementEMoney] = useState(false)
    const [showModalFormSettlementManual, setShowModalFormSettlementManual] = useState(false)
    const [inputHandle, setInputHandle] = useState({
        currencyVA: "IDR",
        amountVA: 0,
        feeVA: 0,
        accountPengirimVA: "",
        accountNamePengirimVA: "",
        accountPenerimaVA: "",
        accountNamePenerimaVA: "",
        reffNoVA: "",
        currencyEMoney: "IDR",
        amountEMoney: 0,
        feeEMoney: 0,
        accountPengirimEMoney: "",
        accountNamePengirimEMoney: "",
        accountPenerimaEMoney: "",
        accountNamePenerimaEMoney: "",
        reffNoEMoney: "",
    })
    const [selectedBankSenderVA, setSelectedBankSenderVA] = useState([])
    const [selectedBankSenderEMoney, setSelectedBankSenderEMoney] = useState([])
    const [selectedBankRecieverVA, setSelectedBankRecieverVA] = useState([])
    const [selectedBankRecieverEMoney, setSelectedBankRecieverEMoney] = useState([])
    const [listBank, setListBank] = useState([])
    const [showModalSucces, setShowModalSucces] = useState(false)

    const { after } = DateRangePicker;
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    const threeDaysAgo = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2).toISOString().split('T')[0]
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
    const column = [
        {
            label: <><img src={triangleInfo} alt="triangle_info" style={{ marginRight: 3, marginTop: -6 }} /> Range Tanggal maksimal 3 hari sebelum hari ini.</>,
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
    
    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    {/* <input
                        type='select'
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "} */}
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

    function toReportSettlement() {
        history.push("/Riwayat/transaksi")
        setShowModalSucces(false)
    }

    function resetButtonHandle(param) {
        if (param === "VA") {
            setSelectedPartnerSettlementVA([])
            setStateSettlementVA(null)
            setDateRangeSettlementVA([])
            setDataListVA([])
            setDataListSummaryVA([])
            setInputHandle({
                ...inputHandle,
                currencyVA: "IDR",
                amountVA: 0,
                feeVA: 0,
                accountPengirimVA: "",
                accountNamePengirimVA: "",
                accountPenerimaVA: "",
                accountNamePenerimaVA: "",
                reffNoVA: ""
            })
        } else {
            setSelectedPartnerSettlementEMoney([])
            setStateSettlementEMoney(null)
            setDateRangeSettlementEMoney([])
            setDataListEMoney([])
            setDataListSummaryEMoney([])
            setInputHandle({
                ...inputHandle,
                currencyEMoney: "IDR",
                amountEMoney: 0,
                feeEMoney: 0,
                accountPengirimEMoney: "",
                accountNamePengirimEMoney: "",
                accountPenerimaEMoney: "",
                accountNamePenerimaEMoney: "",
                reffNoEMoney: ""
            })
        }
    }

    function pickDateSettlement(item, tabs) {
        if (tabs === "VA") {
            setStateSettlementVA(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
                // item = item.map(el => el.toLocaleDateString('en-CA'))
                setDateRangeSettlementVA(item)
            }
        } else {
            setStateSettlementEMoney(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
                // item = item.map(el => el.toLocaleDateString('en-CA'))
                setDateRangeSettlementEMoney(item)
            }
        }
    }

    function handleChangeNamaPartner(e, jenisTransaksi) {
        if (jenisTransaksi === 'Virtual Account') {
            setSelectedPartnerSettlementVA([e])
        } else {
            setSelectedPartnerSettlementEMoney([e])
        }
    }

    function pindahHalaman (param) {
        if (param === "VA") {
            settlementManualTabs(100)
            resetButtonHandle("eMoney")
        } else {
            settlementManualTabs(101)
            resetButtonHandle("VA")
        }
    }

    function settlementManualTabs(isTabs){
        setIsSettlementVA(isTabs)
        if(isTabs === 101){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
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

    async function settlementManualVAOrEMoney(settleType, partnerId, dateRange, currency, amount, fee, bankIdFrom, accNumFrom, accNameFrom, bankIdTo, accNumTo, accNameTo, reffNo) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "${partnerId[0].value}", "date_from": "${dateRange[0]}", "date_to": "${dateRange[1]}", "type_settlement": ${settleType}, "currency": "${currency}", "amount": ${amount}, "fee": ${fee}, "bank_id_from": ${bankIdFrom}, "acc_num_from": "${accNumFrom}", "acc_name_from": "${accNameFrom}", "bank_id_to": ${bankIdTo}, "acc_num_to": "${accNumTo}", "acc_name_to": "${accNameTo}", "reff_no": "${reffNo}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const settlementManual = await axios.post(BaseURL + "/Settlement/ProcessManualSettlement", {data: dataParams}, {headers: headers})
            if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token === null) {
                resetButtonHandle(settleType === 100 ? "VA" : "eMoney")
                setShowModalFormSettlementManual(false)
                setShowModalSucces(true)
                setTimeout(() => {
                    setShowModalSucces(false)
                }, 5000);
            } else if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token !== null) {
                setUserSession(settlementManual.data.response_new_token)
                resetButtonHandle(settleType === 100 ? "VA" : "eMoney")
                setShowModalFormSettlementManual(false)
                setShowModalSucces(true)
                setTimeout(() => {
                    setShowModalSucces(false)
                }, 5000);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterSettlementVA(partnerId, daterange) {
        try {
            setPendingSettlementVA(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "${partnerId[0].value}", "date_from": "${daterange[0]}", "date_to": "${daterange[1]}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataVAList = await axios.post(BaseURL + "/Settlement/GetVirtualAccountList", {data: dataParams}, {headers: headers})
            if (dataVAList.data.response_code === 200 && dataVAList.status === 200 && dataVAList.data.response_new_token === null) {
                dataVAList.data.response_data.results.list = dataVAList.data.response_data.results.list.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataListVA(dataVAList.data.response_data.results.list)
                setDataListSummaryVA(dataVAList.data.response_data.results.summary)
                setInputHandle({ ...inputHandle, amountVA: dataVAList.data.response_data.results.summary[dataVAList.data.response_data.results.summary.length-1]?.Amount })
                setPendingSettlementVA(false)
            } else if (dataVAList.data.response_code === 200 && dataVAList.status === 200 && dataVAList.data.response_new_token !== null) {
                setUserSession(dataVAList.data.response_new_token)
                dataVAList.data.response_data.results.list = dataVAList.data.response_data.results.list.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataListVA(dataVAList.data.response_data.results.list)
                setDataListSummaryVA(dataVAList.data.response_data.results.summary)
                setInputHandle({ ...inputHandle, amountVA: dataVAList.data.response_data.results.summary[dataVAList.data.response_data.results.summary.length-1]?.Amount })
                setPendingSettlementVA(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterSettlementEMoney(partnerId, daterange) {
        try {
            setPendingSettlementEMoney(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "${partnerId[0].value}", "date_from": "${daterange[0]}", "date_to": "${daterange[1]}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataEmoneyList = await axios.post(BaseURL + "/Settlement/GetEmoneyList", {data: dataParams}, {headers: headers})
            if (dataEmoneyList.data.response_code === 200 && dataEmoneyList.status === 200 && dataEmoneyList.data.response_new_token === null) {
                dataEmoneyList.data.response_data.results.list = dataEmoneyList.data.response_data.results.list.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataListEMoney(dataEmoneyList.data.response_data.results.list)
                setDataListSummaryEMoney(dataEmoneyList.data.response_data.results.summary)
                setInputHandle({ ...inputHandle, amountEMoney: dataEmoneyList.data.response_data.results.summary[dataEmoneyList.data.response_data.results.summary.length-1]?.Amount })
                setPendingSettlementEMoney(false)
            } else if (dataEmoneyList.data.response_code === 200 && dataEmoneyList.status === 200 && dataEmoneyList.data.response_new_token !== null) {
                setUserSession(dataEmoneyList.data.response_new_token)
                dataEmoneyList.data.response_data.results.list = dataEmoneyList.data.response_data.results.list.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataListEMoney(dataEmoneyList.data.response_data.results.list)
                setDataListSummaryEMoney(dataEmoneyList.data.response_data.results.summary)
                setInputHandle({ ...inputHandle, amountEMoney: dataEmoneyList.data.response_data.results.summary[dataEmoneyList.data.response_data.results.summary.length-1]?.Amount })
                setPendingSettlementEMoney(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        listPartner()
        getBankNameHandler()
        // getVAList()
        // getEMoneyList()
    }, [])

    function ExportReportDetailSettlementVAOrEMoney(dataDetail, dataSummary, settlementId) {
        let dataExcel = []
        dataDetail.forEach((item, i) => {
            if (settlementId === 100) {
                dataExcel.push({ No: i+1, "ID Transaksi": item.tvatrans_trx_id, Waktu: item.tvatrans_crtdt_format, "Partner Trans ID": item.partner_transid, "Nama Partner": item.mpartner_name, "Nama Bank": item.mbank_name, "No VA": item.tvatrans_va_number, "Nominal Transaksi": item.tvatrans_amount, "Jasa Layanan": item.tvatrans_partner_fee, "Fee Tax": item.tvatrans_fee_tax, "Bank Fee": item.tvatrans_bank_fee, Status: item.mstatus_name_ind })
            } else {
                dataExcel.push({ No: i+1, "ID Transaksi": item.transID, Waktu: item.processDate, "Refference No": item.referenceNumber, "Nama Partner": item.partnerName, "Jenis Transaksi": item.ewalletName, "Nominal Transaksi": item.amount, "Fee": item.ewalletFee, "Fee Tax": item.feeTax, "Total Transaksi": item.totalAmount, Status: item.status })
            }
        })
        let workSheet1 = XLSX.utils.json_to_sheet(dataSummary);
        let workSheet2 = XLSX.utils.json_to_sheet(dataExcel);
        let workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet1, "Summary Transaksi");
        XLSX.utils.book_append_sheet(workBook, workSheet2, "Detail Transaksi");
        XLSX.writeFile(workBook, settlementId === 100 ? "Settlement_Manual_VA.xlsx" : "Settlement_Manual_eMoney.xlsx");
    }
    
    const columnsSettlVA = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvatrans_trx_id,
            // sortable: true
            width: "224px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}`} >{row.tvasettl_code}</Link>
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            // style: { justifyContent: "center", },
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_transid,
            width: "224px",
            wrap: true,
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            wrap: true,
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
            width: "224px",
            wrap: true,
            // sortable: true,
        },
        {
            name: 'No VA',
            selector: row => row.tvatrans_va_number,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.tvatrans_amount),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.tvatrans_partner_fee),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Tax',
            selector: row => convertToRupiah(row.tvatrans_fee_tax),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Bank Fee',
            selector: row => convertToRupiah(row.tvatrans_bank_fee),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "140px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tvatrans_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvatrans_status_id === 1 || row.tvatrans_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvatrans_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvatrans_status_id === 3 || row.tvatrans_status_id === 5 || row.tvatrans_status_id === 6 || row.tvatrans_status_id === 8 || row.tvatrans_status_id === 9 || row.tvatrans_status_id === 10 || row.tvatrans_status_id === 11 || row.tvatrans_status_id === 12 || row.tvatrans_status_id === 13 || row.tvatrans_status_id === 14 || row.tvatrans_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsSummarySettlVA = [
        {
            name: 'Description',
            selector: row => row.description,
            // width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'Amount',
            selector: row => row.description === "Total Transaksi" ? row.amount : convertToRupiah(row.amount, true, 2),
            // sortable: true
            // width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
    ];
    
    const columnsSettlEMoney = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transID,
            // sortable: true
            width: "224px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}`} >{row.tvasettl_code}</Link>
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
        {
            name: 'Waktu',
            selector: row => row.processDate,
            // style: { justifyContent: "center", },
            width: "170px",
            // sortable: true,
        },
        {
            name: 'Refference No',
            selector: row => row.referenceNumber,
            width: "224px",
            wrap: true,
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nama Partner',
            selector: row => row.partnerName,
            width: "224px",
            wrap: true,
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.ewalletName,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.amount,
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee',
            selector: row => row.ewalletFee,
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Tax',
            selector: row => row.feeTax,
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.totalAmount,
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "140px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.statusID === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.statusID === 1 || row.statusID === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.statusID === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.statusID === 3 || row.statusID === 5 || row.statusID === 6 || row.statusID === 8 || row.statusID === 9 || row.statusID === 10 || row.statusID === 11 || row.statusID === 12 || row.statusID === 13 || row.statusID === 14 || row.statusID === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsSummarySettlEMoney = [
        {
            name: 'Description',
            selector: row => row.Description,
            // width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'Amount',
            selector: row => row.Description === "Total Transaksi" ? row.Amount : convertToRupiah(row.Amount, true, 2),
            // sortable: true
            // width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
    ];
    
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
                    borderleftStyle: 'solid',
                    borderleftWidth: '1px',
                    borderleftColor: defaultThemes.default.divider.default,
                },
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
                borderleftStyle: 'solid',
                borderleftWidth: '1px',
                borderleftColor: defaultThemes.default.divider.default,
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: defaultThemes.default.divider.default,
            },
        },
    };
    
    const customStylesSummary = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                // '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                    borderleftStyle: 'solid',
                    borderleftWidth: '1px',
                    borderleftColor: defaultThemes.default.divider.default,
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: defaultThemes.default.divider.default,
                // },
            },
        },
        cells: {
            style: {
                // '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                    borderleftStyle: 'solid',
                    borderleftWidth: '1px',
                    borderleftColor: defaultThemes.default.divider.default,
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: defaultThemes.default.divider.default,
                // },
            },
        },
        headRow: {
            style: {
                backgroundColor: '#F2F2F2',
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
                borderleftStyle: 'solid',
                borderleftWidth: '1px',
                borderleftColor: defaultThemes.default.divider.default,
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: defaultThemes.default.divider.default,
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
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            {
                // showModalStatusDisburse && (responMsg !== 0 && responMsg === 2) &&
                showModalSucces &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#077E86" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Settlement Berhasil. <span style={{ textDecoration: 'underline', cursor: "pointer" }} onClick={() => toReportSettlement()}>Lihat Riwayat Settlement</span></Toast.Body>
                    </Toast>
                </div>
            }
            <span className='breadcrumbs-span'><Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Settlement Manual</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Settlement Manual</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
                        <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("VA")} id="detailakuntab">
                            <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Virtual Account</span>
                        </div>
                        <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("eMoney")} id="konfigurasitab">
                            <span className='menu-detail-akun-span' id="konfigurasispan">EMoney</span>
                        </div>
                    </div>
                    <hr className='hr-style' style={{marginTop: -2}}/>
                    <div className='base-content mt-3 py-5'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        {
                            isSettlementVA === 100 ?
                            <>
                                <Row className='mt-4'>
                                    <Col xs={5} className="d-flex justify-content-start align-items-center">
                                        <span className='me-3'>Nama Partner<span style={{ color: "red" }}>*</span></span>
                                        <div className="dropdown dropSaldoPartner">
                                            <ReactSelect
                                                // isMulti
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                options={dataListPartner}
                                                // allowSelectAll={true}
                                                value={selectedPartnerSettlementVA}
                                                onChange={(selected) => handleChangeNamaPartner(selected, 'Virtual Account')}
                                                placeholder="Pilih Nama Partner"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "33.2%" }}>
                                        <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                        <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                            <DateRangePicker 
                                                value={stateSettlementVA} 
                                                ranges={column} 
                                                onChange={(e) => pickDateSettlement(e, "VA")} 
                                                character=' - ' 
                                                cleanable={true} 
                                                placement={'bottomEnd'} 
                                                size='lg' 
                                                appearance="default" 
                                                placeholder="Select Date Range" 
                                                disabledDate={after(threeDaysAgo)}  
                                                className='datePicker'
                                                locale={Locale}
                                                format="yyyy-MM-dd"
                                                defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={5}>
                                        <Row>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => filterSettlementVA(selectedPartnerSettlementVA, dateRangeSettlementVA)}
                                                    className={selectedPartnerSettlementVA.length !== 0 && dateRangeSettlementVA.length !== 0 ? "btn-ez-on" : "btn-ez"}
                                                    disabled={selectedPartnerSettlementVA.length === 0 || dateRangeSettlementVA.length === 0}
                                                >
                                                    Terapkan
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => resetButtonHandle("VA")}
                                                    className={selectedPartnerSettlementVA.length !== 0 && dateRangeSettlementVA.length !== 0 ? "btn-reset" : "btn-ez-reset"}
                                                    disabled={selectedPartnerSettlementVA.length === 0 || dateRangeSettlementVA.length === 0}
                                                >
                                                    Atur Ulang
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className='settlement-amount mt-4'>
                                    <Row>
                                        <Col xs={dataListSummaryVA.length === 0 ? 12 : 6}>
                                            <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700 }}>Summary Virtual Account</p>
                                            <DataTable
                                                columns={columnsSummarySettlVA}
                                                data={dataListSummaryVA}
                                                customStyles={customStylesSummary}
                                                progressPending={pendingSettlementVA}
                                                progressComponent={<CustomLoader />}
                                                dense
                                                // pagination
                                                // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                {
                                    dataListVA.length !== 0 &&  
                                    <div style={{ marginBottom: 30 }}>
                                        <Link to={"#"} onClick={() => ExportReportDetailSettlementVAOrEMoney(dataListVA, dataListSummaryVA, isSettlementVA)} className="export-span">Export</Link>
                                    </div>
                                }
                                <div className="div-table mt-4 pb-4">
                                    <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700 }}>Detail Transaksi Virtual Account</p>
                                    <DataTable
                                        columns={columnsSettlVA}
                                        data={dataListVA}
                                        customStyles={customStylesSettlement}
                                        progressPending={pendingSettlementVA}
                                        progressComponent={<CustomLoader />}
                                        dense
                                        pagination
                                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                    />
                                </div>
                                <div className='mt-3' style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                                    <button
                                        // onClick={() => settlementManualVAOrEMoney(selectedPartnerSettlementVA, dateRangeSettlementVA, isSettlementVA)}
                                        onClick={() => setShowModalFormSettlementManual(true)}
                                        className={dataListVA.length !== 0 && dataListSummaryVA.length !== 0 ? 'add-button mb-3' : 'btn-off mb-3'}
                                        style={{ maxWidth: 'fit-content' }}
                                        disabled={dataListVA.length === 0 && dataListSummaryVA.length === 0}
                                    >
                                        Settlement
                                    </button>
                                </div>
                            </> :
                            <>
                                <Row className='mt-4'>
                                    <Col xs={5} className="d-flex justify-content-start align-items-center">
                                        <span className='me-3'>Nama Partner<span style={{ color: "red" }}>*</span></span>
                                        <div className="dropdown dropSaldoPartner">
                                            <ReactSelect
                                                // isMulti
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                options={dataListPartner}
                                                // allowSelectAll={true}
                                                value={selectedPartnerSettlementEMoney}
                                                onChange={(selected) => handleChangeNamaPartner(selected, 'eMoney')}
                                                placeholder="Pilih Nama Partner"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "33.2%" }}>
                                        <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                        <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                            <DateRangePicker 
                                                value={stateSettlementEMoney} 
                                                ranges={column} 
                                                onChange={(e) => pickDateSettlement(e, "eMoney")} 
                                                character=' - ' 
                                                cleanable={true} 
                                                placement={'bottomEnd'} 
                                                size='lg' 
                                                appearance="default" 
                                                placeholder="Select Date Range" 
                                                disabledDate={after(threeDaysAgo)}  
                                                className='datePicker'
                                                locale={Locale}
                                                format="yyyy-MM-dd"
                                                defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                            />
                                        </div>                          
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={5}>
                                        <Row>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => filterSettlementEMoney(selectedPartnerSettlementEMoney, dateRangeSettlementEMoney)}
                                                    className={selectedPartnerSettlementEMoney.length !== 0 && dateRangeSettlementEMoney.length !== 0 ? "btn-ez-on" : "btn-ez"}
                                                    disabled={selectedPartnerSettlementEMoney.length === 0 || dateRangeSettlementEMoney.length === 0}
                                                >
                                                    Terapkan
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => resetButtonHandle("eMoney")}
                                                    className={selectedPartnerSettlementEMoney.length !== 0 && dateRangeSettlementEMoney.length !== 0 ? "btn-reset" : "btn-ez-reset"}
                                                    disabled={selectedPartnerSettlementEMoney.length === 0 || dateRangeSettlementEMoney.length === 0}
                                                >
                                                    Atur Ulang
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className='settlement-amount mt-4'>
                                    <Row>
                                        <Col xs={dataListSummaryEMoney.length === 0 ? 12 : 6}>
                                            <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700 }}>Summary E-Money</p>
                                            <DataTable
                                                columns={columnsSummarySettlEMoney}
                                                data={dataListSummaryEMoney}
                                                customStyles={customStylesSummary}
                                                progressPending={pendingSettlementVA}
                                                progressComponent={<CustomLoader />}
                                                dense
                                                // pagination
                                                // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                {
                                    dataListEMoney.length !== 0 &&  
                                    <div style={{ marginBottom: 30 }}>
                                        <Link to={"#"} onClick={() => ExportReportDetailSettlementVAOrEMoney(dataListEMoney, dataListSummaryEMoney, isSettlementVA)} className="export-span">Export</Link>
                                    </div>
                                }
                                <div className="div-table mt-4 pb-4">
                                    <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700 }}>Detail Transaksi E-Money</p>
                                    <DataTable
                                        columns={columnsSettlEMoney}
                                        data={dataListEMoney}
                                        customStyles={customStylesSettlement}
                                        progressPending={pendingSettlementEMoney}
                                        progressComponent={<CustomLoader />}
                                        dense
                                        pagination
                                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                    />
                                </div>
                                <div className='mt-3' style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => setShowModalFormSettlementManual(true)}
                                        className={dataListEMoney.length !== 0 && dataListSummaryEMoney.length !== 0 ? 'add-button mb-3' : 'btn-off mb-3'}
                                        style={{ maxWidth: 'fit-content' }}
                                        disabled={dataListEMoney.length === 0 && dataListSummaryEMoney.length === 0}
                                    >
                                        Settlement
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <Modal className='modal-invoice' show={showModalFormSettlementManual} onHide={() => setShowModalFormSettlementManual(false)} style={{ borderRadius: 8 }}>
                    <Modal.Header className="border-0">
                        <Col>
                            <Button
                                className="position-absolute top-0 end-0 m-3"
                                variant="close"
                                aria-label="Close"
                                onClick={() => setShowModalFormSettlementManual(false)}
                            />
                            <Modal.Title className="text-center fw-bold mt-3">
                                Form Settlement Manual
                            </Modal.Title>
                        </Col>
                    </Modal.Header>
                    <Modal.Body style={{ width: "100%", padding: "24px 24px" }}>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Periode Transaksi<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    value={isSettlementVA === 100 ? dateRangeSettlementVA.join(" - ") : dateRangeSettlementEMoney.join(" - ")}
                                    name="periodeTransaksi"
                                    type='text'
                                    disabled
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Partner Name<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    value={isSettlementVA === 100 ? selectedPartnerSettlementVA[0]?.label : selectedPartnerSettlementEMoney[0]?.label}
                                    name="partnerName"
                                    type='text'
                                    disabled
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Currency<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={5}>
                                <Form.Select name='currencyVA' className="input-text-riwayat ms-2" value={isSettlementVA === 100 ? inputHandle.currencyVA : inputHandle.currencyEMoney} onChange={(e) => setInputHandle({ ...inputHandle, currencyVA: isSettlementVA === 100 ? e.target.value : "IDR", currencyEMoney: isSettlementVA === 100 ? "IDR" : e.target.value })}>
                                    <option defaultChecked disabled value={""}>Pilih Currency</option>
                                    <option value={"IDR"}>IDR</option>
                                    <option value={"USD"}>USD</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Amount<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <CurrencyInput
                                    className="input-text-user ms-2"
                                    name='amountVA'
                                    value={isSettlementVA === 100 ? inputHandle.amountVA : inputHandle.amountEMoney}
                                    onValueChange={(e) => setInputHandle({ ...inputHandle, amountVA: isSettlementVA === 100 ? e : 0, amountEMoney: isSettlementVA === 100 ? 0 : e })}
                                    placeholder="Masukkan Amount"
                                    style={{ width: "95%", borderRadius: 5 }}
                                    groupSeparator={"."}
                                    decimalSeparator={','}
                                    prefix={isSettlementVA === 100 ? (inputHandle.currencyVA === "IDR" ? "Rp " : "$ ") : (inputHandle.currencyEMoney === "IDR" ? "Rp " : "$ ")}
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Fee<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <CurrencyInput
                                    className="input-text-user ms-2"
                                    name='feeVA'
                                    value={isSettlementVA === 100 ? inputHandle.feeVA : inputHandle.feeEMoney}
                                    onValueChange={(e) => setInputHandle({ ...inputHandle, feeVA: isSettlementVA === 100 ? e : 0, feeEMoney: isSettlementVA === 100 ? 0 : e })}
                                    placeholder="Masukkan Fee"
                                    style={{ width: "95%", borderRadius: 5 }}
                                    groupSeparator={"."}
                                    decimalSeparator={','}
                                    prefix={isSettlementVA === 100 ? (inputHandle.currencyVA === "IDR" ? "Rp " : "$ ") : (inputHandle.currencyEMoney === "IDR" ? "Rp " : "$ ")}
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Bank Pengirim<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9} style={{ width: "71.3%", marginLeft: 9 }}>
                                <ReactSelect
                                    // isMulti
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={listBank}
                                    // allowSelectAll={true}
                                    value={isSettlementVA === 100 ? selectedBankSenderVA : selectedBankSenderEMoney}
                                    onChange={(selected) => isSettlementVA === 100 ? setSelectedBankSenderVA([selected]) : setSelectedBankSenderEMoney([selected])}
                                    placeholder="Pilih Nama Bank"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Account Pengirim<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    onChange={(e) => setInputHandle({ ...inputHandle, accountPengirimVA: isSettlementVA === 100 ? e.target.value : "", accountPengirimEMoney: isSettlementVA === 100 ? "" : e.target.value })}
                                    value={isSettlementVA === 100 ? inputHandle.accountPengirimVA : inputHandle.accountPengirimEMoney}
                                    name="accountPengirimVA"
                                    type='number'
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                    placeholder='Masukkan Akun Pengirim'
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Account Name Pengirim<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    onChange={(e) => setInputHandle({ ...inputHandle, accountNamePengirimVA: isSettlementVA === 100 ? e.target.value : "", accountNamePengirimEMoney: isSettlementVA === 100 ? "" : e.target.value })}
                                    value={isSettlementVA === 100 ? inputHandle.accountNamePengirimVA : inputHandle.accountNamePengirimEMoney}
                                    name="accountNamePengirimVA"
                                    type='text'
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                    placeholder='Masukkan Akun Nama Pengirim'
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Bank Penerima<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9} style={{ width: "71.3%", marginLeft: 9 }}>
                                <ReactSelect
                                    // isMulti
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={listBank}
                                    // allowSelectAll={true}
                                    value={isSettlementVA === 100 ? selectedBankRecieverVA : selectedBankRecieverEMoney}
                                    onChange={(selected) => isSettlementVA === 100 ? setSelectedBankRecieverVA([selected]) : setSelectedBankRecieverEMoney([selected])}
                                    placeholder="Pilih Nama Bank"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Account Penerima<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    onChange={(e) => setInputHandle({ ...inputHandle, accountPenerimaVA: isSettlementVA === 100 ? e.target.value : "", accountPenerimaEMoney: isSettlementVA === 100 ? "" : e.target.value })}
                                    value={isSettlementVA === 100 ? inputHandle.accountPenerimaVA : inputHandle.accountPenerimaEMoney}
                                    name="accountPenerimaVA"
                                    type='number'
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                    placeholder='Masukkan Akun Penerima'
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Account Name Penerima<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    onChange={(e) => setInputHandle({ ...inputHandle, accountNamePenerimaVA: isSettlementVA === 100 ? e.target.value : "", accountNamePenerimaEMoney: isSettlementVA === 100 ? "" : e.target.value })}
                                    value={isSettlementVA === 100 ? inputHandle.accountNamePenerimaVA : inputHandle.accountNamePenerimaEMoney}
                                    name="accountNamePenerimaVA"
                                    type='text'
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                    placeholder='Masukkan Akun Nama Penerima'
                                />
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col xs={3}>
                                <span>Refference No.<span style={{ color: "red" }}>*</span></span>
                            </Col>
                            <Col xs={9}>
                                <input
                                    onChange={(e) => setInputHandle({ ...inputHandle, reffNoVA: isSettlementVA === 100 ? e.target.value : "", reffNoEMoney: isSettlementVA === 100 ? "" : e.target.value })}
                                    value={isSettlementVA === 100 ? inputHandle.reffNoVA : inputHandle.reffNoEMoney}
                                    name="reffNoVA"
                                    type='text'
                                    style={{ width: "95%", borderRadius: 5 }}
                                    className='input-text-riwayat ms-2'
                                    placeholder='Masukkan Nomor Refference'
                                />
                            </Col>
                        </Row>
                        <div className='mt-3' style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            <button
                                onClick={() => {
                                    isSettlementVA === 100 ?
                                    settlementManualVAOrEMoney(isSettlementVA, selectedPartnerSettlementVA, dateRangeSettlementVA, inputHandle.currencyVA, inputHandle.amountVA, inputHandle.feeVA, Number(selectedBankSenderVA[0].value), inputHandle.accountPengirimVA, inputHandle.accountNamePengirimVA, Number(selectedBankRecieverVA[0].value), inputHandle.accountPenerimaVA, inputHandle.accountNamePenerimaVA, inputHandle.reffNoVA) :
                                    settlementManualVAOrEMoney(isSettlementVA, selectedPartnerSettlementEMoney, dateRangeSettlementEMoney, inputHandle.currencyEMoney, inputHandle.amountEMoney, inputHandle.feeEMoney, Number(selectedBankSenderEMoney[0].value), inputHandle.accountPengirimEMoney, inputHandle.accountNamePengirimEMoney, Number(selectedBankRecieverEMoney[0].value), inputHandle.accountPenerimaEMoney, inputHandle.accountNamePenerimaEMoney, inputHandle.reffNoEMoney)
                                }}
                                className={
                                    (isSettlementVA === 100 ?
                                        (selectedPartnerSettlementVA.length !== 0 && dateRangeSettlementVA.length !== 0 && inputHandle.currencyVA.length !== 0 && inputHandle.amountVA !== 0 && selectedBankSenderVA.length !== 0 && inputHandle.accountPengirimVA.length !== 0 && inputHandle.accountNamePengirimVA.length !== 0 && selectedBankRecieverVA.length !== 0 && inputHandle.accountPenerimaVA.length !== 0 && inputHandle.accountNamePenerimaVA.length !== 0 && inputHandle.reffNoVA.length !== 0) :
                                        (selectedPartnerSettlementEMoney.length !== 0 && dateRangeSettlementEMoney.length !== 0 && inputHandle.currencyEMoney.length !== 0 && inputHandle.amountEMoney !== 0 && selectedBankSenderEMoney.length !== 0 && inputHandle.accountPengirimEMoney.length !== 0 && inputHandle.accountNamePengirimEMoney.length !== 0 && selectedBankRecieverEMoney.length !== 0 && inputHandle.accountPenerimaEMoney.length !== 0 && inputHandle.accountNamePenerimaEMoney.length !== 0 && inputHandle.reffNoEMoney.length !== 0)
                                    ) ? 'add-button mb-3' : 'btn-off mb-3'}
                                style={{ maxWidth: 'fit-content' }}
                                disabled={(
                                    isSettlementVA === 100 ?
                                    (selectedPartnerSettlementVA.length === 0 || dateRangeSettlementVA.length === 0 || inputHandle.currencyVA.length === 0 || inputHandle.amountVA === 0 || selectedBankSenderVA.length === 0 || inputHandle.accountPengirimVA.length === 0 || inputHandle.accountNamePengirimVA.length === 0 || selectedBankRecieverVA.length === 0 || inputHandle.accountPenerimaVA.length === 0 || inputHandle.accountNamePenerimaVA.length === 0 || inputHandle.reffNoVA.length === 0) :
                                    (selectedPartnerSettlementEMoney.length === 0 || dateRangeSettlementEMoney.length === 0 || inputHandle.currencyEMoney.length === 0 || inputHandle.amountEMoney === 0 || selectedBankSenderEMoney.length === 0 || inputHandle.accountPengirimEMoney.length === 0 || inputHandle.accountNamePengirimEMoney.length === 0 || selectedBankRecieverEMoney.length === 0 || inputHandle.accountPenerimaEMoney.length === 0 || inputHandle.accountNamePenerimaEMoney.length === 0 || inputHandle.reffNoEMoney.length === 0)
                                )}
                            >
                                Settlement Manual
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

export default SettlementManual