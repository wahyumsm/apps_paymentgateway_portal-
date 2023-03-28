import { Button, Col, Container, Form, Image, Modal, Row } from '@themesberg/react-bootstrap';
import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { agenLists } from '../../data/tables';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { getRole } from '../../function/helpers';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const RiwayatDirectDebit = () => {
    const user_role = getRole()
    const [showModalDetailDirectDebit, setShowModalDetailDirectDebit] = useState(false)
    const [openDetailFee, setOpenDetailFee] = useState(false)

    const showCheckboxes = () => {
        if (!openDetailFee) {
          setOpenDetailFee(true);
        } else {
          setOpenDetailFee(false);
        }
      };

    const columnPartner = [
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
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4, fontFamily: "Nunito", fontSize: 14, fontWeight: 600 },
            conditionalCellStyles: [
                {
                    when: row => row.status === "Aktif",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status === "Tidak Aktif",
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
                }
            ],
        },
    ];

    const columnAdmin = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.IDAgen,
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => setShowModalDetailDirectDebit(true)}>{row.IDAgen}</Link>
        },
        {
            name: 'Waktu',
            selector: row => row.kodeUnik,
            width: "80px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.kodeUnik,
            width: "150px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.namaAgen,
            width: "160px"
        },
        {
            name: 'Nama User',
            selector: row => row.namaAgen,
            width: "160px"
        },
        {
            name: 'Channel Direct Debit',
            selector: row => row.email,
            width: "185px"
        },
        {
            name: 'No Handphone',
            selector: row => row.noHp,
            width: "170px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => row.noRekening,
            width: "170px"
        },
        {
            name: 'Biaya Admin',
            selector: row => row.noRekening,
            width: "170px"
        },
        {
            name: 'Biaya Bank',
            selector: row => row.noRekening,
            width: "170px"
        },
        {
            name: 'Biaya Pajak',
            selector: row => row.noRekening,
            width: "170px"
        },
        {
            name: 'Total Akhir',
            selector: row => row.noRekening,
            width: "170px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4, fontFamily: "Nunito", fontSize: 14, fontWeight: 600 },
            conditionalCellStyles: [
                {
                    when: row => row.status === "Aktif",
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status === "Tidak Aktif",
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
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
                    {user_role === "102" ? `Laporan` : `Beranda`}
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
            <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>{user_role === "102" ? `Transaksi Direct Debit User` : `Transaksi Direct Debit Partner`}</h2>
            <div className='base-content'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                {
                    user_role === "102" ? (
                        <>
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
                                        <option value={2}>One Klik</option>
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
                            <div className='mt-3 mb-5'>
                                <Link to={"#"} className='export-span' style={{ textDecoration: "underline", color: "#077E86" }} >Export</Link>
                            </div>
                            <div className="div-table mt-3">
                                <DataTable
                                    columns={columnPartner}
                                    data={agenLists}
                                    customStyles={customStyles}
                                    // pagination
                                    highlightOnHover
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama Partner</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Nama Partner"
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama User</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Nama User"
                                    />
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
                                    <div>Partner Trans ID</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Partner Trans ID"
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Channel</div>
                                    <Form.Select
                                        name="periodePaylink"
                                        className="input-text-ez"
                                    >
                                        <option value={0}>Channel Direct Debit</option>
                                        <option value={2}>One Klik</option>
                                    </Form.Select>
                                </Col>
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
                            </Row>
                            <Row className='mt-3'>
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
                            <div className='mt-3 mb-5'>
                                <Link to={"#"} className='export-span' style={{ textDecoration: "underline", color: "#077E86" }} >Export</Link>
                            </div>
                            <div className="div-table mt-3">
                                <DataTable
                                    columns={columnAdmin}
                                    data={agenLists}
                                    customStyles={customStyles}
                                    // pagination
                                    highlightOnHover
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <Modal centered show={showModalDetailDirectDebit} onHide={() => setShowModalDetailDirectDebit(false)} style={{ borderRadius: 8 }}>
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
                                                <Col>123456</Col>
                                                <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 175, width: "100%", height: 32, fontWeight: 400,
                                                    background: "rgba(7, 126, 134, 0.08)",
                                                    color: "#077E86" }}
                                                >
                                                    Berhasil
                                                </Col>
                                                <br />
                                            </Row>
                                            <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: -10 }}>18:13, 18/18/2022</div>
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                                            </center>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Detail Pengiriman</div>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                                                <Col>Nama User</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>No Handphone User</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>Agung Wirawan</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>+62 878 9230 0922</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                                                <Col>Nama Partner</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>ID Partner</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>PT ABCDE</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>12333</Col>
                                            </Row>
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                                            </center>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Rincian Dana</div>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Nominal Transaksi</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 12.000.000</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Channel Direct Debit</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 2.770</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Total Biaya</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>
                                                    {
                                                        openDetailFee ? (
                                                            <div className='d-flex justify-content-center align-items-center' onClick={showCheckboxes} style={{ cursor: "pointer" }}>
                                                                <div>Rp 5.000</div>
                                                                <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                                                            </div>
                                                        ) : (
                                                            <div className='d-flex justify-content-center align-items-center' onClick={showCheckboxes} style={{ cursor: "pointer" }}>
                                                                <div>Rp 5.000</div>
                                                                <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                                                            </div>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            {
                                                openDetailFee && (
                                                    <div style={{ background: "rgba(196, 196, 196, 0.12)", borderRadius: 4, padding: 8 }} className='mt-2'>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Admin</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 2.000</Col>
                                                        </Row>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Bank</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 3.000</Col>
                                                        </Row>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Pajak</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>Rp 0</Col>
                                                        </Row>
                                                    </div>
                                                )
                                            }
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                                            </center>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                                                <Col>Total</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>Rp 12.0270.000</Col>
                                            </Row>
                                        </Container>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                        <Button variant="primary" onClick={() => setShowModalDetailDirectDebit(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Kembali</Button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default RiwayatDirectDebit