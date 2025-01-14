import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Link, useHistory } from 'react-router-dom'
import { Button, Col, Container, Form, Modal, Row } from '@themesberg/react-bootstrap';
import ReactSelect, { components } from 'react-select';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable, { defaultThemes } from 'react-data-table-component';
import Pagination from 'react-js-pagination';
import { BaseURL, convertSimpleTimeStamp, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession, CustomLoader } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import * as XLSX from "xlsx"
import { eng, ind } from '../../components/Language';

function RiwayatBalance() {
    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [dataRiwayatBalance, setDataRiwayatBalance] = useState([])
    const [pageNumberRiwayatBalance, setPageNumberRiwayatBalance] = useState({})
    const [totalPageRiwayatBalance, setTotalPageRiwayatBalance] = useState(0)
    const [pendingRiwayatBalance, setPendingRiwayatBalance] = useState(false)
    const [activePageRiwayatBalance, setActivePageRiwayatBalance] = useState(1)
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataListAgenFromPartner, setDataListAgenFromPartner] = useState([])
    const [selectedPartnerRiwayatBalance, setSelectedPartnerRiwayatBalance] = useState([])
    const [selectedAgenRiwayatBalance, setSelectedAgenRiwayatBalance] = useState([])
    const [showDateRiwayatBalance, setShowDateRiwayatBalance] = useState('none')
    const [stateRiwayatBalance, setStateRiwayatBalance] = useState(null)
    const [dateRangeRiwayatBalance, setDateRangeRiwayatBalance] = useState([])
    const [inputHandle, setInputHandle] = useState({
        typeRiwayatBalance: '',
        periodeRiwayatBalance: 0,
    })

    function handlePageChangeRiwayatBalance(page) {
        filterRiwayatBalance(page, selectedPartnerRiwayatBalance.length !== 0 ? selectedPartnerRiwayatBalance[0].value : "", selectedAgenRiwayatBalance.length !== 0 ? selectedAgenRiwayatBalance[0].value : "", inputHandle.typeRiwayatBalance, inputHandle.periodeRiwayatBalance, dateRangeRiwayatBalance, false, user_role)
    }

    function resetButtonRiwayatBalance() {
        setInputHandle({
            ...inputHandle,
            typeRiwayatBalance: '',
            periodeRiwayatBalance: 0,
        })
        setSelectedPartnerRiwayatBalance([])
        setSelectedAgenRiwayatBalance([])
        setDataListAgenFromPartner([])
        setStateRiwayatBalance(null)
        setDateRangeRiwayatBalance([])
        setShowDateRiwayatBalance("none")
    }

    function pickDateRiwayatBalance(item) {
        setStateRiwayatBalance(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeRiwayatBalance(item)
        }
    }

    function handleChangePeriodeRiwayatBalance(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatBalance("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatBalance("none")
            setDateRangeRiwayatBalance([])
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function handleChangeNamaPartner(selected) {
        setSelectedAgenRiwayatBalance([])
        getListAgenFromPartner(selected.value)
        setSelectedPartnerRiwayatBalance([selected])
    }

    async function getListAgenFromPartner(pertnerId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "${pertnerId}"}`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listAgenFromPartner = await axios.post(BaseURL + "/Partner/GetListAgen", {data: dataParams}, {headers: headers})
            if (listAgenFromPartner.status === 200 && listAgenFromPartner.data.response_code === 200 && listAgenFromPartner.data.response_new_token.length === 0) {
                let newArr = []
                listAgenFromPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.agen_id
                    obj.label = e.agen_name
                    newArr.push(obj)
                })
                setDataListAgenFromPartner(newArr)
            } else if (listAgenFromPartner.status === 200 && listAgenFromPartner.data.response_code === 200 && listAgenFromPartner.data.response_new_token.length !== 0) {
                setUserSession(listAgenFromPartner.data.response_new_token)
                let newArr = []
                listAgenFromPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.agen_id
                    obj.label = e.agen_name
                    newArr.push(obj)
                })
                setDataListAgenFromPartner(newArr)
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

    async function filterRiwayatBalance(page, partnerId, agenId, typeBalance, dateId, dateRange, isExport, userRole) {
        try {
            !isExport && setActivePageRiwayatBalance(page)
            !isExport && setPendingRiwayatBalance(true)
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"partner_id": "${partnerId}", "subpartner_id": "${agenId.length !== 0 ? agenId : ""}", "type": "${typeBalance.length !== 0 ? typeBalance : ""}", "dateID": ${dateId}, "date_from": "${dateRange.length !== 0 ? dateRange[0] : ""}", "date_to": "${dateRange.length !== 0 ? dateRange[1] : ""}", "page": ${page}, "row_per_page": ${isExport ? 1000000 : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const filteredRiwayatBalance = await axios.post(BaseURL + "/Report/PartnerBalance", {data: dataParams}, {headers: headers})
            // console.log(filteredRiwayatBalance, 'filteredRiwayatBalance');
            if (filteredRiwayatBalance.status === 200 && filteredRiwayatBalance.data.response_code === 200 && filteredRiwayatBalance.data.response_new_token.length === 0) {
                if (isExport) {
                    const data = filteredRiwayatBalance.data.response_data.results
                    let dataExcel = []
                    for (let i = 0; i < data.length; i++) {
                        if (userRole !== '102') {
                            dataExcel.push({ No: i + 1, "ID Partner": data[i].partner_id, "Nama Partner": data[i].subpartner_name, Waktu: convertSimpleTimeStamp(data[i].created_date), "Tipe Balance": data[i].type, "Balance Before": data[i].bal_before, Nominal: data[i].amount, "Balance After": data[i].bal_after, Deskripsi: data[i].description})
                        } else {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.waktu : language.waktu]: convertSimpleTimeStamp(data[i].created_date), [language === null ? eng.tipeSaldo : language.tipeSaldo]: data[i].type, [language === null ? eng.saldoSebelum : language.saldoSebelum]: data[i].bal_before, [language === null ? eng.nominal : language.nominal]: data[i].amount, [language === null ? eng.saldoSesudah : language.saldoSesudah]: data[i].bal_after, [language === null ? eng.deskripsi : language.deskripsi]: data[i].description})
                        }
                    }
                    let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                    let workBook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                    XLSX.writeFile(workBook, `${user_role !== "102" ? "Riwayat Saldo" : (language === null ? eng.riwayatSaldoFileExcel : language.riwayatSaldoFileExcel)}.xlsx`);
                } else {
                    filteredRiwayatBalance.data.response_data.results = filteredRiwayatBalance.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                    setPageNumberRiwayatBalance(filteredRiwayatBalance.data.response_data)
                    setTotalPageRiwayatBalance(filteredRiwayatBalance.data.response_data.max_page)
                    setDataRiwayatBalance(filteredRiwayatBalance.data.response_data.results)
                    setPendingRiwayatBalance(false)
                }
            } else if (filteredRiwayatBalance.status === 200 && filteredRiwayatBalance.data.response_code === 200 && filteredRiwayatBalance.data.response_new_token.length !== 0) {
                setUserSession(filteredRiwayatBalance.data.response_new_token)
                if (isExport) {
                    const data = filteredRiwayatBalance.data.response_data.results
                    let dataExcel = []
                    for (let i = 0; i < data.length; i++) {
                        if (userRole !== '102') {
                            dataExcel.push({ No: i + 1, "ID Partner": data[i].partner_id, "Nama Partner": data[i].subpartner_name, Waktu: convertSimpleTimeStamp(data[i].created_date), "Tipe Balance": data[i].type, "Balance Before": data[i].bal_before, Nominal: data[i].amount, "Balance After": data[i].bal_after, Deskripsi: data[i].description})
                        } else {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.waktu : language.waktu]: convertSimpleTimeStamp(data[i].created_date), [language === null ? eng.tipeSaldo : language.tipeSaldo]: data[i].type, [language === null ? eng.saldoSebelum : language.saldoSebelum]: data[i].bal_before, [language === null ? eng.nominal : language.nominal]: data[i].amount, [language === null ? eng.saldoSesudah : language.saldoSesudah]: data[i].bal_after, [language === null ? eng.deskripsi : language.deskripsi]: data[i].description})
                        }
                    }
                    let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                    let workBook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                    XLSX.writeFile(workBook, `${user_role !== "102" ? "Riwayat Saldo" : (language === null ? eng.riwayatSaldoFileExcel : language.riwayatSaldoFileExcel)}.xlsx`);
                } else {
                    filteredRiwayatBalance.data.response_data.results = filteredRiwayatBalance.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                    setPageNumberRiwayatBalance(filteredRiwayatBalance.data.response_data)
                    setTotalPageRiwayatBalance(filteredRiwayatBalance.data.response_data.max_page)
                    setDataRiwayatBalance(filteredRiwayatBalance.data.response_data.results)
                    setPendingRiwayatBalance(false)
                }
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (user_role !== "102") {
            listPartner()
        }
    }, [])

    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Partner',
            selector: row => row.partner_id,
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.subpartner_name,
            width: "150px",
            wrap: true,
        },
        {
            name: 'Waktu',
            selector: row => convertSimpleTimeStamp(row.created_date),
            wrap: true,
        },
        {
            name: 'Tipe Balance',
            selector: row => row.type === "DB" ? "Debit" : "Kredit",
            wrap: true,
            width: "170px",
        },
        {
            name: 'Balance Before',
            selector: row => convertToRupiah(row.bal_before, true),
            wrap: true,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Nominal',
            selector: row => convertToRupiah(row.amount, true),
            wrap: true,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Balance After',
            selector: row => convertToRupiah(row.bal_after, true),
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Deskripsi',
            selector: row => row.description,
            wrap: true,
            width: "175px"
        },
    ]

    const columnsPartner = [
        {
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px",
            wrap: true,
        },
        {
            name: language === null ? eng.waktu : language.waktu,
            selector: row => convertSimpleTimeStamp(row.created_date),
            wrap: true,
            // width: "150px"
        },
        {
            name: language === null ? eng.tipeSaldo : language.tipeSaldo,
            selector: row => row.type === "DB" ? (language === null ? eng.debit : language.debit) : (language === null ? eng.kredit : language.kredit),
            wrap: true,
            // width: "150px",
        },
        {
            name: language === null ? eng.saldoSebelum : language.saldoSebelum,
            selector: row => convertToRupiah(row.bal_before, true),
            wrap: true,
            // width: "145px",
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: language === null ? eng.nominal : language.nominal,
            selector: row => convertToRupiah(row.amount, true),
            wrap: true,
            width: "100px",
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: language === null ? eng.saldoSesudah : language.saldoSesudah,
            selector: row => convertToRupiah(row.bal_after, true),
            // width: "145px",
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: language === null ? eng.deskripsi : language.deskripsi,
            selector: row => row.description,
            wrap: true,
        },
    ]

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

    const customStyles = {
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
            <span className='breadcrumbs-span'>{user_role !== '102' ? <Link to={"/"}>Beranda</Link> : <Link to={"#"}>{language === null ? eng.riwayatTransaksi : language.riwayatTransaksi}</Link>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{user_role !== "102" ? "Riwayat Saldo" : (language === null ? eng.riwayatSaldo : language.riwayatSaldo)}</span>
            <div className="head-title">
                <h2 className="h4 my-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{user_role !== "102" ? "Riwayat Saldo" : (language === null ? eng.riwayatSaldo : language.riwayatSaldo)}</h2>
            </div>
            {/* <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Riwayat Dana Masuk</h2> */}
            <div className='base-content mt-3'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>{user_role !== "102" ? "Filter" : (language === null ? eng.filter : language.filter)}</span>
                <Row className='mt-4'>
                    {
                        user_role !== '102' ?
                        <>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className='me-3'>Nama Partner<span style={{ color: "red" }}>*</span></span>
                                <div className="dropdown dropSaldoPartner">
                                    <ReactSelect
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={dataListPartner}
                                        value={selectedPartnerRiwayatBalance}
                                        onChange={handleChangeNamaPartner}
                                        placeholder="Pilih Nama Partner"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className="me-4">Nama Agen</span>
                                <div className="dropdown dropSaldoPartner">
                                    <ReactSelect
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={dataListAgenFromPartner}
                                        value={selectedAgenRiwayatBalance}
                                        onChange={(selected) => setSelectedAgenRiwayatBalance([selected])}
                                        placeholder="Pilih Nama Agen"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span style={{ marginRight: 41 }}>Type Balance</span>
                                <Form.Select name="typeRiwayatBalance" className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.typeRiwayatBalance} onChange={(e) => setInputHandle({ ...inputHandle, [e.target.name]: e.target.value })}>
                                    <option defaultChecked disabled value="">Pilih Type Balance</option>
                                    <option value={'CR'}>Kredit</option>
                                    <option value={'DB'}>Debit</option>
                                </Form.Select>
                            </Col>
                        </> :
                        <>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span style={{ marginRight: 41 }}>{language === null ? eng.tipeSaldo : language.tipeSaldo}</span>
                                <Form.Select name="typeRiwayatBalance" className='input-text-riwayat' style={{ display: "inline" }} value={inputHandle.typeRiwayatBalance} onChange={(e) => setInputHandle({ ...inputHandle, [e.target.name]: e.target.value })}>
                                    <option defaultChecked disabled value="">{language === null ? eng.placeholderTipeSaldo : language.placeholderTipeSaldo}</option>
                                    <option value={'CR'}>{language === null ? eng.kredit : language.kredit}</option>
                                    <option value={'DB'}>{language === null ? eng.debit : language.debit}</option>
                                </Form.Select>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateRiwayatBalance === "none") ? "33%" : "33%" }}>
                                <span style={{ marginRight: 40 }}>{language === null ? eng.periode : language.periode}<span style={{ color: "red" }}>*</span></span>
                                <Form.Select name='periodeRiwayatBalance' className="input-text-riwayat ms-3" value={inputHandle.periodeRiwayatBalance} onChange={(e) => handleChangePeriodeRiwayatBalance(e)}>
                                    <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                    <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                    <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                    <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                    <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                    <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                    <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                </Form.Select>
                            </Col>
                            <Col xs={4} style={{ display: showDateRiwayatBalance }} className='text-start'>
                                <DateRangePicker
                                    onChange={pickDateRiwayatBalance}
                                    value={stateRiwayatBalance}
                                    clearIcon={null}
                                />
                            </Col>
                        </>
                    }
                </Row>
                {
                    user_role !== '102' &&
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateRiwayatBalance === "none") ? "33%" : "33%" }}>
                            <span style={{ marginRight: 40 }}>Periode<span style={{ color: "red" }}>*</span></span>
                            <Form.Select name='periodeRiwayatBalance' className="input-text-riwayat ms-3" value={inputHandle.periodeRiwayatBalance} onChange={(e) => handleChangePeriodeRiwayatBalance(e)}>
                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                <option value={2}>Hari Ini</option>
                                <option value={3}>Kemarin</option>
                                <option value={4}>7 Hari Terakhir</option>
                                <option value={5}>Bulan Ini</option>
                                <option value={6}>Bulan Kemarin</option>
                                <option value={7}>Pilih Range Tanggal</option>
                            </Form.Select>
                        </Col>
                        <Col xs={4} style={{ display: showDateRiwayatBalance }} className='text-start'>
                            <DateRangePicker
                                onChange={pickDateRiwayatBalance}
                                value={stateRiwayatBalance}
                                clearIcon={null}
                            />
                        </Col>
                    </Row>
                }
                <Row className='mt-4'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    onClick={() => filterRiwayatBalance(1, selectedPartnerRiwayatBalance.length !== 0 ? selectedPartnerRiwayatBalance[0].value : "", selectedAgenRiwayatBalance.length !== 0 ? selectedAgenRiwayatBalance[0].value : "", inputHandle.typeRiwayatBalance, inputHandle.periodeRiwayatBalance, dateRangeRiwayatBalance, false, user_role)}
                                    className={
                                        user_role !== '102' ?
                                        (selectedPartnerRiwayatBalance.length === 0 || (inputHandle.periodeRiwayatBalance === 0 || Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0) ? "btn-ez" : "btn-ez-on") :
                                        (inputHandle.periodeRiwayatBalance === 0 || (Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0) ? "btn-ez" : "btn-ez-on")
                                    }
                                    disabled={
                                        user_role !== '102' ?
                                        (selectedPartnerRiwayatBalance.length === 0 || (inputHandle.periodeRiwayatBalance === 0 || Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0)) :
                                        (inputHandle.periodeRiwayatBalance === 0 || (Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0))
                                    }
                                >
                                    {user_role !== "102" ? "Terapkan" : (language === null ? eng.terapkan : language.terapkan)}
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    onClick={resetButtonRiwayatBalance}
                                    className={
                                        user_role !== '102' ?
                                        (selectedPartnerRiwayatBalance.length === 0 || (inputHandle.periodeRiwayatBalance === 0 || Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0) ? "btn-ez-reset" : "btn-reset") :
                                        (inputHandle.periodeRiwayatBalance === 0 || (Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0) ? "btn-ez-reset" : "btn-reset")
                                    }
                                    disabled={
                                        user_role !== '102' ?
                                        (selectedPartnerRiwayatBalance.length === 0 || (inputHandle.periodeRiwayatBalance === 0 || Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0)) :
                                        (inputHandle.periodeRiwayatBalance === 0 || (Number(inputHandle.periodeRiwayatBalance) === 7 && dateRangeRiwayatBalance.length == 0))
                                    }
                                >
                                    {user_role !== "102" ? "Atur Ulang" : (language === null ? eng.aturUlang : language.aturUlang)}
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    dataRiwayatBalance.length !== 0 &&
                    <div style={{ marginBottom: 30 }}>
                        <Link onClick={() => filterRiwayatBalance(1, selectedPartnerRiwayatBalance.length !== 0 ? selectedPartnerRiwayatBalance[0].value : "", selectedAgenRiwayatBalance.length !== 0 ? selectedAgenRiwayatBalance[0].value : "", inputHandle.typeRiwayatBalance, inputHandle.periodeRiwayatBalance, dateRangeRiwayatBalance, true, user_role)} className="export-span">{user_role !== "102" ? "Ekspor" : (language === null ? eng.export : language.export)}</Link>
                    </div>
                }
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={user_role !== "102" ? columns : columnsPartner}
                        data={dataRiwayatBalance}
                        customStyles={customStyles}
                        highlightOnHover
                        progressPending={pendingRiwayatBalance}
                        noDataComponent={user_role !== "102" ? "Tidak ada data" : (language === null ? eng.tidakAdaData : language.tidakAdaData)}
                        progressComponent={<CustomLoader />}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 24, borderTop: "groove" }}>
                <div style={{ marginRight: 10, marginTop: 10 }}>{user_role !== "102" ? "Total Halaman" : (language === null ? eng.totalHalaman : language.totalHalaman)} : {totalPageRiwayatBalance}</div>
                    <Pagination
                        activePage={activePageRiwayatBalance}
                        itemsCountPerPage={pageNumberRiwayatBalance.row_per_page}
                        totalItemsCount={(pageNumberRiwayatBalance.row_per_page*pageNumberRiwayatBalance.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeRiwayatBalance}
                    />
                </div>
            </div>
        </div>
    )
}

export default RiwayatBalance