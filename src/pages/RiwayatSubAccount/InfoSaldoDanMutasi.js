import React from 'react'
import { useHistory } from 'react-router-dom'
import { getRole } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import SubAccountComponent from '../../components/SubAccountComponent'
import { Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import iconMata from "../../assets/icon/toggle_mata_icon.svg"
import DataTable from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { agenLists } from '../../data/tables'
import { useState } from 'react'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

const InfoSaldoDanMutasi = () => {
    const history = useHistory()
    const user_role = getRole()
    const [showSaldoSubAcc, setShowSaldoSubAcc] = useState(false)

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/laporan");
    }

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            width: '60px'
        },
        {
            name: 'ID Referensi',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nominal',
            selector: row => row.kodeUnik
        },
        {
            name: 'Keterangan',
            selector: row => row.status,
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
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Sub Account Bank &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Info Saldo & Mutasi</span> 
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Info Saldo & Mutasi</div>
            </div>
            {/* <SubAccountComponent/> */}
            <div className='base-content-custom px-3 pt-4 pb-4' style={{ width: "38%" }}>
                <div className="mb-3">Pilih Akun</div>
                <Form.Select>
                    <option defaultChecked disabled value="">Pilih Status</option>
                    <option value={2}>Agung Sejahtera ( Partner )</option>
                    <option value={1}>Agung Sejahtera ( Partner )</option>
                </Form.Select>
                <div className='p-3 mt-3' style={{ border: "1px solid #EBEBEB", borderRadius: 8 }}>
                    <div style={{ fontSize: 14, fontFamily: "Nunito", color: "#888888" }}>Saldo Rekening Sub Account</div>
                    <div className='d-flex justify-content-start align-items-center mt-2' style={{ cursor: "pointer" }} onClick={() => setShowSaldoSubAcc(true)}>
                        <img src={iconMata} alt="mata" />
                        <div className='ms-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 16, color: "#077E86", textDecoration: "underline" }}>Klik Untuk Lihat Saldo</div>
                    </div>
                    <div className='mt-3' style={{ border:"1px solid #C4C4C4", backgroundColor: "#C4C4C4" }} />
                    <div className='mt-3' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>No Rekening Sub Account : </div>
                    <div className='mt-2' style={{ fontSize: 12, fontFamily: "Nunito", color: "#383838" }}>12345678912 a.n Agung Sejahtera</div>
                </div>
            </div>
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Mutasi Rekening Sub Account</div>
            </div>
            <div className="base-content mt-3">
                <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                    Filter
                </span>
                <Row className="mt-4">
                    <Col
                        xs={4}
                        className="d-flex justify-content-between align-items-center"
                    >
                        <div>Periode</div>
                        <Form.Select
                            name="periodePaylink"
                            className="input-text-sub"
                        >
                            <option value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    {/* <Col xs={4} className='d-flex justify-content-center align-items-center'>
                        <div>
                            <DateRangePicker
                                // onChange={pickDateDanaMasuk}
                                // value={stateDanaMasuk}
                                clearIcon={null}
                                showDoubleView={true}
                                showFixedNumberOfWeeks={true}
                                selectRange={true}
                                closeCalendar={true}
                                format={'dd-MM-y'}
                                className="datePicker"
                            />
                        </div>
                    </Col> */}
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Jenis Transaksi</span>
                        <Form.Select name='fiturDanaMasuk' className='input-text-ez' style={{ display: "inline" }}>
                            <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                            <option value={104}>Payment Link</option>
                            <option value={100}>Virtual Account</option>
                        </Form.Select>
                    </Col>
                </Row>
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
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columns}
                        data={agenLists}
                        customStyles={customStyles}
                        // progressPending={pendingSettlement}
                        progressComponent={<CustomLoader />}
                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                    />
                </div>
            </div>

            <Modal className="history-modal" size="xs" centered show={showSaldoSubAcc} onHide={() => setShowSaldoSubAcc(false)}>
                <Modal.Title className="mt-4 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 24, fontWeight: 700 }}>
                    Saldo Rekening Sub Account 
                </Modal.Title>
                <Modal.Body>
                    <div className='text-center' style={{ fontSize: 14, fontWeight: 400, color: "#383838", fontFamily: "Nunito" }}>Nominal Saldo Saat Ini</div>
                    <div className='text-center mt-2' style={{ fontSize: 12, fontWeight: 400, color: "#888888", fontFamily: "Nunito" }}>06 Juli 2022 11:46 WIB</div>
                    <div className='text-center mt-3' style={{color: "#077E86", fontSize: 20, fontFamily: "Exo", fontWeight: 700 }}>Rp200.000.000</div>
                    <div className='text-center mt-3' style={{color: "#888888", fontSize: 12, fontFamily: "Nunito", fontWeight: 400 }}>No. Rekening: 12345679093 a.n Agung Sejahtera</div>
                    <div className='px-5'>
                        <button
                            onClick={() => setShowSaldoSubAcc(false)}
                            className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                            style={{
                                width: "100%",
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #383838",
                                borderRadius: 6,
                            }}
                        >
                            Oke
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default InfoSaldoDanMutasi