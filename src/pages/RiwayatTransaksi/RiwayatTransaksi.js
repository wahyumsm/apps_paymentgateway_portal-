import React from 'react'
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import DataTable from 'react-data-table-component';
import { invoiceItems } from '../../data/tables';
function RiwayatTransaksi() {

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.description,
            sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.price,
            sortable: true,            
            width: "100px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Nama Agen',
            selector: row => row.price,
            sortable: true,
            width: "140px"
        },
        {
            name: 'Jumlah Diterima',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.quantity,
            width: "108px",
            cell:(row) =>
            <>
                {row.quantity === 20 ? <div className='berhasil-status-badge'>Berhasil</div> : <div className='gagal-status-badge'>Gagal</div>}
            </>,
            sortable: true
        },
    ];

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.description,
            sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.price,
            sortable: true,
            width: "100px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Nominal Settlement',
            selector: row => row.price,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Status',
            selector: row => row.quantity,
            width: "108px",
            cell:(row) =>
            <>
                {row.quantity === 20 ? <div className='berhasil-status-badge'>Berhasil</div> : <div className='gagal-status-badge'>Gagal</div>}
            </>,
            sortable: true
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
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>ID Transaksi</span>
                            <input type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>           
                        </Col>
                        <Col xs={4}>
                            <span>Nama Agen</span>
                            <input type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/>                        
                        </Col>
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>Status</span>
                            <Form.Select className="input-text-ez me-4">
                                <option defaultChecked>Status</option>
                                <option value="1">Berhasil</option>
                                <option value="2">Gagal</option>
                            </Form.Select>             
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>Nama Partner</span>
                            <input type='text'className='input-text-ez me-1' placeholder='Masukkan Nama Partner'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>Periode</span>
                            <Form.Select className="input-text-ez me-4">
                                <option defaultChecked>Pilih Periode</option>
                                <option value="1">Hari Ini</option>
                                <option value="2">Kemarin</option>
                                <option value="3">7 Hari Terakhir</option>
                                <option value="3">Bulan Ini</option>
                                <option value="3">Bulan Kemarin</option>
                                <option value="3">Pilih Range Tanggal</option>
                            </Form.Select>
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
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>ID Transaksi</span>
                            <input type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>Nama Partner</span>
                            <input type='text'className='input-text-ez' placeholder='Masukkan Nama Partner'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>Periode</span>
                            <Form.Select className="input-text-ez me-4">
                                <option defaultChecked>Pilih Periode</option>
                                <option value="1">Hari Ini</option>
                                <option value="2">Kemarin</option>
                                <option value="3">7 Hari Terakhir</option>
                                <option value="3">Bulan Ini</option>
                                <option value="3">Bulan Kemarin</option>
                                <option value="3">Pilih Range Tanggal</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                            <span>Status</span>
                            <Form.Select className="input-text-ez me-2">
                                <option defaultChecked>Status</option>
                                <option value="1">Berhasil</option>
                                <option value="2">Gagal</option>
                            </Form.Select>   
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