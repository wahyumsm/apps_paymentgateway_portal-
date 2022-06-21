import React from 'react'
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import DataTable from 'react-data-table-component';
import { invoiceItems } from '../../data/tables';
function RiwayatTransaksi() {

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
            name: 'Nama Partner',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Nama Agen',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Jumlah Diterima',
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

    const columnsSettl = [
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
            name: 'Nama Partner',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Nominal Settlement',
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

  return (
    <div className="py-4 content-page">
        <div className='head-title'>
            <h2 className="h5 mb-2 mt-4">Riwayat Transaksi</h2>
        </div>
        <div className='main-content'>
            <div className='riwayat-dana-masuk-div mt-5'>
                <span className='mt-4' style={{fontWeight: 600}}>Riwayat Dana Masuk</span>
                <div className='base-content mt-3'>
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
                            <span>Nama Partner</span>
                            <input type='text'className='input-text-ez' placeholder='Masukkan Nama Partner'/>
                        </Col>
                        <Col xs={4}>
                            <span>Periode</span>
                            <input type='text'className='input-text-ez' placeholder='Pilih Periode' style={{marginLeft: 48}}/>
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
                    <div className="div-table mt-6">
                        <DataTable
                            columns={columns}
                            data={invoiceItems}
                            customStyles={customStyles}
                            pagination
                        />
                    </div>
                </div>
            </div>
            <div className='riwayat-settlement-div mt-5'>
                <span className='mt-4' style={{fontWeight: 600}}>Riwayat Settlement</span>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4}>
                            <span>ID Transaksi</span>
                            <input type='text'className='input-text-ez' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                        </Col>
                        <Col xs={4}>
                            <span>Nama Partner</span>
                            <input type='text'className='input-text-ez' placeholder='Masukkan Nama Partner'/>
                        </Col>
                        <Col xs={4}>
                            <span>Periode</span>
                            <input type='text'className='input-text-ez' placeholder='Pilih Periode'/>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4}>
                            <span>Status</span>
                            <input type='text'className='input-text-ez' placeholder='Pilih Status' style={{marginLeft: 65}}/>
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
                            <p className="p-amount">Rp. 50.700.000</p>
                        </div>
                    </div>
                    <div className="div-table mt-6">
                        <DataTable
                            columns={columnsSettl}
                            data={invoiceItems}
                            customStyles={customStyles}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RiwayatTransaksi