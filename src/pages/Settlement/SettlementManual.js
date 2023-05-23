import React, { useState, useEffect } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { Link, useHistory } from 'react-router-dom'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect, { components } from 'react-select';
import axios from 'axios'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import DataTable, { defaultThemes } from 'react-data-table-component';
import encryptData from '../../function/encryptData'
import { DateRangePicker } from 'rsuite'
import "rsuite/dist/rsuite.css";
import triangleInfo from "../../assets/icon/triangle-info.svg"

function SettlementManual() {

    const user_role = getRole()
    const history = useHistory()
    const [isSettlementVA, setisSettlementVA] = useState(true)
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataListVA, setDataListVA] = useState([])
    const [dataListEMoney, setDataListEMoney] = useState([])
    const [selectedPartnerSettlementVA, setSelectedPartnerSettlementVA] = useState([])
    const [selectedPartnerSettlementEMoney, setSelectedPartnerSettlementEMoney] = useState([])
    const [stateSettlementVA, setStateSettlementVA] = useState(null)
    const [stateSettlementEMoney, setStateSettlementEMoney] = useState(null)
    const [dateRangeSettlementVA, setDateRangeSettlementVA] = useState([])
    const [dateRangeSettlementEMoney, setDateRangeSettlementEMoney] = useState([])
    const [pendingSettlementVA, setPendingSettlementVA] = useState(false)
    const [pendingSettlementEMoney, setPendingSettlementEMoney] = useState(false)
    const [totalSettlementVA, setTotalSettlementVA] = useState([])
    const [totalSettlementEMoney, setTotalSettlementEMoney] = useState([])
    console.log(dataListVA, 'dataListVA');

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

    function resetButtonHandle(param) {
        if (param === "VA") {
            setSelectedPartnerSettlementVA([])
            setStateSettlementVA(null)
        } else {
            setSelectedPartnerSettlementEMoney([])
            setStateSettlementEMoney(null)
        }
    }

    // function pickDateRiwayatTransfer(item) {
    //     setStateRiwayatTransfer(item)
    //     if (item !== null) {
    //         item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
    //         setDateRangeRiwayatTranfer(item)
    //     }
    // }

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

    // function handleChangePeriodeSettlement(e, tabs) {
    //     if (tabs === "VA") {
    //         if (e.target.value === "7") {
    //             setPeriodeSettlementVA(e.target.value)
    //         } else {
    //             setPeriodeSettlementVA(e.target.value)
    //         }
    //     } else {
    //         if (e.target.value === "7") {
    //             setPeriodeSettlementEMoney(e.target.value)
    //         } else {
    //             setPeriodeSettlementEMoney(e.target.value)
    //         }
    //     }
    // }

    function handleChangeNamaPartner(e, jenisTransaksi) {
        if (jenisTransaksi === 'Virtual Account') {
            setSelectedPartnerSettlementVA([e])
        } else {
            setSelectedPartnerSettlementEMoney([e])
        }
    }

    function pindahHalaman (param) {
        if (param === "VA") {
            settlementManualTabs(true)
        } else {
            settlementManualTabs(false)
        }
    }

    function settlementManualTabs(isTabs){
        setisSettlementVA(isTabs)
        if(!isTabs){
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
            console.log(dataVAList, 'dataVAList');
            if (dataVAList.data.response_code === 200 && dataVAList.status === 200 && dataVAList.data.response_new_token === null) {
                let totalTrxSettlementVA = 0
                dataVAList.data.response_data.results = dataVAList.data.response_data.results.map((obj, id) => (totalTrxSettlementVA += obj.tvatrans_amount, { ...obj, number: id + 1 }));
                setTotalSettlementVA(totalTrxSettlementVA)
                setDataListVA(dataVAList.data.response_data.results)
                setPendingSettlementVA(false)
            } else if (dataVAList.data.response_code === 200 && dataVAList.status === 200 && dataVAList.data.response_new_token !== null) {
                setUserSession(dataVAList.data.response_new_token)
                let totalTrxSettlementVA = 0
                dataVAList.data.response_data.results = dataVAList.data.response_data.results.map((obj, id) => (totalTrxSettlementVA += obj.tvatrans_amount, { ...obj, number: id + 1 }));
                setTotalSettlementVA(totalTrxSettlementVA)
                setDataListVA(dataVAList.data.response_data.results)
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
            console.log(dataEmoneyList, 'dataEmoneyList');
            if (dataEmoneyList.data.response_code === 200 && dataEmoneyList.status === 200 && dataEmoneyList.data.response_new_token === null) {
                let totalTrxSettlementEMoney = 0
                dataEmoneyList.data.response_data.results = dataEmoneyList.data.response_data.results.map((obj, id) => (totalTrxSettlementEMoney += Number(obj.totalAmount), { ...obj, number: id + 1 }));
                console.log(totalTrxSettlementEMoney, 'totalTrxSettlementEMoney');
                setTotalSettlementEMoney(totalTrxSettlementEMoney)
                setDataListEMoney(dataEmoneyList.data.response_data.results)
                setPendingSettlementEMoney(false)
            } else if (dataEmoneyList.data.response_code === 200 && dataEmoneyList.status === 200 && dataEmoneyList.data.response_new_token !== null) {
                setUserSession(dataEmoneyList.data.response_new_token)
                let totalTrxSettlementEMoney = 0
                dataEmoneyList.data.response_data.results = dataEmoneyList.data.response_data.results.map((obj, id) => (totalTrxSettlementEMoney += Number(obj.totalAmount), { ...obj, number: id + 1 }));
                setTotalSettlementEMoney(totalTrxSettlementEMoney)
                setDataListEMoney(dataEmoneyList.data.response_data.results)
                setPendingSettlementEMoney(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        listPartner()
        // getVAList()
        // getEMoneyList()
    }, [])
    
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
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            wrap: true,
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.mfitur_desc,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tvatrans_amount),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.total_trx,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.tvatrans_partner_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.tvatrans_fee_tax),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.tvatrans_bank_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Settlement',
            selector: row => convertToRupiah(row.tvasettl_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
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
            width: "150px",
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
            name: 'Nominal Settlement',
            selector: row => row.amount,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.totalAmount,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => row.ewalletFee,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => row.feeTax,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => row.total_fee_bank,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Settlement',
            selector: row => convertToRupiah(row.tvasettl_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          {/* <div>Loading...</div> */}
        </div>
    );

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
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
                    <div className='base-content mt-3 py-5'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        {
                            isSettlementVA ?
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
                                                    disabled={selectedPartnerSettlementVA.length === 0 && dateRangeSettlementVA.length === 0}
                                                >
                                                    Terapkan
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => resetButtonHandle("VA")}
                                                    className={selectedPartnerSettlementVA.length !== 0 && dateRangeSettlementVA.length !== 0 ? "btn-reset" : "btn-ez-reset"}
                                                    disabled={selectedPartnerSettlementVA.length === 0 && dateRangeSettlementVA.length === 0}
                                                >
                                                    Atur Ulang
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className='settlement-amount mt-4'>
                                    <div className="card-information mt-3" style={{border: '1px solid #EBEBEB'}}>
                                        <p className="p-info">Total Settlement Virtual Account</p>
                                        <p className="p-amount">{convertToRupiah(totalSettlementVA)}</p>
                                    </div>
                                </div>
                                <div className="div-table mt-4 pb-4">
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
                                        // onClick={SaveAsPDFHandler}
                                        // onClick={() => toPreviewInvoice(inputHandle)}
                                        className='add-button mb-3'
                                        style={{ maxWidth: 'fit-content' }}
                                        // disabled={Object.keys(dataInvoice).length === 0}
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
                                                    disabled={selectedPartnerSettlementEMoney.length === 0 && dateRangeSettlementEMoney.length === 0}
                                                >
                                                    Terapkan
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => resetButtonHandle("eMoney")}
                                                    className={selectedPartnerSettlementEMoney.length !== 0 && dateRangeSettlementEMoney.length !== 0 ? "btn-reset" : "btn-ez-reset"}
                                                    disabled={selectedPartnerSettlementEMoney.length === 0 && dateRangeSettlementEMoney.length === 0}
                                                >
                                                    Atur Ulang
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className='settlement-amount mt-4'>
                                    <div className="card-information mt-3" style={{border: '1px solid #EBEBEB'}}>
                                        <p className="p-info">Total Settlement eMoney</p>
                                        <p className="p-amount">{convertToRupiah(totalSettlementEMoney)}</p>
                                    </div>
                                </div>
                                <div className="div-table mt-4 pb-4">
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
                                        // onClick={SaveAsPDFHandler}
                                        // onClick={() => toPreviewInvoice(inputHandle)}
                                        className='add-button mb-3'
                                        style={{ maxWidth: 'fit-content' }}
                                        // disabled={Object.keys(dataInvoice).length === 0}
                                    >
                                        Settlement
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettlementManual