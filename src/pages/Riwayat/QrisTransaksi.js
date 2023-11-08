import React from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"

const QrisTransaksi = () => {
    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.IDAgen,
        },
        {
            name: 'RRN',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu',
            selector: row => row.noHp
        },
        {
            name: 'Jenis Usaha',
            selector: row => row.email,
        },
        {
            name: 'Nama Grup',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nama Brand',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nama Outlet',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nama Kasir',
            selector: row => row.namaAgen,
        },
        {
            name: 'ID Kasir',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Potongan MDR',
            selector: row => row.noRekening,
        },
        {
            name: 'Pendapatan',
            selector: row => row.noRekening,
        },
        {
            name: 'Status',
            selector: row => row.status,
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
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Transaksi &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS</h2>
            </div>
            <div className='base-content mt-3'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>ID Transaksi</span>
                        <input name="idTransaksiDanaMasukAdmin" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Periode</span>
                        <Form.Select name='periodeDanaMasukAdmin' className="input-text-riwayat ms-3">
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span className="me-4">RRN</span>
                        <input name="idTransaksiDanaMasukAdmin" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Jenis Usaha</span>
                        <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Jenis Usaha</option>
                            <option value={1}>Periode Buat</option>
                            <option value={2}>Periode Proses</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Nama Grup</span>
                        <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Grup</option>
                            <option value={1}>Periode Buat</option>
                            <option value={2}>Periode Proses</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Nama Brand</span>
                        <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Brand</option>
                            <option value={1}>Periode Buat</option>
                            <option value={2}>Periode Proses</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Nama Outlet</span>
                        <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Outlet</option>
                            <option value={1}>Periode Buat</option>
                            <option value={2}>Periode Proses</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>ID Kasir</span>
                        <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Kasir</option>
                            <option value={1}>Periode Buat</option>
                            <option value={2}>Periode Proses</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Status</span>
                        <Form.Select name="statusDanaMasukAdmin" className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                            <option defaultChecked disabled value="">Pilih Status</option>
                            <option value={2}>Berhasil</option>
                            <option value={1}>Dalam Proses</option>
                            <option value={7}>Menunggu Pembayaran</option>
                            <option value={9}>Kadaluwarsa</option>
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
                <div style={{ marginBottom: 30 }} className='mt-3'>
                    <Link className="export-span">Export</Link>
                </div>
                <div className="div-table mt-5 pb-4">
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

export default QrisTransaksi