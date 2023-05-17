import React, { useState, useEffect } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { Link, useHistory } from 'react-router-dom'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect, { components } from 'react-select';
import axios from 'axios'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import DataTable, { defaultThemes } from 'react-data-table-component';

function SettlementManual() {

    const user_role = getRole()
    const history = useHistory()
    const [isSettlementVA, setisSettlementVA] = useState(true)
    const [dataListPartner, setDataListPartner] = useState([])
    const [selectedPartnerSettlementVA, setSelectedPartnerSettlementVA] = useState([])
    const [selectedPartnerSettlementEMoney, setSelectedPartnerSettlementEMoney] = useState([])
    const [showDateSettlementVA, setShowDateSettlementVA] = useState("none")
    const [showDateSettlementEMoney, setShowDateSettlementEMoney] = useState("none")
    const [periodeSettlementVA, setPeriodeSettlementVA] = useState(0)
    const [periodeSettlementEMoney, setPeriodeSettlementEMoney] = useState(0)
    const [stateSettlementVA, setStateSettlementVA] = useState(null)
    const [stateSettlementEMoney, setStateSettlementEMoney] = useState(null)
    const [dateRangeSettlementVA, setDateRangeSettlementVA] = useState([])
    const [dateRangeSettlementEMoney, setDateRangeSettlementEMoney] = useState([])
    const [pendingSettlementVA, setPendingSettlementVA] = useState(true)
    const [pendingSettlementEMoney, setPendingSettlementEMoney] = useState(true)
    const [totalSettlementVA, setTotalSettlementVA] = useState([])
    const [totalSettlementEMoney, setTotalSettlementEMoney] = useState([])
    
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
            setPeriodeSettlementVA(0)
            setSelectedPartnerSettlementVA([])
            setShowDateSettlementVA("none")
            setStateSettlementVA(null)
        } else {
            setPeriodeSettlementEMoney(0)
            setSelectedPartnerSettlementEMoney([])
            setShowDateSettlementEMoney("none")
            setStateSettlementEMoney(null)
        }
    }

    function pickDateSettlement(item, tabs) {
        if (tabs === "VA") {
            setStateSettlementVA(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('en-CA'))
                setDateRangeSettlementVA(item)
            }
        } else {
            setStateSettlementEMoney(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('en-CA'))
                setDateRangeSettlementEMoney(item)
            }
        }
    }

    function handleChangePeriodeSettlement(e, tabs) {
        if (tabs === "VA") {
            if (e.target.value === "7") {
                setShowDateSettlementVA("")
                setPeriodeSettlementVA(e.target.value)
            } else {
                setShowDateSettlementVA("none")
                setPeriodeSettlementVA(e.target.value)
            }
        } else {
            if (e.target.value === "7") {
                setShowDateSettlementEMoney("")
                setPeriodeSettlementEMoney(e.target.value)
            } else {
                setShowDateSettlementEMoney("none")
                setPeriodeSettlementEMoney(e.target.value)
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

    useEffect(() => {
        listPartner()
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
            selector: row => row.tvasettl_code,
            // sortable: true
            width: "224px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}`} >{row.tvasettl_code}</Link>
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
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
            selector: row => convertToRupiah(row.tvasettl_amount),
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
            selector: row => convertToRupiah(row.total_partner_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.total_fee_tax),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.total_fee_bank),
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
    
    const columnsSettlEMoney = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvasettl_code,
            // sortable: true
            width: "224px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}`} >{row.tvasettl_code}</Link>
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
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
            selector: row => convertToRupiah(row.tvasettl_amount),
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
            selector: row => convertToRupiah(row.total_partner_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.total_fee_tax),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.total_fee_bank),
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
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className='me-3'>Nama Partner</span>
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
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlementVA === "none") ? "33.2%" : "33.2%" }}>
                                        <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                        <Form.Select name='periodeSettlementVA' className="input-text-riwayat ms-3" value={periodeSettlementVA} onChange={(e) => handleChangePeriodeSettlement(e, "VA")}>
                                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                                            <option value={2}>Hari Ini</option>
                                            <option value={3}>Kemarin</option>
                                            <option value={4}>7 Hari Terakhir</option>
                                            <option value={5}>Bulan Ini</option>
                                            <option value={6}>Bulan Kemarin</option>
                                            <option value={7}>Pilih Range Tanggal</option>
                                        </Form.Select>                            
                                    </Col>
                                    <Col xs={4} style={{ display: showDateSettlementVA }} className='text-end'>
                                        <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                            <DateRangePicker 
                                                onChange={(e) => pickDateSettlement(e, "VA")}
                                                value={stateSettlementVA}
                                                clearIcon={null}
                                                // calendarIcon={null}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={5}>
                                        <Row>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    className="btn-ez-on"
                                                    // onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")}
                                                    // className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-ez-on" : "btn-ez"}
                                                    // disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                                >
                                                    Terapkan
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    className="btn-reset"
                                                    onClick={() => resetButtonHandle("VA")}
                                                    // className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-reset" : "btn-ez-reset"}
                                                    // disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
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
                                        data={"dataRiwayatSettlement"}
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
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className='me-3'>Nama Partner emoney</span>
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
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlementEMoney === "none") ? "33.2%" : "33.2%" }}>
                                        <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                        <Form.Select name='periodeSettlementEMoney' className="input-text-riwayat ms-3" value={periodeSettlementEMoney} onChange={(e) => handleChangePeriodeSettlement(e, "eMoney")}>
                                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                                            <option value={2}>Hari Ini</option>
                                            <option value={3}>Kemarin</option>
                                            <option value={4}>7 Hari Terakhir</option>
                                            <option value={5}>Bulan Ini</option>
                                            <option value={6}>Bulan Kemarin</option>
                                            <option value={7}>Pilih Range Tanggal</option>
                                        </Form.Select>                            
                                    </Col>
                                    <Col xs={4} style={{ display: showDateSettlementEMoney }} className='text-end'>
                                        <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                            <DateRangePicker 
                                                onChange={(e) => pickDateSettlement(e, "eMoney")}
                                                value={stateSettlementEMoney}
                                                clearIcon={null}
                                                // calendarIcon={null}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={5}>
                                        <Row>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    className="btn-ez-on"
                                                    // onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")}
                                                    // className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-ez-on" : "btn-ez"}
                                                    // disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                                >
                                                    Terapkan
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                                <button
                                                    className="btn-reset"
                                                    onClick={() => resetButtonHandle("eMoney")}
                                                    // className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-reset" : "btn-ez-reset"}
                                                    // disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
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
                                        data={"dataRiwayatSettlement"}
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