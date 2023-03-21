import { Col, Form, Image, Row } from '@themesberg/react-bootstrap';
import React from 'react'
import DataTable from 'react-data-table-component';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { agenLists } from '../../data/tables';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"

const RiwayatDirectDebit = () => {
    const columnstransferDana = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.IDAgen
        },
        {
            name: 'Waktu',
            selector: row => row.kodeUnik,
            width: "145px"
        },
        {
            name: 'Nama User',
            selector: row => row.namaAgen,
            width: "160px"
        },
        {
            name: 'No Handphone',
            selector: row => row.noHp,
            width: "170px"
        },
        {
            name: 'Channel Direct Debit',
            selector: row => row.email,
            width: "185px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.noRekening,
            width: "170px"
          },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
            
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                width: '150px'
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
            <span className='breadcrumbs-span' style={{ fontSize: 14 }}>
                <span style={{ cursor: "pointer" }}>
                    Beranda
                </span>{" "}
                <img alt="" src={breadcrumbsIcon} /> &nbsp;
                <span style={{ cursor: "pointer" }}>
                    Transaksi
                </span>{" "} &nbsp;
                <img alt="" src={breadcrumbsIcon} /> &nbsp;
                Direct Debit
            </span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi</h2>
            </div>
            <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Transaksi Direct Debit User</h2>
            <div className='base-content'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <div>Nama User</div>
                        <input
                            type="text"
                            className="input-text-edit"
                            placeholder="Masukkan Nama User"
                        />
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <div>Channel</div>
                        <Form.Select
                            name="periodePaylink"
                            className="input-text-ez"
                        >
                            <option value={0}>Channel Direct Debit</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <div>ID Transaksi</div>
                        <input
                            type="text"
                            className="input-text-edit"
                            placeholder="ID Transaksi"
                        />
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <div>Periode</div>
                        <Form.Select
                            name="periodePaylink"
                            className="input-text-ez"
                        >
                            <option value={0}>Periode Transaksi</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <div>Status</div>
                        <Form.Select name="statusDanaMasuk" className='input-text-ez' style={{ display: "inline" }}>
                        <option defaultChecked value="">Status Transaksi</option>
                        <option value={2}>Berhasil</option>
                        <option value={1}>Dalam Proses</option>
                        <option value={7}>Menunggu Pembayaran</option>
                        <option value={9}>Kadaluwarsa</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                        <button className='btn-ez-on'>
                            Terapkan
                        </button>
                    </Col>
                    <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                        <button className='btn-reset'>
                            Atur Ulang
                        </button>
                    </Col>
                </Row>
                <div className="div-table mt-3">
                    <DataTable
                        columns={columnstransferDana}
                        data={agenLists}
                        customStyles={customStyles}
                        // pagination
                        highlightOnHover
                        progressComponent={<CustomLoader />}
                    />
                </div>
            </div>
        </div>
    )
}

export default RiwayatDirectDebit