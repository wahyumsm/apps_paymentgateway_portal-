import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteInfo from "../../assets/icon/note_icon.svg"
import { getRole } from '../../function/helpers'
import { Col, Form, Row } from '@themesberg/react-bootstrap'

function DisbursementPage() {

    const user_role = getRole()
    const [isDisbursementManual, setisDisbursementManual] = useState(true)

    function disbursementTabs(isTabs){
        setisDisbursementManual(isTabs)
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

    return (
        <div className='container-content-partner mt-5'>
            <span className='breadcrumbs-span'>{ user_role === "102" ? <Link style={{ cursor: "pointer" }} to={"/laporan"}> Laporan</Link> : <Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link> }  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement</span>
            <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => disbursementTabs(true)} id="detailakuntab">
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Disbursement Manual</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => disbursementTabs(false)} id="konfigurasitab">
                    <span className='menu-detail-akun-span' id="konfigurasispan">Disbursement Bulk</span>
                </div>
            </div>
            {
                isDisbursementManual ?
                    <div id='disbursement-manual'>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        <div className='base-content mb-5'>
                            <span style={{ color: '#383838', width: 'max-content', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)' }}>
                                <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                Pastikan data tujuan Disbursement sudah benar, kesalahan pada data akan berakibat gagalnya proses transaksi Disbursement.
                            </span>
                            <div className='pt-5 pb-5'>
                                <Row className='mb-4'>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Pilih Bank Tujuan*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Pilih Bank"
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Cabang (Khusus Non-BCA)*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukkan Cabang Bank "
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            No. Rekening Tujuan*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukan No. Rekening Tujuan"
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Nama Pemilik Rekening*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukan Nama Pemilik Rekening"
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}></Col>
                                    <Col xs={10} style={{ marginLeft: 155 }}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='mb-3'>
                                                <Form.Check
                                                    label="Simpan ke Daftar Rekening"
                                                    id="statusId"
                                                    // onChange={handleOnChangeCheckBox}
                                                    // checked={isChecked}
                                                />
                                            </div>
                                            <div className='mb-3'>
                                                <button
                                                    style={{
                                                        fontFamily: "Exo",
                                                        fontSize: 14,
                                                        fontWeight: 700,
                                                        alignItems: "center",
                                                        height: 48,
                                                        color: "#077E86",
                                                        background: "unset",
                                                        border: "unset",
                                                        textDecoration: 'underline'
                                                    }}
                                                    // onClick={() => setShowDaftarRekening(true)}
                                                >
                                                    Lihat Daftar Rekening
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Nominal Disbursement*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Rp 0"
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Email Penerima
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukkan Alamat Email Peneima"
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Catatan
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukkan catatan bila perlu"
                                            type='text'
                                            style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                            />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div> :
                    <div id='disbursement-bulk'>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        <div className='base-content'>
                            <span className='head-title'>Profil Perusahaan</span>
                        </div>
                    </div>
            }
        </div>
    )
}

export default DisbursementPage