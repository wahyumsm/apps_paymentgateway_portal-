import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect from 'react-select'
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { agenLists } from '../../data/tables'
import { BaseURL, currentDate, errorCatch, firstDayLastMonth, firstDayThisMonth, getToken, lastDayLastMonth, lastDayThisMonth, setUserSession, sevenDaysAgo, yesterdayDate } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'

const RiwayatInvoice = () => {
    const history = useHistory()
    const [showModalDetailInvoice, setShowModalDetailInvoice] = useState(false)
    const [stateRiwayatInvoice, setStateRiwayatInvoice] = useState(null)
    const [dateRangeRiwayatInvoice, setDateRangeRiwayatInvoice] = useState([])
    const [showDateRiwayatInvoice, setShowDateRiwayatInvoice] = useState("none")
    const [inputHandleRiwayatInvoice, setInputHandleRiwayatInvoice] = useState({
        periode: 0,
        partnerId: "",
        invType: 0,
        fiturId: 0
    })
    const [dataRiwayatInvoice, setDataRiwayatInvoice] = useState([])

    function handleChangePeriodeRiwayatInvoice(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatInvoice("")
            setInputHandleRiwayatInvoice({
                ...inputHandleRiwayatInvoice,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatInvoice("none")
            setStateRiwayatInvoice(null)
            setDateRangeRiwayatInvoice([])
            setInputHandleRiwayatInvoice({
                ...inputHandleRiwayatInvoice,
                [e.target.name] : e.target.value.split(",")
            })
        }
    }

    function handleChange (e) {
        setInputHandleRiwayatInvoice({
            ...inputHandleRiwayatInvoice,
            [e.target.name] : e.target.value
        })
    }

    async function getDataRiwayatInvoiceHandler(currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id": "", "inv_type" : 0, "fitur_id" : 0, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataRiwayatInv = await axios.post(BaseURL + "/Settlement/ReSendEmailSettlement", { data: dataParams }, { headers: headers })
            // console.log(dataRiwayatInv.data.response_data.results, "data settlement");
            if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token === null) {

            } else if (dataRiwayatInv.status === 200 && dataRiwayatInv.data.response_code === 200 && dataRiwayatInv.data.response_new_token !== null) {
                setUserSession(dataRiwayatInv.data.response_new_token)

            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'No Invoice',
            selector: row => row.IDAgen,
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={() => setShowModalDetailInvoice(true)} >{row.IDAgen}</Link>
        },
        {
            name: 'Waktu',
            selector: row => row.noHp,
        },
        {
            name: 'Nama Partner',
            selector: row => row.namaAgen
        },
        {
            name: 'Tipe Invoice',
            selector: row => row.status
        },
    ];
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
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Invoice</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Riwayat Invoice</h2>
            </div>
            <div className='base-content mt-4'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                <Row className=''>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3">
                        <span >Nama Partner</span>
                        <div className="dropdown dropLaporanPartner" >
                            <ReactSelect
                                closeMenuOnSelect={true}
                                hideSelectedOptions={false}
                                // options={dataListPartner}
                                // value={selectedPartnerDanaMasukAdmin}
                                // onChange={(selected) => handleChangeNamaPartner(selected, 'danaMasuk')}
                                placeholder="Pilih Nama Partner"
                                components={{ Option }}
                                // styles={customStylesSelectedOption}
                            />
                        </div>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3" >
                        <span >Periode <span style={{ color: "red" }}>*</span></span>
                        <Form.Select name='periode' className="input-text-riwayat ms-3" value={inputHandleRiwayatInvoice.periode} onChange={(e) => handleChangePeriodeRiwayatInvoice(e)}>
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                            <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>Kemarin</option>
                            <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>7 Hari Terakhir</option>
                            <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                            <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3">
                        <span>Fitur</span>
                        <Form.Select name='fiturId' value={inputHandleRiwayatInvoice.fiturId} onChange={(e) => handleChange(e)} className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Fitur</option>
                            <option value={100}>Setllement</option>
                            <option value={102}>Disbursement</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-3">
                        <span>Tipe Invoice</span>
                        <Form.Select name='invType' value={inputHandleRiwayatInvoice.invType} onChange={(e) => handleChange(e)} className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Tipe Invoice</option>
                            <option value={100}>Bank</option>
                            <option value={101}>E-Wallet</option>
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
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columnsAdmin}
                        data={agenLists}
                        customStyles={customStylesDanaMasuk}
                        highlightOnHover
                        // progressPending={pendingTransferAdmin}
                        progressComponent={<CustomLoader />}
                        // pagination
                    />
                </div>
            </div>
        </div>
    )
}

export default RiwayatInvoice