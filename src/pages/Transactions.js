import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from '@themesberg/react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { invoiceItems } from '../data/tables';
import DataTable from 'react-data-table-component';
import { TransactionsTable } from "../components/Tables";
import { BaseURL, getToken } from "../function/helpers";
import axios from "axios";
import encryptData from "../function/encryptData";
import * as XLSX from "xlsx"

export default () => {

  const history = useHistory();
  const access_token = getToken();
  const [listTransferDana, setListTransferDana] = useState([])
  const [listSettlement, setListSettlement] = useState([])
  // console.log(access_token, 'ini access token');
  async function getListTransferDana() {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"start_time": "2022-01-01", "end_time": "2022-12-30", "sub_name": "", "id": "", "status": ""}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listTransferDana = await axios.post(BaseURL + "/report/transferreport", { data: dataParams }, { headers: headers })
      // console.log(listTransferDana, 'ini data transfer dana');
      listTransferDana.data.response_data.list = listTransferDana.data.response_data.list.map((obj, id) => ({ ...obj, number: id + 1, status: (obj.status === "Success") ? obj.status = "Berhasil" : obj.status = "Gagal" }));
      setListTransferDana(listTransferDana.data.response_data.list)
    } catch (error) {
      console.log(error)
    }
  }

  async function getSettlement() {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_id":0, "tvasettl_status_id":0, "tvasettl_from":"2022-06-10", "tvasettl_to":"2022-06-27"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataSettlement = await axios.post(BaseURL + "/report/GetSettlement", { data: dataParams }, { headers: headers })
      // console.log(dataSettlement, 'ini data settlement');
      dataSettlement.data.response_data = dataSettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1, status: (obj.tvasettl_status_id === 1) ? obj.status = "Berhasil" : obj.status = "Gagal" }));
      setListSettlement(dataSettlement.data.response_data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!access_token) {
      history.push('/sign-in');
    }
    getListTransferDana()
    getSettlement()
  }, [])
  

  const columnstransferDana = [
    {
        name: 'No',
        selector: row => row.number
    },
    {
        name: 'ID Transaksi',
        selector: row => row.id,
        sortable: true
    },
    {
        name: 'Waktu',
        selector: row => row.created_at,
        sortable: true
    },
    {
        name: 'Nama Agen',
        selector: row => row.name,
        sortable: true
    },
    {
        name: 'Total Akhir',
        selector: row => row.amount,
        sortable: true
    },
    {
        name: 'Status',
        selector: row => row.status,
        width: "100px",
        sortable: true,
        style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px 0px", width: "50%", borderRadius: 4 },
        conditionalCellStyles: [
          {
            when: row => row.status === "Berhasil",
            style: { background: "rgba(7, 126, 134, 0.08)", paddingLeft: "unset" }
          },
          {
            when: row => row.status === "Gagal",
            style: { background: "#F0F0F0" }
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
        selector: row => row.number
    },
    {
        name: 'ID Transaksi',
        selector: row => row.tvasettl_id,
        sortable: true
    },
    {
        name: 'Waktu',
        selector: row => row.tvasettl_crtdt,
        sortable: true
    },
    {
        name: 'Jumlah',
        selector: row => row.tvasettl_amount,
        sortable: true
    },
    {
        name: 'Status',
        selector: row => row.status,
        width: "100px",
        sortable: true,
        style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4 },
        conditionalCellStyles: [
          {
            when: row => row.status === "Berhasil",
            style: { background: "rgba(7, 126, 134, 0.08)" }
          },
          {
            when: row => row.status === "Gagal",
            style: { background: "#F0F0F0" }
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

  function exportReportTransferDanaMasukHandler(data) {
    let dataExcel = []
    for (let i = 0; i < data.length; i++) {
      dataExcel.push({ No: i + 1, "ID Transaksi": data[i].id, Waktu: data[i].created_at, "Nama Agen": data[i].name, "Total Akhir": data[i].amount, Status: (data[i].status === "Success") ? "Berhasil" : "Gagal" })
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
    // console.log(listTransferDana, 'ini data transfer dana');
    // console.log(listSettlement, 'ini data settlement');

  return (
    <>
      <div className="main-content" style={{padding: "37px 27px 37px 27px"}}>
        <div className="head-title">
          <h2 className="h4 mt-5">Laporan</h2>
        </div>
        
        <h2 className="h5 mt-5">Dana Masuk</h2>
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
            {/* <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span>ID Transaksi</span>
                    <input type='text'className='input-text-ez' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4}>
                    <span>Nama Agen</span>
                    <input type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/>
                </Col>
                <Col xs={4}>
                    <span>Status</span>
                    <input type='text'className='input-text-ez' placeholder='Pilih Status'/>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span>Periode</span>
                    <input type='text'className='input-text-ez' placeholder='Pilih Periode' style={{marginLeft: 64}}/>
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
            </Row> */}
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
                />
            </div>
        </div>
        <h2 className="h5 mt-5">Settlement</h2>
        <div className='base-content'>
          <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
            {/* <Row>
              <Col xs={12}>
                <div className="div-chart">
                  <Chart type='line' data={data} />
                </div>
              </Col>
            </Row>            
            <br/>
            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
            <Row className='mt-4'>
                <Col xs={4}>
                    <span>ID Transaksi</span>
                    <input type='text'className='input-text-ez' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4}>
                    <span>Periode</span>
                    <input type='text'className='input-text-ez' placeholder='Pilih Periode' style={{marginLeft: 48}}/>
                </Col>
                <Col xs={4}>
                    <span>Status</span>
                    <input type='text'className='input-text-ez' placeholder='Pilih Status'/>
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
            </Row> */}
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
                />
            </div>
        </div>
      </div>
      <div className="table-settings mb-4">

      </div>
    </>
  );
};
