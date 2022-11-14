import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import React from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import {agenLists} from "../../data/tables"
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

const ListRiwayatSubAccount = () => {
    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            width: '60px'

        },
        {
            name: 'ID Referensi',
            selector: row => row.IDAgen,
            width: '120px'
        },
        {
            name: 'Waktu',
            selector: row => row.namaAgen,
            width: '150px'
        },
        {
            name: 'Nama Partner',
            selector: row => row.email,
            width: '160px'
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.noHp,
            width: '170px'
        },
        {
            name: 'Rekening Sub Account',
            selector: row => row.noRekening,
            width: '200px'
        },
        {
            name: 'Nominal',
            selector: row => row.kodeUnik
        },
        {
            name: 'Biaya Admin',
            selector: row => row.status,
            width: '130px'
        },
        {
            name: 'Keterangan',
            selector: row => row.status,
            width: '120px'
        },
    ]

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
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
        <div className="main-content mt-5" style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Transaksi Sub Account</span>
            <div className='head-title'>
                <h2 className="h4 mt-4 mb-4" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Riwayat Transaksi Sub Account Partner</h2>
            </div>
            <div className="base-content mt-3">
                <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                    Filter
                </span>
                <Row className="mt-4">
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <div>ID Referensi</div>
                        <input
                            name="paymentId"
                            type="text"
                            className="input-text-edit"
                            placeholder="Masukkan ID Referensi"
                        />
                    </Col>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <div>Nama Partner</div>
                        <input
                            name="paymentId"
                            type="text"
                            className="input-text-edit"
                            placeholder="Masukkan Nama Agen"
                        />
                    </Col>
                    <Col
                        xs={4}
                        className="d-flex justify-content-start align-items-center"
                    >
                        <div>Periode</div>
                        <Form.Select
                            name="periodePaylink"
                            className="input-text-ez"
                        >
                            <option value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                </Row>
                {/* <Row>
                    <Col xs={4}></Col>
                    <Col xs={4}></Col>
                    <Col xs={4} className='mt-3'>
                        <div>
                            <DateRangePicker
                                clearIcon={null}
                            />
                        </div>
                    </Col>
                </Row> */}
                <Row className='mt-3'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "unset" }}>
                                <button className='btn-ez-on'>
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button className='btn-reset'>
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className='mt-3 mb-5'>
                    <Link to={"#"} className="export-span">Export</Link>
                </div>
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columns}
                        data={agenLists}
                        customStyles={customStyles}
                        // progressPending={pendingSettlement}
                        progressComponent={<CustomLoader />}
                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                        pagination
                    />
                </div>
            </div>
        </div>
    )
}

export default ListRiwayatSubAccount