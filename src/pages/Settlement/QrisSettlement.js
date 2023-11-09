import React from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { useState } from 'react'
import $ from 'jquery'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { getRole } from '../../function/helpers'

const QrisSettlement = () => {
    const user_role = getRole()
    const [isSettlementOtomatis, setIsSettlementOtomatis] = useState(true)
    const [isSettlementOtomatisPartner, setIsSettlementOtomatisPartner] = useState(true)
    function disbursementTabs(isTabs){
        setIsSettlementOtomatis(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }
    function pindahHalaman (param) {
        if (param === "otomatis") {
            disbursementTabs(true)
        } else {
            disbursementTabs(false)
        }
    }

    const columnsSettleOtomatis = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu',
            selector: row => row.noHp
        },
        {
            name: 'Tujuan Settlement',
            selector: row => row.IDAgen,
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
            name: 'Bank Tujuan',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Jumlah Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Total Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Total MDR',
            selector: row => row.noRekening,
        },
        {
            name: 'Biaya Admin',
            selector: row => row.noRekening,
        },
        {
            name: 'Nominal Settlement',
            selector: row => row.noRekening,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
    ];

    const columnsSettleManual = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu Pengajuan',
            selector: row => row.noHp
        },
        {
            name: 'Waktu Diterima',
            selector: row => row.noHp
        },
        {
            name: 'Jenis Merchant',
            selector: row => row.noHp
        },
        {
            name: 'Tujuan Settlement',
            selector: row => row.IDAgen,
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
            name: 'Bank Tujuan',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Jumlah Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Total Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Total MDR',
            selector: row => row.noRekening,
        },
        {
            name: 'Biaya Admin',
            selector: row => row.noRekening,
        },
        {
            name: 'Nominal Settlement',
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
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Settlement &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Settlement QRIS</h2>
            </div>
            {
                user_role !== "102" ? (
                    <>
                        <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                            <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("otomatis")} id="detailakuntab">
                                <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Settlement Otomatis</span>
                            </div>
                            <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("manual")} id="konfigurasitab">
                                <span className='menu-detail-akun-span' id="konfigurasispan">Settlement Manual</span>
                            </div>
                        </div>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        {
                            isSettlementOtomatis ? (
                                <div className='base-content mb-4 pb-4'>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>ID Settlement</span>
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
                                    <Row className="mt-4">
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
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Outlet</span>
                                            <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                                <option defaultValue disabled value={0}>Pilih Outlet</option>
                                                <option value={1}>Periode Buat</option>
                                                <option value={2}>Periode Proses</option>
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
                                            columns={columnsSettleOtomatis}
                                            data={agenLists}
                                            customStyles={customStylesDanaMasuk}
                                            highlightOnHover
                                            // progressPending={pendingTransferAdmin}
                                            progressComponent={<CustomLoader />}
                                            // pagination
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='base-content mb-4 pb-4'>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>ID Settlement</span>
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
                                    <Row className="mt-4">
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
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Outlet</span>
                                            <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                                <option defaultValue disabled value={0}>Pilih Outlet</option>
                                                <option value={1}>Periode Buat</option>
                                                <option value={2}>Periode Proses</option>
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
                                            columns={columnsSettleManual}
                                            data={agenLists}
                                            customStyles={customStylesDanaMasuk}
                                            highlightOnHover
                                            // progressPending={pendingTransferAdmin}
                                            progressComponent={<CustomLoader />}
                                            // pagination
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </>
                ) : (
                    <>
                        {
                            isSettlementOtomatisPartner ? (
                                <div className='base-content mt-3'>
                                    <span className='mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Ajukan Settlement QRIS</span>
                                    <div className='mt-3'>Tujuan settlement : <span style={{ fontWeight: 700, fontFamily: "Nunito", fontSize: 14, color: "#383838" }}>Group</span> </div>
                                    <div className="card-information base-content-qris mt-3">
                                        <p style={{ color: "#383838", fontSize: 12 }}>Jumlah saldo</p>
                                        <p className="p-amount" style={{ fontFamily: "Exo" }}>Rp 100.000.000</p>
                                        <p className="mt-2"  style={{ fontFamily: "Nunito", fontSize: 10, color: "#888888" }}>Total keseluruhan saldo semua brand dan outlet</p>
                                    </div>
                                    <Row className='align-items-center'>
                                        <Col xs={2} className='mt-4'>
                                            <div>Rekening Tujuan</div>
                                        </Col>
                                        <Col xs={10} className='mt-4'>
                                            <Form.Select name="channelDirectDebit" className='input-text-user'>
                                                <option defaultChecked disabled value={0}>Pilih rekening tujuan</option>
                                                <option value={36}>OneKlik</option>
                                                <option value={37}>Mandiri</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={2} className='mt-3'>
                                            <div>Nominal Pengajuan</div>
                                        </Col>
                                        <Col xs={10} className='d-flex justify-content-between align-items-center mt-3'>
                                            <Form.Control
                                                type='text'
                                                className='input-text-user'
                                                placeholder='Rp'
                                            />
                                        </Col>
                                        <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                            <div>Biaya settlement</div>
                                            <div className='biaya-settlement-qris'>Rp. 5.000</div>
                                        </Col>
                                        <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                            <div>Total settlement</div>
                                            <div className='saldo-dan-total-settlement'>Rp. 505.000</div>
                                        </Col>
                                        <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                            <div>Sisa saldo</div>
                                            <div className='saldo-dan-total-settlement'>Rp. 9.995.000</div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4 pb-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className='btn-ez-on'
                                                    >
                                                        Ajukan
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                <>
                                </>
                            )
                        }
                        <div className='base-content mt-3'>
                            <Row className='mt-1'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <span>ID Settlement</span>
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
                            <div style={{ marginBottom: 20 }} className='mt-3 d-flex justify-content-between align-items-center'>
                                <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600, color: "#383838" }}>Daftar pengajuan settlement</div>
                                <Link className="export-span">Export</Link>
                            </div>
                            <div className="div-table pb-4">
                                <DataTable
                                    columns={columnsSettleManual}
                                    data={agenLists}
                                    customStyles={customStylesDanaMasuk}
                                    highlightOnHover
                                    // progressPending={pendingTransferAdmin}
                                    progressComponent={<CustomLoader />}
                                    // pagination
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default QrisSettlement