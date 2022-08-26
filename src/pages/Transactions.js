import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faCog, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Modal, Button, Table, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Container, Image } from '@themesberg/react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import 'chart.js/auto';
// import { Chart } from 'react-chartjs-2';
// import { invoiceItems } from '../data/tables';
import DataTable from 'react-data-table-component';
// import { TransactionsTable } from "../components/Tables";
import { BaseURL, convertToRupiah, errorCatch, getToken, RouteTo, setUserSession } from "../function/helpers";
import axios from "axios";
import encryptData from "../function/encryptData";
import * as XLSX from "xlsx"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import loadingEzeelink from "../assets/img/technologies/Double Ring-1s-303px.svg"
// import { addDays } from "date-fns";
import {Line} from 'react-chartjs-2'
import { max } from "date-fns";
import breadcrumbsIcon from "../assets/icon/breadcrumbs_icon.svg";

export default () => {

  const history = useHistory();
  const access_token = getToken();
  const [listTransferDana, setListTransferDana] = useState([])
  const [dataChartTransfer, setDataChartTransfer] = useState([])
  const [listSettlement, setListSettlement] = useState([])
  const [stateDanaMasuk, setStateDanaMasuk] = useState(null)
  const [stateSettlement, setStateSettlement] = useState(null)
  const [dateRangeDanaMasuk, setDateRangeDanaMasuk] = useState([])
  const [dateRangeSettlement, setDateRangeSettlement] = useState([])
  const [inputHandle, setInputHandle] = useState({
    idTransaksiDanaMasuk: "",
    idTransaksiSettlement: "",
    namaAgenDanaMasuk: "",
    statusDanaMasuk: "",
    statusSettlement: "",
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

  function pickDateDanaMasuk(item) {
    setStateDanaMasuk(item)
    if (item !== null) {
      item = item.map(el => el.toLocaleDateString('en-CA'))
      setDateRangeDanaMasuk(item)
    }
  }

  function pickDateSettlement(item) {
    setStateSettlement(item)
    if (item !== null) {
      item = item.map(el => el.toLocaleDateString('en-CA'))
      setDateRangeSettlement(item)
    }
  }
  
  async function getListTransferDana(oneMonthAgo, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"start_time": "${currentDate}", "end_time": "${currentDate}", "sub_name": "", "id": "", "status": ""}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listTransferDana = await axios.post("/report/transferreport", { data: dataParams }, { headers: headers })

      if (listTransferDana.status === 200 && listTransferDana.data.response_code === 200 && listTransferDana.data.response_new_token.length === 0) {
        listTransferDana.data.response_data.list = listTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListTransferDana(listTransferDana.data.response_data.list)
        setPendingTransfer(false)
      } else if (listTransferDana.status === 200 && listTransferDana.data.response_code === 200 && listTransferDana.data.response_new_token.length !== 0) {
        setUserSession(listTransferDana.data.response_new_token)
        listTransferDana.data.response_data.list = listTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListTransferDana(listTransferDana.data.response_data.list)
        setPendingTransfer(false)
      }
    } catch (error) {
      console.log(error)
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status))
    }
  }

  async function getSettlement(oneMonthAgo, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_code":"", "tvasettl_status_id":0, "tvasettl_from":"${currentDate}", "tvasettl_to":"${currentDate}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataSettlement = await axios.post("/report/GetSettlement", { data: dataParams }, { headers: headers })
      // console.log(dataSettlement, "ini data settlement");
      if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
        dataSettlement.data.response_data = dataSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListSettlement(dataSettlement.data.response_data)
        setPendingSettlement(false)
      } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
        setUserSession(dataSettlement.data.response_new_token)
        dataSettlement.data.response_data = dataSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListSettlement(dataSettlement.data.response_data)
        setPendingSettlement(false)
      }
    } catch (error) {
      console.log(error)
      // RouteTo(errorCatch(error.response.status))
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
      if (dataChartTransfer.data.response_code === 200 && dataChartTransfer.status === 200 && dataChartTransfer.data.response_new_token.length === 0) {
        dataChartTransfer.data.response_data = dataChartTransfer.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setDataChartTransfer(dataChartTransfer.data.response_data)
      } else if (dataChartTransfer.data.response_code === 200 && dataChartTransfer.status === 200 && dataChartTransfer.data.response_new_token.length !== 0) {
        setUserSession(dataChartTransfer.data.response_new_token)
        dataChartTransfer.data.response_data = dataChartTransfer.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setDataChartTransfer(dataChartTransfer.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

//   var chart    = document.getElementById('chart').getContext('2d'),
//     gradient = chart.createLinearGradient(0, 0, 0, 450);

// gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)');
// gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
// gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

  async function filterTransferButtonHandle(idTransaksi, namaAgen, periode, status) {
    try {
      setPendingSettlement(true)
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"start_time": "${(periode.length !== 0) ? periode[0] : ""}", "end_time": "${(periode.length !== 0) ? periode[1] : ""}", "sub_name": "${(namaAgen.length !== 0) ? namaAgen : ""}", "id": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "status": "${(status.length !== 0) ? status : ""}"}`)
      // console.log(dataParams, "ini data params dana masuk filter");
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const filterTransferDana = await axios.post("/report/transferreport", { data: dataParams }, { headers: headers })
      // console.log(filterTransferDana, "ini data filter transfer dana");
      if (filterTransferDana.status === 200 && filterTransferDana.data.response_code === 200 && filterTransferDana.data.response_new_token.length === 0) {
        filterTransferDana.data.response_data.list = filterTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListTransferDana(filterTransferDana.data.response_data.list)
        setPendingSettlement(false)
      } else if (filterTransferDana.status === 200 && filterTransferDana.data.response_code === 200 && filterTransferDana.data.response_new_token.length !== 0) {
        setUserSession(filterTransferDana.data.response_new_token)
        filterTransferDana.data.response_data.list = filterTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListTransferDana(filterTransferDana.data.response_data.list)
        setPendingSettlement(false)
      }
    } catch (error) {
      console.log(error)
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterSettlementButtonHandle(idTransaksi, periode, status) {
    // console.log("ini filter settlement");
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_code": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "tvasettl_status_id":${(status.length !== 0) ? status : 0}, "tvasettl_from":"${(periode.length !== 0) ? periode[0] : ""}", "tvasettl_to":"${(periode.length !== 0) ? periode[1] : ""}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const filterSettlement = await axios.post("/report/GetSettlement", { data: dataParams }, { headers: headers })
      // console.log(filterSettlement, "ini data filter settlement");
      if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
        filterSettlement.data.response_data = filterSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListSettlement(filterSettlement.data.response_data)
      } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
        setUserSession(filterSettlement.data.response_new_token)
        filterSettlement.data.response_data = filterSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setListSettlement(filterSettlement.data.response_data)
      }
    } catch (error) {
      console.log(error)
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status))
    }
  }

  function resetButtonHandle(param) {
    if (param === "Dana Masuk") {
      setInputHandle({
          ...inputHandle,
          idTransaksiDanaMasuk: "",
          namaAgenDanaMasuk: "",
          statusDanaMasuk: "",
      })
      setStateDanaMasuk(null)
      setDateRangeDanaMasuk([])
    } else {
      setInputHandle({
          ...inputHandle,
          idTransaksiSettlement: "",
          statusSettlement: "",
      })
      setStateSettlement(null)
      setDateRangeSettlement([])
    }
  }

  useEffect(() => {
    if (!access_token) {
      // RouteTo("/login")
      history.push('/login');
    }
    getListTransferDana(oneMonthAgo, currentDate)
    getSettlement(oneMonthAgo, currentDate)
    getSettlementChart(oneMonthAgo, currentDate)
  }, [access_token])

  async function detailListTransferHandler(trxId) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvatrans_trx_id":${trxId}}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const detailTransaksi = await axios.post("/Report/GetTransferReportDetail", { data: dataParams }, { headers: headers })
      if (detailTransaksi.status === 200 && detailTransaksi.data.response_code === 200 && detailTransaksi.data.response_new_token.length === 0) {
        setDetailTransferDana(detailTransaksi.data.response_data)
        setShowModalDetailTransferDana(true)
      } else if (detailTransaksi.status === 200 && detailTransaksi.data.response_code === 200 && detailTransaksi.data.response_new_token.length !== 0) {
        setUserSession(detailTransaksi.data.response_new_token)
        setDetailTransferDana(detailTransaksi.data.response_data)
        setShowModalDetailTransferDana(true)
      }
    } catch (error) {
      console.log(error)
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status))
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
    // {
    //   name: 'Action',
    //   width: "230px",
    // //   cell:(row) => 
    // //     <>
    // //     <img alt="" src={DeleteIcon} onClick={() => openDeleteModal(row.partner_id)}/>&nbsp;&nbsp;&nbsp;&nbsp;
    // //     <span style={{color: '#DB1F26', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigateDetailPartner(row.partner_id, true)}>Ubah</span>&nbsp;&nbsp;&nbsp;&nbsp;
    // //     <span style={{color: '#DB1F26', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigateDetailPartner(row.partner_id, false)}>Detail</span>
    // //     </>,
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true
    // }
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
      dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt, Jumlah: data[i].tvasettl_amount, Status: data[i].tvasettl_status_id })
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

  const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [40, 50, 100, 120, 22],
        backgroundColor: [
          '#DF9C43',
          '#077E86',
          '#3DB54A',
          '#2184F7',
          '#FFD600'
        ],
        hoverOffset: 4
      }]
    };

  return (
    <>
      <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
        <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Laporan</span>
        <div className="head-title">
          <h2 className="h4 mt-4">Laporan</h2>
        </div>
        <h2 className="h5 mt-3">Dana Masuk</h2>
        <div className='base-content'>
          <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Dana Masuk dari Agen</span>
            {/* <div className='dana-amount'>
                <div className="card-information mt-3 mb-3" style={{border: '1px solid #EBEBEB', width: 250}}>
                    <p className="p-info">Detail Dana Masuk dari Agen</p>
                    <p className="p-amount">Rp. 49.700.000</p>
                </div>
            </div> */}
            {/* <Row>
              <Col xs={3}>
                <div className="div-chart" style={{width: 350, height: 350}}>
                  <Chart type='pie' data={data} />
                </div>
              </Col>
              <Col xs={9} style={{marginTop: 40}}>
                <table className="report-pie-table">
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td><div className="circle-data" style={{backgroundColor: '#DF9C43'}}></div></td>
                      <td>
                        <span className="p-info" style={{fontSize: 14}}>Agus Dermawan</span><br/>
                        <span className="p-amount" style={{fontSize: 14}}>Rp 8.000.000 ( 20% )</span>
                      </td>
                    </tr>
                    <tr>
                      <td><div className="circle-data" style={{backgroundColor: '#077E86'}}></div></td>
                      <td>
                        <span className="p-info" style={{fontSize: 14}}>Agus </span><br/>
                        <span className="p-amount" style={{fontSize: 14}}>Rp 12.000.000 ( 40% )</span>
                      </td>
                    </tr>
                    <tr>
                      <td><div className="circle-data" style={{backgroundColor: '#3DB54A'}}></div></td>
                      <td>
                        <span className="p-info" style={{fontSize: 14}}>Hery</span><br/>
                        <span className="p-amount" style={{fontSize: 14}}>Rp 8.000.000 ( 20% )</span>
                      </td>
                    </tr>
                    <tr>
                      <td><div className="circle-data" style={{backgroundColor: '#2184F7'}}></div></td>
                      <td>
                        <span className="p-info" style={{fontSize: 14}}>Dermawan</span><br/>
                        <span className="p-amount" style={{fontSize: 14}}>Rp 10.000.000 ( 16% )</span>
                      </td>
                    </tr>
                    <tr>
                      <td><div className="circle-data" style={{backgroundColor: '#FFD600'}}></div></td>
                      <td>
                        <span className="p-info" style={{fontSize: 14}}>Oden</span><br/>
                        <span className="p-amount" style={{fontSize: 14}}>Rp 11.000.000 ( 14% )</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br/>
              </Col>
            </Row> */}
            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span>ID Transaksi</span>
                    <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDanaMasuk} name="idTransaksiDanaMasuk" type='text'className='input-text-ez' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4}>
                    <span>Nama Agen</span>
                    <input onChange={(e) => handleChange(e)} value={inputHandle.namaAgenDanaMasuk} name="namaAgenDanaMasuk" type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/>
                </Col>
                <Col xs={4}>
                    <span>Status</span>
                    <Form.Select name="statusDanaMasuk" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusDanaMasuk} onChange={(e) => handleChange(e)}>
                      <option defaultValue value={0}>Pilih Status</option>
                      <option value={2}>Success</option>
                      <option value={1}>In Progress</option>
                      {/* <option value={3}>Refund</option> */}
                      {/* <option value={4}>Canceled</option> */}
                      <option value={7}>Waiting For Payment</option>
                      {/* <option value={8}>Paid</option> */}
                      <option value={9}>Payment Expired</option>
                      {/* <option value={10}>Withdraw</option> */}
                      {/* <option value={11}>Idle</option> */}
                      {/* <option value={15}>Expected Success</option> */}
                    </Form.Select>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span style={{ marginRight: 20 }}>Periode*</span>
                    <DateRangePicker
                      onChange={pickDateDanaMasuk}
                      value={stateDanaMasuk}
                      clearIcon={null}
                      // calendarIcon={null}
                    />
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={3}>
                    <Row>
                        <Col xs={6}>
                            <button
                              onClick={() => filterTransferButtonHandle(inputHandle.idTransaksiDanaMasuk, inputHandle.namaAgenDanaMasuk, dateRangeDanaMasuk, inputHandle.statusDanaMasuk)}
                              className={(dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              disabled={dateRangeDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.statusDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.namaAgenDanaMasuk.length === 0}
                            >
                              Terapkan
                            </button>
                        </Col>
                        <Col xs={6}>
                            <button
                              onClick={() => resetButtonHandle("Dana Masuk")}
                              className={(dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              disabled={dateRangeDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.statusDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.namaAgenDanaMasuk.length === 0}
                            >
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
        <h2 className="h5 mt-5">Settlement</h2>
        <div className='base-content'>
          <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
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
          /> */}
            {/* <Row>
              <Col xs={12}>
                <div className="div-chart">
                  <Chart type='line' data={data} />
                </div>
              </Col>
            </Row>             */}
            {/* <br/> */}
            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span>ID Transaksi</span>
                    <input name="idTransaksiSettlement" onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlement} type='text'className='input-text-ez' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4}>
                    <span style={{ marginRight: 20 }}>Periode*</span>
                      <DateRangePicker
                        onChange={pickDateSettlement}
                        value={stateSettlement}
                        clearIcon={null}
                        // calendarIcon={null}
                      />
                </Col>
                <Col xs={4}>
                    <span>Status</span>
                    <Form.Select name="statusSettlement" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                      <option defaultValue value={0}>Pilih Status</option>
                      <option value={2}>Success</option>
                      <option value={1}>In Progress</option>
                      <option value={3}>Pending</option>
                      <option value={4}>Failed</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={3}>
                    <Row>
                        <Col xs={6}>
                            <button
                              onClick={() => filterSettlementButtonHandle(inputHandle.idTransaksiSettlement, dateRangeSettlement, inputHandle.statusSettlement)}
                              className={(dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              disabled={dateRangeSettlement.length === 0 || dateRangeSettlement.length === 0 && inputHandle.idTransaksiSettlement.length === 0 || dateRangeSettlement.length === 0 && inputHandle.statusSettlement.length === 0}
                            >
                              Terapkan
                            </button>
                        </Col>
                        <Col xs={6}>
                            <button
                              onClick={() => resetButtonHandle("Settlement")}
                              className={(dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              disabled={dateRangeSettlement.length === 0 || dateRangeSettlement.length === 0 && inputHandle.idTransaksiSettlement.length === 0 || dateRangeSettlement.length === 0 && inputHandle.statusSettlement.length === 0}
                            >
                              Atur Ulang
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
              listSettlement.length !== 0 &&
              <div>
                <Link onClick={() => exportReportSettlementHandler(listSettlement)} className="export-span">Export</Link>
              </div>
            }
            <br/>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columnsSettlement}
                    data={listSettlement}
                    customStyles={customStyles}
                    pagination
                    // highlightOnHover
                    progressPending={pendingSettlement}
                    progressComponent={<CustomLoader />}
                />
            </div>
        </div>
      </div>
      <Modal centered show={showModalDetailTransferDana} onHide={() => setShowModalDetailTransferDana(false)} style={{ borderRadius: 8 }}>
        <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
              <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Detail Transaksi</p>
            </div>
            <div>
              <Container style={{ paddingLeft: "unset", paddingRight: "unset" }}>
                <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400 }}>
                  <Col>ID Transaksi</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>Status</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                  <Col>{detailTransferDana.tvatrans_trx_id}</Col>
                  <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 160, width: "100%", height: 32, background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }}>{detailTransferDana.mstatus_name}</Col>
                  <br />
                </Row>
                <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: -10 }}>{detailTransferDana.tvatrans_crtdt}</div>
                <center>
                  <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                </center>
                <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Detail Pengiriman</div>
                <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                  <Col>Nama Agen</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>ID Agen</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                  <Col>{detailTransferDana.mpartnerdtl_sub_name}</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>{detailTransferDana.mpartnerdtl_partner_id}</Col>
                </Row>
                <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>No VA</div>
                <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>{detailTransferDana.tvatrans_va_number}</div>
                <center>
                  <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                </center>
                <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Rincian Dana</div>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Jumlah Dana Diterima</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_amount)}</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Biaya VA</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_bank_fee)}</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Biaya Partner</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_partner_fee)}</Col>
                </Row>
                <center>
                  <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                </center>
                <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                  <Col>Total</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>{convertToRupiah((detailTransferDana.tvatrans_amount + detailTransferDana.tvatrans_bank_fee + detailTransferDana.tvatrans_partner_fee))}</Col>
                </Row>
              </Container>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Button variant="primary" onClick={() => setShowModalDetailTransferDana(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Oke</Button>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
