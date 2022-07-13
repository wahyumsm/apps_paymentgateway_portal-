import React, { useEffect, useState } from 'react'
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import DataTable from 'react-data-table-component';
import { invoiceItems } from '../../data/tables';
import { convertToRupiah, getToken } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

function RiwayatTransaksi() {

    const history = useHistory()
    const access_token = getToken();
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataRiwayatDanaMasuk, setDataRiwayatDanaMasuk] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [dataRiwayatSettlement, setDataRiwayatSettlement] = useState([])
    const [totalSettlement, setTotalSettlement] = useState([])
    const [state, setState] = useState(null)
    const [dateRange, setDateRange] = useState([])
    const [showDate, setShowDate] = useState("none")
    const [inputHandle, setInputHandle] = useState({
        idTransaksiDanaMasuk: "",
        idTransaksiSettlement: "",
        namaPartnerDanaMasuk: "",
        namaPartnerSettlement: "",
        namaAgenDanaMasuk: "",
        statusDanaMasuk: [],
        statusSettlement: [],
        periode: 0,
    })

    function handleChange(e) {
        if (e.target.name === "periode" && e.target.value === "7") {
            setShowDate("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }else if (e.target.name !== "periode" && e.target.value !== "7" && inputHandle.periode === "7") {
            setShowDate("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDate("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    async function listPartner() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listPartner = await axios.post("/Partner/ListPartner", {data: ""}, {headers: headers})
            // console.log(listPartner, "ini list partner");
            if (listPartner.status === 200 && listPartner.data.response_code === 200) {
                setDataListPartner(listPartner.data.response_data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function riwayatDanaMasuk() {
        // dateId :
        // 0 -> all
        // 2 -> hari ini
        // 3 -> kemarin
        // 4 -> minggu ini
        // 5 -> bulan ini
        // 6 -> bulan lalu
        // 7 -> pilih tanggal
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [1,2,3,4,5,6,7,8,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 0, "date_from": "", "date_to": "", "page": 1, "row_per_page": 10}`)
            // console.log(dataParams, "dataParams");
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatDanaMasuk = await axios.post("/Home/GetListHistoryTransfer", {data: dataParams}, { headers: headers });
            // console.log(dataRiwayatDanaMasuk, "dataRiwayatDanaMasuk");
            if (dataRiwayatDanaMasuk.status === 200 && dataRiwayatDanaMasuk.data.response_code === 200) {
                // setPageNumber(dataRiwayatDanaMasuk.data.response_data)
                dataRiwayatDanaMasuk.data.response_data.results = dataRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({...obj, number: idx + 1}))
                setDataRiwayatDanaMasuk(dataRiwayatDanaMasuk.data.response_data.results)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function riwayatSettlement() {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 0, "date_from": "", "date_to": "", "page": 1, "row_per_page": 10}`)
            // console.log(dataParams, "dataParams");
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatSettlement = await axios.post("/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
            // console.log(dataRiwayatSettlement, "riwayatSettlement");
            if (dataRiwayatSettlement.status === 200 && dataRiwayatSettlement.data.response_code === 200) {
                dataRiwayatSettlement.data.response_data.results.list_data = dataRiwayatSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: idx + 1}))
                setDataRiwayatSettlement(dataRiwayatSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataRiwayatSettlement.data.response_data.results.total_settlement)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function pickDate(item) {
        setState(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRange(item)
        }
    }

    async function filterRiwayatDanaMasuk(statusId, transId, partnerId, subPartnerId, dateId, periode) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : ${(transId.length !== 0) ? transId : 0}, "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "subPartnerID": "${(subPartnerId.length !== 0) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 10}`)
            // console.log(dataParams, "dataParams");
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const filterRiwayatDanaMasuk = await axios.post("/Home/GetListHistoryTransfer", {data: dataParams}, { headers: headers });
            // console.log(filterRiwayatDanaMasuk, "filterRiwayatDanaMasuk");
            if (filterRiwayatDanaMasuk.status === 200 && filterRiwayatDanaMasuk.data.response_code === 200) {
                filterRiwayatDanaMasuk.data.response_data.results = filterRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({...obj, number: idx + 1}))
                setDataRiwayatDanaMasuk(filterRiwayatDanaMasuk.data.response_data.results)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function resetButtonHandle(param) {
        if (param === "Dana Masuk") {
            setInputHandle({
                ...inputHandle,
                idTransaksiDanaMasuk: "",
                namaPartnerDanaMasuk: "",
                namaAgenDanaMasuk: "",
                statusDanaMasuk: [],
                periode: 0,
            })
            setState(null)
            setDateRange([])
            setShowDate("none")
        } else {
            setInputHandle({
                ...inputHandle,
                idTransaksiSettlement: "",
                namaPartnerSettlement: "",
                statusSettlement: [],
                periodeSettlement: 0,
            })
            setState(null)
            setDateRange([])
            setShowDate("none")
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        listPartner()
        riwayatDanaMasuk()
        riwayatSettlement()
    }, [])
    
    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.mpartnerdtl_partner_id,
            width: "120px"
            // sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            // sortable: true,          
            // width: "100px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            // sortable: true
        },
        {
            name: 'Nama Agen',
            selector: row => row.mpartnerdtl_sub_name,
            // sortable: true,
            // width: "175px"
        },
        {
            name: 'Jumlah Diterima',
            selector: row => row.tvatrans_amount,
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center" }}>{ convertToRupiah(row.tvatrans_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px 20px", width: "100%", borderRadius: 4 },
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
                    when: row => row.tvatrans_status_id === 4 || row.tvatrans_status_id === 9,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvatrans_status_id === 3 || row.tvatrans_status_id === 5 || row.tvatrans_status_id === 6 || row.tvatrans_status_id === 8 || row.tvatrans_status_id === 10 || row.tvatrans_status_id === 11 || row.tvatrans_status_id === 12 || row.tvatrans_status_id === 13 || row.tvatrans_status_id === 14 || row.tvatrans_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.mpartnerdtl_partner_id,
            // sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
            // sortable: true,
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            // sortable: true,
        },
        {
            name: 'Nominal Settlement',
            selector: row => row.tvasettl_amount,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px 20px", width: "100%", borderRadius: 4 },
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
                    when: row => row.tvasettl_status_id === 4 || row.tvasettl_status_id === 9,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px'
            },
        },
    };

    // console.log(inputHandle.status, "ini input handle status");

  return (
    <div className="content-page">
        <div className='head-title'>
            <h2 className="h5 mb-2 mt-4">Riwayat Transaksi</h2>
        </div>
        <div className='main-content'>
            <div className='riwayat-dana-masuk-div mt-5'>
                <span className='mt-4' style={{fontWeight: 600}}>Riwayat Dana Masuk</span>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>ID Transaksi</span>
                            <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDanaMasuk} name="idTransaksiDanaMasuk" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                            {/* <input type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>            */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Nama Partner</span>
                            <Form.Select name='namaPartnerDanaMasuk' className="input-text-ez me-4" value={inputHandle.namaPartnerDanaMasuk} onChange={(e) => handleChange(e)}>
                                <option defaultChecked value="">Pilih Nama Partner</option>
                                {
                                    dataListPartner.map((item, index) => {
                                        return (
                                            <option key={index} value={item.partner_id}>{item.nama_perusahaan}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </Col>
                        <Col xs={4}>
                            <span>Nama Agen</span>
                            <input onChange={(e) => handleChange(e)} value={inputHandle.namaAgenDanaMasuk} name="namaAgenDanaMasuk" type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/>
                            {/* <input type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/>                         */}
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Status</span>
                            <Form.Select name="statusDanaMasuk" className='input-text-ez me-4' style={{ display: "inline" }} value={inputHandle.statusDanaMasuk} onChange={(e) => handleChange(e)}>
                                <option>Pilih Status</option>
                                <option value={2}>Berhasil</option>
                                <option value={1}>In Progress</option>
                                {/* <option value={3}>Refund</option> */}
                                {/* <option value={4}>Canceled</option> */}
                                <option value={7}>Menunggu Pembayaran</option>
                                {/* <option value={8}>Paid</option> */}
                                <option value={9}>Kadaluwarsa</option>
                                {/* <option value={10}>Withdraw</option> */}
                                {/* <option value={11}>Idle</option> */}
                                {/* <option value={15}>Expected Success</option> */}
                            </Form.Select>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDate === "none") ? "30%" : "40%" }}>
                            <span>Periode*</span>
                            <Form.Select name='periode' className="input-text-ez me-4" value={inputHandle.periode} onChange={(e) => handleChange(e)}>
                                <option defaultChecked>Pilih Periode</option>
                                <option value={2}>Hari Ini</option>
                                <option value={3}>Kemarin</option>
                                <option value={4}>7 Hari Terakhir</option>
                                <option value={5}>Bulan Ini</option>
                                <option value={6}>Bulan Kemarin</option>
                                <option value={7}>Pilih Range Tanggal</option>
                            </Form.Select>
                            <div style={{ display: showDate }}>
                                <DateRangePicker 
                                    onChange={pickDate}
                                    value={state}
                                    clearIcon={null}
                                    // calendarIcon={null}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={3}>
                            <Row>
                                <Col xs={6}>
                                    <button
                                        onClick={() => filterRiwayatDanaMasuk(inputHandle.status, inputHandle.idTransaksi, inputHandle.namaPartner, inputHandle.namaAgen, inputHandle.periode, dateRange, )}
                                        className={(inputHandle.periode || dateRange.length !== 0 || dateRange.length !== 0 && inputHandle.idTransaksi.length !== 0 || dateRange.length !== 0 && inputHandle.status.length !== 0 || dateRange.length !== 0 && inputHandle.namaAgen.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                        disabled={inputHandle.periode === "" || inputHandle.periode === "" && inputHandle.idTransaksi.length === 0 || inputHandle.periode === "" && inputHandle.status.length === 0 || inputHandle.periode === "" && inputHandle.namaAgen.length === 0}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6}>
                                    <button
                                        onClick={() => resetButtonHandle("Dana Masuk")}
                                        className={(inputHandle.periode || dateRange.length !== 0 || dateRange.length !== 0 && inputHandle.idTransaksi.length !== 0 || dateRange.length !== 0 && inputHandle.status.length !== 0 || dateRange.length !== 0 && inputHandle.namaAgen.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                        disabled={inputHandle.periode === "" || inputHandle.periode === "" && inputHandle.idTransaksi.length === 0 || inputHandle.periode === "" && inputHandle.status.length === 0 || inputHandle.periode === "" && inputHandle.namaAgen.length === 0}
                                    >Atur Ulang</button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="div-table mt-6">
                        <DataTable
                            columns={columns}
                            data={dataRiwayatDanaMasuk}
                            customStyles={customStyles}
                            highlightOnHover
                            // pagination
                        />
                    </div>
                </div>
            </div>
            <div className='riwayat-settlement-div mt-5'>
                <span className='mt-4' style={{fontWeight: 600}}>Riwayat Settlement</span>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>ID Transaksi</span>
                            <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlement} name="idTransaksiSettlement" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Nama Partner</span>
                            <input onChange={(e) => handleChange(e)} value={inputHandle.namaPartnerSettlement} name="namaPartnerSettlement" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                            {/* <input type='text'className='input-text-ez' placeholder='Masukkan Nama Partner'/> */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Status</span>
                            <Form.Select name="statusSettlement" className='input-text-ez me-4' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                                <option>Pilih Status</option>
                                <option value={2}>Berhasil</option>
                                <option value={1}>In Progress</option>
                                {/* <option value={3}>Refund</option> */}
                                {/* <option value={4}>Canceled</option> */}
                                <option value={7}>Menunggu Pembayaran</option>
                                {/* <option value={8}>Paid</option> */}
                                <option value={9}>Kadaluwarsa</option>
                                {/* <option value={10}>Withdraw</option> */}
                                {/* <option value={11}>Idle</option> */}
                                {/* <option value={15}>Expected Success</option> */}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDate === "none") ? "30%" : "40%" }}>
                            <span>Periode*</span>
                            <Form.Select name='periode' className="input-text-ez me-4" value={inputHandle.periode} onChange={(e) => handleChange(e)}>
                                <option defaultChecked>Pilih Periode</option>
                                <option value={2}>Hari Ini</option>
                                <option value={3}>Kemarin</option>
                                <option value={4}>7 Hari Terakhir</option>
                                <option value={5}>Bulan Ini</option>
                                <option value={6}>Bulan Kemarin</option>
                                <option value={7}>Pilih Range Tanggal</option>
                            </Form.Select>
                            <div style={{ display: showDate }}>
                                <DateRangePicker 
                                    onChange={pickDate}
                                    value={state}
                                    clearIcon={null}
                                    // calendarIcon={null}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={3}>
                            <Row>
                                <Col xs={6}>
                                    <button className='btn-ez'>Terapkan</button>
                                </Col>
                                <Col xs={6}>
                                    <button className='btn-ez'>Atur Ulang</button>
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
                    <div className="div-table mt-6 mb-6">
                        <DataTable
                            columns={columnsSettl}
                            data={dataRiwayatSettlement}
                            customStyles={customStyles}
                            // pagination
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RiwayatTransaksi