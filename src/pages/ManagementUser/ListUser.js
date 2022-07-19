import React, { useEffect, useState } from "react";
import { Col, Row, Form, Modal, Button, Table, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Container, Image } from '@themesberg/react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import 'chart.js/auto';
import DataTable from 'react-data-table-component';
import { BaseURL, convertToRupiah, errorCatch, getToken } from "../../function/helpers";
import axios from "axios";
import encryptData from "../../function/encryptData";
import * as XLSX from "xlsx"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import "./ListUser.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function ListUser () {

  const history = useHistory();
  const access_token = getToken();
  const [listTransferDana, setListTransferDana] = useState([])
  const [dataChartTransfer, setDataChartTransfer] = useState([])
  const [listSettlement, setListSettlement] = useState([])
  const [state, setState] = useState(null)
  const [dateRange, setDateRange] = useState([])
  const [inputHandle, setInputHandle] = useState({
    idTransaksi: "",
    namaAgen: "",
    status: "",
  })
  const [pendingTransfer, setPendingTransfer] = useState(true)
  const [pendingSettlement, setPendingSettlement] = useState(true)
  const [detailTransferDana, setDetailTransferDana] = useState({})
  const [showModalDetailTransferDana, setShowModalDetailTransferDana] = useState(false)
  const currentDate = new Date().toISOString().split('T')[0]
  const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).toISOString().split('T')[0]

  function handleChange(e) {
    setInputHandle({
        ...inputHandle,
        [e.target.name] : e.target.value
    })
  }

  function pickDate(item) {
    setState(item)
    if (item !== null) {
      item = item.map(el => el.toLocaleDateString('en-CA'))
      setDateRange(item)
    }
  }
  async function getListTransferDana(oneMonthAgo, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"start_time": "${oneMonthAgo}", "end_time": "${currentDate}", "sub_name": "", "id": "", "status": ""}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listTransferDana = await axios.post("/report/transferreport", { data: dataParams }, { headers: headers })
      if (listTransferDana.status === 200 && listTransferDana.data.response_code === 200) {
        listTransferDana.data.response_data.list = listTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListTransferDana(listTransferDana.data.response_data.list)
        setPendingTransfer(false)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function getSettlement(oneMonthAgo, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_id":0, "tvasettl_status_id":0, "tvasettl_from":"${oneMonthAgo}", "tvasettl_to":"${currentDate}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataSettlement = await axios.post("/report/GetSettlement", { data: dataParams }, { headers: headers })
      if (dataSettlement.status === 200 && dataSettlement.data.response_code == 200) {
        dataSettlement.data.response_data = dataSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListSettlement(dataSettlement.data.response_data)
        setPendingSettlement(false)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function getSettlementChart(oneMonthAgo, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_from":"${oneMonthAgo}", "tvasettl_to":"${currentDate}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataChartTransfer = await axios.post("/Report/GetSettlementChart", { data: dataParams }, { headers: headers })
      // console.log(dataChartTransfer, 'ini data chart transfer ');
      if (dataChartTransfer.data.response_code === 200 && dataChartTransfer.status === 200) {
        dataChartTransfer.data.response_data = dataChartTransfer.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
      setDataChartTransfer(dataChartTransfer.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterTransferButtonHandle(idTransaksi, namaAgen, periode, status) {
    try {
      setPendingSettlement(true)
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"start_time": "${(periode.length !== 0) ? periode[0] : ""}", "end_time": "${(periode.length !== 0) ? periode[1] : ""}", "sub_name": "${(namaAgen.length !== 0) ? namaAgen : ""}", "id": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "status": "${(status.length !== 0) ? status : ""}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const filterTransferDana = await axios.post("/report/transferreport", { data: dataParams }, { headers: headers })
      if (filterTransferDana.status === 200 && filterTransferDana.data.response_code == 200) {
        filterTransferDana.data.response_data.list = filterTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListTransferDana(filterTransferDana.data.response_data.list)
        setPendingSettlement(false)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterSettlementButtonHandle(idTransaksi, periode, status) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_id":${(idTransaksi.length !== 0) ? idTransaksi : 0}, "tvasettl_status_id":${(status.length !== 0) ? status : 0}, "tvasettl_from":"${(periode.length !== 0) ? periode[0] : ""}", "tvasettl_to":"${(periode.length !== 0) ? periode[1] : ""}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const filterSettlement = await axios.post("/report/GetSettlement", { data: dataParams }, { headers: headers })
      if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200) {
        filterSettlement.data.response_data = filterSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListSettlement(filterSettlement.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  function resetButtonHandle() {
    setInputHandle({
        ...inputHandle,
        idTransaksi : "",
        namaAgen: "",
        status : ""
    })
    setState(null)
    setDateRange([])
  }

  useEffect(() => {
    if (!access_token) {
      history.push('/login');
    }
    getListTransferDana(oneMonthAgo, currentDate)
    getSettlement(oneMonthAgo, currentDate)
    getSettlementChart(oneMonthAgo, currentDate)
  }, [])

  async function detailListTransferHandler(trxId) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvatrans_trx_id":${trxId}}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const detailTransaksi = await axios.post("/Report/GetTransferReportDetail", { data: dataParams }, { headers: headers })
      if (detailTransaksi.status === 200 && detailTransaksi.data.response_code === 200) {
        setDetailTransferDana(detailTransaksi.data.response_data)
        setShowModalDetailTransferDana(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columnstransferDana = [
    {
        name: 'No',
        selector: row => row.number,
        width: "67px"
    },
    {
        name: 'ID Transaksi',
        selector: row => row.id,
        cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.id)}>{row.id}</Link>
        // sortable: true
    },
    {
        name: 'Waktu',
        selector: row => row.created_at,
        // sortable: true
    },
    {
        name: 'Nama Agen',
        selector: row => row.name,
        // sortable: true
    },
    {
        name: 'Total Akhir',
        selector: row => row.amount,
        // sortable: true,
        cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center" }}>{ convertToRupiah(row.amount) }</div>,
        style: { display: "flex", flexDirection: "row", justifyContent: "center", }
    },
    {
        name: 'Status',
        selector: row => row.status,
        width: "150px",
        // sortable: true,
        style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px 20px", width: "100%", borderRadius: 4 },
        conditionalCellStyles: [
          {
            when: row => row.status_id === "2",
            style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
          },
          {
            when: row => row.status_id === "1" || row.status_id === "7",
            style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
          },
          {
            when: row => row.status_id === "4" || row.status_id === "9",
            style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
          },
          {
            when: row => row.status_id === "3" || row.status_id === "5" || row.status_id === "6" || row.status_id === "8" || row.status_id === "10" || row.status_id === "11" || row.status_id === "12" || row.status_id === "13" || row.status_id === "14" || row.status_id === "15",
            style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
          }
        ],
    },
  ];

  const columnsSettlement = [
    {
        name: 'No',
        selector: row => row.number,
        width: "67px"
    },
    {
        name: 'ID Transaksi',
        selector: row => row.tvasettl_code,
        width: "251px"
        // sortable: true
    },
    {
        name: 'Waktu',
        selector: row => row.tvasettl_crtdt,
        // sortable: true
    },
    {
        name: 'Jumlah',
        selector: row => row.tvasettl_amount,
        // sortable: true,
        cell: row => <div style={{ padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>
    },
    {
        name: 'Status',
        selector: row => row.mstatus_name,
        width: "127px",
        // sortable: true,
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
            when: row => row.tvasettl_status_id === 4 || row.tvasettl_status_id === 9,
            style: { background: "#FDEAEA", color: "#EE2E2C" }
          },
          {
            when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
            style: { background: "#F0F0F0", color: "#888888" }
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
              fontSize: '16px',
          },
      },
  };

  function exportReportTransferDanaMasukHandler(data) {
    let dataExcel = []
    for (let i = 0; i < data.length; i++) {
      dataExcel.push({ No: i + 1, "ID Transaksi": data[i].id, Waktu: data[i].created_at, "Nama Agen": data[i].name, "Total Akhir": data[i].amount, Status: data[i].status })
    }
    let workSheet = XLSX.utils.json_to_sheet(dataExcel);
    let workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFile(workBook, "Report Transfer Dana Masuk.xlsx");
  }

  function exportReportSettlementHandler(data) {
    let dataExcel = []
    for (let i = 0; i < data.length; i++) {
      dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_id, Waktu: data[i].tvasettl_crtdt, Jumlah: data[i].tvasettl_amount, Status: data[i].tvasettl_status_id })
    }
    let workSheet = XLSX.utils.json_to_sheet(dataExcel);
    let workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFile(workBook, "Report Settlement.xlsx");
  }

  const CustomLoader = () => (
    <div style={{ padding: '24px' }}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
      <div>Loading...</div>
    </div>
  );

    const tambahPartner = () => {
        history.push("/managementuser")
    }

  return (
    <>
      <div className="main-content" style={{padding: "37px 27px 37px 27px"}}>
        <div className="head-title">
          <h2 className="h4 mt-5">Management User</h2>
        </div>
        <button className="my-3" onClick={() => tambahPartner()} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 201, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah Data
        </button>
        <div className='base-content'>
            <span className='mb-4' style={{fontWeight: 600}}>Data User</span>
            <Row className='mt-4'>
                <Col className="font-weight-bold" xs={12}>Search By</Col>
                <Col xs={4}>
                    <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksi} name="idTransaksi" type='text'className='input-text-ez' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4}>
                    <input onChange={(e) => handleChange(e)} value={inputHandle.namaAgen} name="namaAgen" type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span style={{ marginRight: 20 }}>Periode*</span>
                    <DateRangePicker
                      onChange={pickDate}
                      value={state}
                      clearIcon={null}
                      // calendarIcon={null}
                    />
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={3}>
                    <Row>
                        <Col xs={6}>
                            <button onClick={() => filterTransferButtonHandle(inputHandle.idTransaksi, inputHandle.namaAgen, dateRange, inputHandle.status)} className={(dateRange.length !== 0 || dateRange.length !== 0 && inputHandle.idTransaksi.length !== 0 || dateRange.length !== 0 && inputHandle.status.length !== 0 || dateRange.length !== 0 && inputHandle.namaAgen.length !== 0) ? "btn-ez-on" : "btn-ez"} disabled={dateRange.length === 0 || dateRange.length === 0 && inputHandle.idTransaksi.length === 0 || dateRange.length === 0 && inputHandle.status.length === 0 || dateRange.length === 0 && inputHandle.namaAgen.length === 0}>
                              Terapkan
                            </button>
                        </Col>
                        <Col xs={6}>
                            <button onClick={resetButtonHandle} className={(dateRange.length !== 0 || dateRange.length !== 0 && inputHandle.idTransaksi.length !== 0 || dateRange.length !== 0 && inputHandle.status.length !== 0 || dateRange.length !== 0 && inputHandle.namaAgen.length !== 0) ? "btn-ez-on" : "btn-ez"} disabled={dateRange.length === 0 || dateRange.length === 0 && inputHandle.idTransaksi.length === 0 || dateRange.length === 0 && inputHandle.status.length === 0 || dateRange.length === 0 && inputHandle.namaAgen.length === 0}>
                              Atur Ulang
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
              listTransferDana.length !== 0 &&
              <div>
                <Link onClick={() => exportReportTransferDanaMasukHandler(listTransferDana)} className="export-span">Export</Link>
              </div>
            }
            <br/>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columnstransferDana}
                    data={listTransferDana}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    progressPending={pendingTransfer}
                    progressComponent={<CustomLoader />}
                />
            </div>
        </div>
      </div>
    </>
  );
};

export default ListUser
