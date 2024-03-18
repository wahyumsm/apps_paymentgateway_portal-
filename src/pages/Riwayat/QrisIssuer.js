import React, { useEffect, useState } from 'react'
import { BaseURL, CustomLoader, convertToRupiah, customFilter, errorCatch, getToken, setUserSession } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Row, Col } from '@themesberg/react-bootstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable, { defaultThemes } from 'react-data-table-component';
import Pagination from 'react-js-pagination';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData';
import ReactSelect, { components } from 'react-select';

function QrisIssuer() {

    const history = useHistory()
    const [dataTransactionReportQrisIssuer, setDataTransactionReportQrisIssuer] = useState([])
    const [pendingTransactionReportQrisIssuer, setPendingTransactionReportQrisIssuer] = useState(true)
    const [inputHandleTransactionReportQrisIssuerAdmin, setInputHandleTransactionReportQrisIssuerAdmin] = useState({
        idTransaksi: "",
        jenisTransaksi: "",
        namaPenerbit: "",
        periode: 0,
        statusEzee: "",
        statusRintis: "",
    })
    const [totalPageTransactionReportQrisIssuer, setTotalPageTransactionReportQrisIssuer] = useState(0)
    const [activePageTransactionReportQrisIssuer, setActivePageTransactionReportQrisIssuer] = useState(1)
    const [pageNumberTransactionReportQrisIssuer, setPageNumberTransactionReportQrisIssuer] = useState({})
    const [showDateTransactionReportQrisIssuer, setShowDateTransactionReportQrisIssuer] = useState("none")
    const [dateRangeTransactionReportQrisIssuer, setDateRangeTransactionReportQrisIssuer] = useState([])
    const [stateTransactionReportQrisIssuer, setStateTransactionReportQrisIssuer] = useState(null)
    const [isFilterTransactionReportQrisIssuer, setIsFilterTransactionReportQrisIssuer] = useState(false)
    const [dataNNS, setDataNNS] = useState([])
    const [selectNNS, setSelectNNS] = useState([])

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

    function handleChangeTransactionReposrtQrisIssuer(e) {
        setInputHandleTransactionReportQrisIssuerAdmin({
            ...inputHandleTransactionReportQrisIssuerAdmin,
            [ e.target.name ]: e.target.value
        })
    }

    function handleChangePeriodeTransactionReportQrisIssuer(e) {
        if (e.target.value === "7") {
            setShowDateTransactionReportQrisIssuer("")
            setInputHandleTransactionReportQrisIssuerAdmin({
                ...inputHandleTransactionReportQrisIssuerAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionReportQrisIssuer("none")
            setDateRangeTransactionReportQrisIssuer([])
            setInputHandleTransactionReportQrisIssuerAdmin({
                ...inputHandleTransactionReportQrisIssuerAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionReportQrisIssuer(item) {
        setStateTransactionReportQrisIssuer(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeTransactionReportQrisIssuer(item)
        }
    }

    function handlePageChangeTransactionReportQrisIssuer(page) {
        if (isFilterTransactionReportQrisIssuer) {
            setActivePageTransactionReportQrisIssuer(page)
            filterTransactionQrisIssuer(page, inputHandleTransactionReportQrisIssuerAdmin.idTransaksi, inputHandleTransactionReportQrisIssuerAdmin.jenisTransaksi, inputHandleTransactionReportQrisIssuerAdmin.namaPenerbit, inputHandleTransactionReportQrisIssuerAdmin.statusEzee, inputHandleTransactionReportQrisIssuerAdmin.statusRintis, inputHandleTransactionReportQrisIssuerAdmin.periode, dateRangeTransactionReportQrisIssuer)
        } else {
            setActivePageTransactionReportQrisIssuer(page)
            getTransactionReportQrisIssuer(page)
        }
    }

    function resetButtonQrisTransactionIssuer(param) {
        if (param === "admin") {
            setInputHandleTransactionReportQrisIssuerAdmin({
                idTransaksi: "",
                jenisTransaksi: "",
                namaPenerbit: "",
                periode: 0,
                statusEzee: "",
                statusRintis: "",
            })
            setIsFilterTransactionReportQrisIssuer(false)
            setShowDateTransactionReportQrisIssuer("none")
            setDateRangeTransactionReportQrisIssuer([])
            setStateTransactionReportQrisIssuer(null)
            setSelectNNS([])
            getTransactionReportQrisIssuer(1)
        }
    }

    async function getNNSdata() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataNNS = await axios.post(BaseURL + "/QRIS/QrisNNSGet", {data: ""}, {headers: headers})
            console.log(dataNNS, 'dataNNS');
            if (dataNNS.status === 200 && dataNNS.data.response_code === 200 && dataNNS.data.response_new_token === null) {
                let newArr = []
                dataNNS.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mqrisnns_code
                    obj.label = e.mqrisnns_name
                    newArr.push(obj)
                })
                setDataNNS(newArr)
            } else if (dataNNS.status === 200 && dataNNS.data.response_code === 200 && dataNNS.data.response_new_token !== null) {
                setUserSession(dataNNS.data.response_new_token)
                let newArr = []
                dataNNS.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mqrisnns_code
                    obj.label = e.mqrisnns_name
                    newArr.push(obj)
                })
                setDataNNS(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getTransactionReportQrisIssuer(currentPage) {
        try {
            setActivePageTransactionReportQrisIssuer(currentPage)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "id_trans": null, "jenis_trans": "", "id_penerbit": "", "status_ezee": "1,2,4,6,9", "status_rintis": "00, A0, 03, 05, 12, 13, 14, 30, 51, 57, 58, 59, 61, 62, 65, 68, 90, 91,92, 94, 96, 99", "period": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 10 }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getReportQrisIssuer = await axios.post(BaseURL + "/QRIS/QrisTransactionReportIssuer", {data: dataParams}, {headers: headers})
            console.log(getReportQrisIssuer, 'getReportQrisIssuer');
            if (getReportQrisIssuer.status === 200 && getReportQrisIssuer.data.response_code === 200 && getReportQrisIssuer.data.response_new_token === null) {
                getReportQrisIssuer.data.response_data.results = getReportQrisIssuer.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                setPageNumberTransactionReportQrisIssuer(getReportQrisIssuer.data.response_data)
                setTotalPageTransactionReportQrisIssuer(getReportQrisIssuer.data.response_data.max_page)
                setDataTransactionReportQrisIssuer(getReportQrisIssuer.data.response_data.results)
                setPendingTransactionReportQrisIssuer(false)
            } else if (getReportQrisIssuer.status === 200 && getReportQrisIssuer.data.response_code === 200 && getReportQrisIssuer.data.response_new_token !== null) {
                setUserSession(getReportQrisIssuer.data.response_new_token)
                getReportQrisIssuer.data.response_data.results = getReportQrisIssuer.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                setPageNumberTransactionReportQrisIssuer(getReportQrisIssuer.data.response_data)
                setTotalPageTransactionReportQrisIssuer(getReportQrisIssuer.data.response_data.max_page)
                setDataTransactionReportQrisIssuer(getReportQrisIssuer.data.response_data.results)
                setPendingTransactionReportQrisIssuer(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterTransactionQrisIssuer(page, idTrans, jenisTrans, idPenerbit, statusEZ, statusRintis, periode, dateRange) {
        try {
            setIsFilterTransactionReportQrisIssuer(true)
            console.log(page, 'page');
            console.log(periode, 'periode');
            console.log(dateRange, 'dateRange');
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "id_trans": ${idTrans.length !== 0 ? JSON.stringify(idTrans) : null}, "jenis_trans": "${jenisTrans}", "id_penerbit": "${idPenerbit}", "status_ezee": "${statusEZ.length !== 0 ? statusEZ : "1,2,4,6,9"}", "status_rintis": "${statusRintis.length !== 0 ? statusRintis : "00, A0, 03, 05, 12, 13, 14, 30, 51, 57, 58, 59, 61, 62, 65, 68, 90, 91, 92, 94, 96, 99"}", "period": ${periode !== 0 ? periode : 2}, "date_from": "${dateRange.length !== 0 ? dateRange[0] : ""}", "date_to": "${dateRange.length !== 0 ? dateRange[1] : ""}", "page": ${page}, "row_per_page": 10 }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const filteredDataQrisIssuer = await axios.post(BaseURL + "/QRIS/QrisTransactionReportIssuer", {data: dataParams}, {headers: headers})
            // console.log(filteredDataQrisIssuer, 'filteredDataQrisIssuer');
            if (filteredDataQrisIssuer.status === 200 && filteredDataQrisIssuer.data.response_code === 200 && filteredDataQrisIssuer.data.response_new_token === null) {
                filteredDataQrisIssuer.data.response_data.results = filteredDataQrisIssuer.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                setPageNumberTransactionReportQrisIssuer(filteredDataQrisIssuer.data.response_data)
                setTotalPageTransactionReportQrisIssuer(filteredDataQrisIssuer.data.response_data.max_page)
                setDataTransactionReportQrisIssuer(filteredDataQrisIssuer.data.response_data.results)
                setPendingTransactionReportQrisIssuer(false)
            } else if (filteredDataQrisIssuer.status === 200 && filteredDataQrisIssuer.data.response_code === 200 && filteredDataQrisIssuer.data.response_new_token !== null) {
                setUserSession(filteredDataQrisIssuer.data.response_new_token)
                filteredDataQrisIssuer.data.response_data.results = filteredDataQrisIssuer.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                setPageNumberTransactionReportQrisIssuer(filteredDataQrisIssuer.data.response_data)
                setTotalPageTransactionReportQrisIssuer(filteredDataQrisIssuer.data.response_data.max_page)
                setDataTransactionReportQrisIssuer(filteredDataQrisIssuer.data.response_data.results)
                setPendingTransactionReportQrisIssuer(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getNNSdata()
        getTransactionReportQrisIssuer(activePageTransactionReportQrisIssuer)
    }, [])


    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.id_trans,
            width: "170px",
            wrap: true
        },
        {
            name: 'Waktu Transaksi',
            selector: row => row.waktu_trans,
            width: "200px"
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.jenis_trans !== null ? row.jenis_trans : "-",
            wrap: true,
            width: "150px"
        },
        // {
        //     name: 'Jenis QR',
        //     selector: row => row.generate_qris_date,
        //     width: "200px"
        // },
        {
            name: 'Nama Penerbit QR',
            selector: row => row.nama_penerbit !== null ? row.nama_penerbit : "-",
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.nominal_trans, true, 2),
            width: "180px"
        },
        {
            name: '% MDR Ezee',
            selector: row => row.MDR,
            width: "150px"
        },
        {
            name: 'Pendapatan Ezee',
            selector: row => convertToRupiah(row.pendapatan_ezee, true, 2),
            width: "200px"
        },
        {
            name: 'Kirim ke RINTIS',
            selector: row => convertToRupiah(row.pendapatan_rintis, true, 2),
            width: "200px"
        },
        {
            name: 'Status Ezee',
            selector: row => row.status_ezee,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            wrap: true,
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"} //bg: silver
                },
                {
                    when: row => row.id_ezee === 2,
                    style: { background: "#077e8614", color: "#077E86"} //bg: biru
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}// bg: merah
                },
            ]
        },
        {
            name: 'Status RINTIS',
            selector: row => row.status_rintis,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            wrap: true,
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"}
                },
                {
                    when: row => row.id_rintis === "00",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86"}
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}
                },
            ]
        },
    ];

    const customStylesQrisIssuer = {
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
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Transaksi &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS Issuer</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>QRIS Issuer</h2>
            </div>
            <div className='base-content mt-3'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                <Row>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>ID Transaksi</span>
                        <input name="idTransaksi" value={inputHandleTransactionReportQrisIssuerAdmin.idTransaksi} onChange={(e) => handleChangeTransactionReposrtQrisIssuer(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>Jenis Transaksi</span>
                        <Form.Select name='jenisTransaksi' value={inputHandleTransactionReportQrisIssuerAdmin.jenisTransaksi} onChange={(e) => handleChangeTransactionReposrtQrisIssuer(e)} className="input-text-riwayat ms-3">
                            <option defaultChecked disabled value={""}>Pilih Jenis Transaksi</option>
                            <option value={"1"}>Off Us</option>
                            <option value={"93600922"}>On Us</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>Nama Penerbit</span>
                        <div className="dropdown dropSaldoPartner" style={{ width: "15.6rem" }}>
                            <ReactSelect
                                closeMenuOnSelect={true}
                                hideSelectedOptions={false}
                                options={dataNNS}
                                value={selectNNS}
                                onChange={(selected) => setSelectNNS([selected])}
                                placeholder="Pilih Nama Penerbit"
                                components={{ Option }}
                                styles={customStylesSelectedOption}
                                filterOption={customFilter}
                            />
                        </div>
                        {/* <input name="namaPenerbit" value={inputHandleTransactionReportQrisIssuerAdmin.namaPenerbit} onChange={(e) => handleChangeTransactionReposrtQrisIssuer(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/> */}
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>Periode <span style={{ color: "red" }}>*</span></span>
                        <Form.Select name='periode' value={inputHandleTransactionReportQrisIssuerAdmin.periode} onChange={(e) => handleChangePeriodeTransactionReportQrisIssuer(e)} className="input-text-riwayat ms-3">
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className='text-end mt-4' style={{ display: showDateTransactionReportQrisIssuer }}>
                        <DateRangePicker
                            onChange={pickDateTransactionReportQrisIssuer}
                            value={stateTransactionReportQrisIssuer}
                            clearIcon={null}
                        />
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>Status Ezee</span>
                        <Form.Select name="statusEzee" value={inputHandleTransactionReportQrisIssuerAdmin.statusEzee} onChange={(e) => handleChangeTransactionReposrtQrisIssuer(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                            <option defaultChecked disabled value={""}>Pilih Status Ezee</option>
                            <option value={2}>Berhasil</option>
                            <option value={4}>Gagal</option>
                            <option value={5}>Menunggu Pembayaran</option>
                            <option value={6}>Kadaluwarsa</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                        <span>Status RINTIS</span>
                        <Form.Select name="statusRintis" value={inputHandleTransactionReportQrisIssuerAdmin.statusRintis} onChange={(e) => handleChangeTransactionReposrtQrisIssuer(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                            <option defaultChecked disabled value={""}>Pilih Status RINTIS</option>
                            <option value={2}>Berhasil</option>
                            <option value={4}>Gagal</option>
                            <option value={5}>Menunggu Pembayaran</option>
                            <option value={6}>Kadaluwarsa</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    onClick={() => filterTransactionQrisIssuer(1, inputHandleTransactionReportQrisIssuerAdmin.idTransaksi, inputHandleTransactionReportQrisIssuerAdmin.jenisTransaksi, inputHandleTransactionReportQrisIssuerAdmin.namaPenerbit, inputHandleTransactionReportQrisIssuerAdmin.statusEzee, inputHandleTransactionReportQrisIssuerAdmin.statusRintis, inputHandleTransactionReportQrisIssuerAdmin.periode, dateRangeTransactionReportQrisIssuer)}
                                    className={(inputHandleTransactionReportQrisIssuerAdmin.periode === 0 || (inputHandleTransactionReportQrisIssuerAdmin.periode === 7 && dateRangeTransactionReportQrisIssuer.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                    disabled={(inputHandleTransactionReportQrisIssuerAdmin.periode === 0 || (inputHandleTransactionReportQrisIssuerAdmin.periode === 7 && dateRangeTransactionReportQrisIssuer.length === 0))}
                                >
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    onClick={() => resetButtonQrisTransactionIssuer("admin")}
                                    className={(inputHandleTransactionReportQrisIssuerAdmin.periode === 0 || (inputHandleTransactionReportQrisIssuerAdmin.periode === 7 && dateRangeTransactionReportQrisIssuer.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                    disabled={(inputHandleTransactionReportQrisIssuerAdmin.periode === 0 || (inputHandleTransactionReportQrisIssuerAdmin.periode === 7 && dateRangeTransactionReportQrisIssuer.length === 0))}
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
                            <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQrisIssuer, inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris, inputHandleTransactionReportQrisAdmin.channelPembayaran)}>Export</Link>
                        </div>
                    )
                } */}
                <div className="div-table mt-5 pb-4">
                    <DataTable
                        columns={columnsAdmin}
                        data={dataTransactionReportQrisIssuer}
                        customStyles={customStylesQrisIssuer}
                        highlightOnHover
                        progressPending={pendingTransactionReportQrisIssuer}
                        progressComponent={<CustomLoader />}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionReportQrisIssuer}</div>
                    <Pagination
                        activePage={activePageTransactionReportQrisIssuer}
                        itemsCountPerPage={pageNumberTransactionReportQrisIssuer.row_per_page}
                        totalItemsCount={(pageNumberTransactionReportQrisIssuer.row_per_page*pageNumberTransactionReportQrisIssuer.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeTransactionReportQrisIssuer}
                    />
                </div>
            </div>
        </div>
    )
}

export default QrisIssuer