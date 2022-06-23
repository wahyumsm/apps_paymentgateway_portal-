import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from '@themesberg/react-bootstrap';
import {Link} from 'react-router-dom';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { invoiceItems } from '../data/tables';
import DataTable from 'react-data-table-component';
import { TransactionsTable } from "../components/Tables";

export default () => {

    const columns = [
      {
          name: 'No',
          selector: row => row.id
      },
      {
          name: 'ID Transaksi',
          selector: row => row.description,
          sortable: true
      },
      {
          name: 'Waktu',
          selector: row => row.price,
          sortable: true
      },
      {
          name: 'Nama Agen',
          selector: row => row.price,
          sortable: true
      },
      {
          name: 'Total Akhir',
          selector: row => row.price,
          sortable: true
      },
      {
          name: 'Status',
          selector: row => row.quantity,
          width: "100px",
          cell:(row) =>
          <>
              {row.partner_status === 1 ? <div className='active-status-badge'>Active</div> : <div className='inactive-status-badge'>Inactive</div>}
          </>,
          sortable: true
      },
      {
        name: 'Action',
        width: "230px",
      //   cell:(row) => 
      //     <>
      //     <img alt="" src={DeleteIcon} onClick={() => openDeleteModal(row.partner_id)}/>&nbsp;&nbsp;&nbsp;&nbsp;
      //     <span style={{color: '#DB1F26', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigateDetailPartner(row.partner_id, true)}>Ubah</span>&nbsp;&nbsp;&nbsp;&nbsp;
      //     <span style={{color: '#DB1F26', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigateDetailPartner(row.partner_id, false)}>Detail</span>
      //     </>,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true
      }
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
      <div className="main-content" style={{padding: "37px 27px 37px 27px"}}>
        <div className="head-title">
          <h2 className="h4 mt-5">Laporan</h2>
        </div>
        
        <h2 className="h5 mt-5">Dana Masuk</h2>
        <div className='base-content'>
            <div className='dana-amount'>
                <div className="card-information mt-3 mb-3" style={{border: '1px solid #EBEBEB', width: 250}}>
                    <p className="p-info">Detail Dana Masuk dari Agen</p>
                    <p className="p-amount">Rp. 49.700.000</p>
                </div>
            </div>
            <Row>
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
            </Row>
            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
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
            </Row>
            <div>
              <Link className="export-span">Export</Link>
            </div>
            <br/>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columns}
                    data={invoiceItems}
                    customStyles={customStyles}
                    pagination
                />
            </div>
        </div>
        <h2 className="h5 mt-5">Settlement</h2>
        <div className='base-content'>
        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
            <Row>
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
            </Row>
            <div>
              <Link className="export-span">Export</Link>
            </div>
            <br/>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columns}
                    data={invoiceItems}
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
