import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteInfo from "../../assets/icon/note_icon.svg"
import downloadIcon from "../../assets/icon/download_icon.svg"
import { getRole } from '../../function/helpers'
import { Button, Col, Form, Modal, Row } from '@themesberg/react-bootstrap'

function DisbursementPage() {

    const user_role = getRole()
    const [isDisbursementManual, setisDisbursementManual] = useState(true)
    const [openModalPanduan, setOpenModalPanduan] = useState(false)

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
        <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
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
                !isDisbursementManual ?
                    <div id='disbursement-manual'>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        <div className='base-content mb-5'>
                            <span style={{ color: '#383838', width: 'max-content', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)' }}>
                                <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                Pastikan data tujuan Disbursement sudah benar, kesalahan pada data akan berakibat gagalnya proses transaksi Disbursement.
                            </span>
                            <div className='pt-5 pb-5'>
                                <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Pilih Bank Tujuan*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Pilih Bank"
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Cabang (Khusus Non-BCA)*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukkan Cabang Bank "
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            No. Rekening Tujuan*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukan No. Rekening Tujuan"
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Nama Pemilik Rekening*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukan Nama Pemilik Rekening"
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={2}></Col>
                                    <Col xs={10}>
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
                                <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Nominal Disbursement*
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Rp 0"
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Email Penerima
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukkan Alamat Email Peneima"
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                                <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                    <Col xs={2}>
                                        <span style={{ fontFamily: "Nunito" }}>
                                            Catatan
                                        </span>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Control
                                            placeholder="Masukkan catatan bila perlu"
                                            type='text'
                                            className='input-text-user'
                                            />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div> :
                    <div id='disbursement-bulk'>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        <div className='base-content pb-5 mb-5'>
                            <div className='pb-5' style={{ fontFamily: "Nunito", fontSize: 14 }}>
                                <span>Perhatikan panduan pengisian template untuk menghindari kesalahan: <span onClick={() => setOpenModalPanduan(true)} style={{ fontFamily: "Exo", fontWeight: 700, color: "#077E86", cursor: "pointer" }}>Lihat Panduan</span></span>
                                <div className="d-flex justify-content-end align-items-start" style={{ marginTop: -25 }} >
                                    <button 
                                        className='btn-reset'
                                        style={{ width: '25%' }} 
                                        onClick={() => alert("Download berhasil")}
                                    >
                                        <img src={downloadIcon} width="25" height="25" alt="download_icon" style={{ marginRight: 7 }} />
                                        Download Template
                                    </button>
                                </div>
                            </div>
                            <div style={{ maxWidth: 1550, height: 172, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(7, 126, 134, 0.04)', border: '1px dashed #077E86', borderRadius: 8 }}>
                                <div>Pilih atau letakkan file Excel (*.csv) kamu di sini.</div>
                                <div>Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <button
                                    // onClick={() => setOpenModalPanduan(false)}
                                    className="my-3"
                                    style={{
                                        fontFamily: "Exo",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        padding: "0px 24px",
                                        width: 136,
                                        height: 45,
                                        background: "#FFFFFF",
                                        borderRadius: 8,
                                        color: '#077E86',
                                        border: "0.4px solid #077E86"
                                    }}
                                >
                                    Upload File
                                </button>
                            </div>
                        </div>
                    </div>
            }
            <Modal className="panduan-modal" size="xl" centered show={openModalPanduan} onHide={() => setOpenModalPanduan(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setOpenModalPanduan(false)}
                    />
                </Modal.Header>
                <Modal.Title className="mt-4 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Panduan Pengisian Disbursement Bulk 
                </Modal.Title>
                <Modal.Body style={{ fontFamily: "Nunito", fontSize: 14 }}>
                    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <div className='mb-4' style={{ display: 'flex',alignItems: "center", backgroundColor: 'rgba(255, 214, 0, 0.16)' }}>
                            <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginLeft: 10 }} />
                            <div style={{ flexWrap: 'wrap', color: '#383838', width: 'fit-content', padding: '14px 25px 14px 14px', fontStyle: 'italic' }}>
                                Harap perhatikan panduan pengisian sebelum melakukan penginputan data pada template yang disediakan. Kesalahan penulisan data dapat menyebabkan gagalnya transaksi disbursement.
                            </div>
                        </div>
                        <table>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>1.</td>
                                <td>File yang diunggah wajib dalam format Excel *.csv, dan tidak dapat menggunakan format lain</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>2.</td>
                                <td>File yang diunggah wajib menggunakan template file Excel yang telah disediakan, tidak bisa membuat format Excel sendiri</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>3.</td>
                                <td>Dilarang mengubah atau menambahkan nama sheet, nama tabel, urutan tabel dan tipe data tabel. Mengubah nama file diperbolehkan sesuai kebutuhan</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>4.</td>
                                <td>Bank Tujuan diisi dengan menuliskan nama bank sesuai dengan daftar bank tujuan disbursement yang telah disediakan pada file berikut : Download File Daftar Bank Tujuan</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>5.</td>
                                <td>Cabang diisi khusus untuk tujuan bank selain BCA, dan wajib diisi. Apabila bank yang dipilih adalah BCA maka isi dengan tanda ‘-’ (Strip)</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>6.</td>
                                <td>Nomor Rekening Tujuan diisi sesuai format rekening bank tujuan. Isi menggunakan format angka dan harap perhatikan digit rekening</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>7.</td>
                                <td>Nama Pemilik Rekening wajib diisi dengan benar dan sesuai.</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>8.</td>
                                <td>Nominal Disbursement diisi dalam format Rupiah. Jika nominal merupakan bilangan desimal, maka penulisan tanda koma diganti dengan tanda titik. Contoh: 5500,68 ditulis 5500.68</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>9.</td>
                                <td>Email Penerima bersifat opsional dan dapat diisi untuk mengirim notifikasi berhasil Disburse</td>
                            </tr>
                            <tr>
                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5 }}>10.</td>
                                <td>Catatan dapat diisi bila diperlukan dan bersifat opsional dan maksimal 25 karakter (termasuk spasi). Hanya diperbolehkan menggunakan karakter spesial berupa tanda @, &, dan #.</td>
                            </tr>
                        </table>
                        <div className='mt-4 mb-2' style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                onClick={() => setOpenModalPanduan(false)}
                                className="mx-2"
                                style={{
                                    fontFamily: "Exo",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    padding: "0px 24px",
                                    width: 136,
                                    height: 45,
                                    background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                    border: "0.6px solid #2C1919",
                                    borderRadius: 6,
                                }}
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DisbursementPage