import React, { useState } from 'react'
import { Button, Col, Container, Form, Modal, OverlayTrigger, Popover, Row } from '@themesberg/react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import flagIdRoundIcon from '../../../assets/icon/flag_id_round.svg'
import flagEnRoundIcon from '../../../assets/icon/flag_en_round.svg'
import flagRrtRoundIcon from '../../../assets/icon/flag_rrt_round.svg'
import dropdownBlack from '../../../assets/icon/drop_down_black.svg'
import alertIconGrey from '../../../assets/icon/alert_icon_grey.svg'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css'
import chevronLeft from '../../../assets/icon/chevron_left.svg'
import settlementOtomatis from '../../../assets/icon/settlement-otomatis.svg'
import requestManual from '../../../assets/icon/request-manual.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";

registerPlugin(FilePondPluginFileEncode)

const PengaturanMerchant = () => {
    const [tabJenisUsaha, setTabJenisUsaha] = useState("settlementOtomatis")
    const [tabTujuanTransfer, setTabTujuanTransfer] = useState("rekeningGrup")
    const history = useHistory()
    const location = useLocation();
    const dataProfile = location.state;
    console.log(dataProfile);

    const [showModalSyaratKetentuan, setShowModalSyaratKetentuan] = useState(false)

    function buttonColor (param) {
        setTabJenisUsaha(param)
    }

    function buttonColorPilihTujuanTf (param) {
        setTabTujuanTransfer(param)
    }

    function toProsesVerifikasi () {
        history.push('/verification-process')
        window.location.reload()
    }

    function showModalSubmit () {
        setShowModalSyaratKetentuan(true)
    }

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Pengaturan merchant</h2>
                </div>
                <div className='base-content mt-3'>
                    <div className='text-setting '>Jenis settlement</div>
                    <div className='d-flex justify-content-between align-items-center mt-2'>
                        <div className={tabJenisUsaha === "settlementOtomatis" ? 'card-when-click mb-3 me-1' : 'card-jenis-usaha mb-3 me-1'} onClick={() => buttonColor("settlementOtomatis")} id='usahaPerorangan'>
                            <img src={settlementOtomatis} alt='qris' />
                            <div className='text-start'>
                                <div className='card-text-title'>Settlement otomatis</div>
                                <div className='card-text-subtitle'>Settlement dilakukan H+1 secara otomatis setiap jam 08:00-15:00 WIB selama hari kerja.</div>
                            </div>
                        </div>
                        <div className={tabJenisUsaha === "requestManual" ? 'card-when-click mb-3 ms-1' : 'card-jenis-usaha mb-3 ms-1'} onClick={() => buttonColor("requestManual")} id='badanUsaha'>
                            <img src={requestManual} alt='qris' />
                            <div className='text-start'>
                                <div className='card-text-title'>Request manual</div>
                                <div className='card-text-subtitle'>Settlement baru akan dilakukan saat merchant melakukan request melalui aplikasi / dashboard.</div>
                            </div>
                        </div>
                    </div>
                    <div className='text-setting '>Tujuan transfer settlement</div>
                    <div className='d-flex justify-content-start align-items-center mt-2'>
                        <div className={tabTujuanTransfer === "rekeningGrup" ? 'card-tujuan-transfer-when-click me-1' : 'card-tujuan-transfer-no-click me-1'} onClick={() => buttonColorPilihTujuanTf("rekeningGrup")}>Rekening grup</div>
                        <div className={tabTujuanTransfer === "rekeningBrand" ? 'card-tujuan-transfer-when-click me-1' : 'card-tujuan-transfer-no-click me-1'} onClick={() => buttonColorPilihTujuanTf("rekeningBrand")}>Rekening brand</div>
                        <div className={tabTujuanTransfer === "rekeningOutlet" ? 'card-tujuan-transfer-when-click' : 'card-tujuan-transfer-no-click'} onClick={() => buttonColorPilihTujuanTf("rekeningOutlet")}>Rekening outlet</div>
                    </div>
                    <div className='desc-setting mt-4'>
                        <div><img src={alertIconGrey} alt="alert" /></div>
                        <div className='ms-2'>
                            • Settlement dilakukan dengan pendapatan transaksi minimal Rp 50.000 <br/>
                            • Settlement hanya dilakukan tiap hari dan jam kerja, Senin - Jum’at pukul 08.00 WIB - 15.00 WIB <br/>
                            • Tiap Settlement dikenakan biaya admin sebesar Rp 5.000
                        </div>
                    </div>
                    <div className='text-setting mt-3'>QRIS anda mau menerima pembayaran dari Alipay dan WeChatPay ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inlineCheckbox1"
                                // checked={
                                //     edited === true
                                //     ? fitur[0] &&
                                //         fitur.includes(item.fitur_name)
                                //     : fitur.includes(item.fitur_name)
                                // }
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inlineCheckbox1"
                            >
                                Ya
                            </label>
                        </div>
                        <div className="form-check form-check-inline ms-4">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inlineCheckbox1"
                                // checked={
                                //     edited === true
                                //     ? fitur[0] &&
                                //         fitur.includes(item.fitur_name)
                                //     : fitur.includes(item.fitur_name)
                                // }
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inlineCheckbox1"
                            >
                                Tidak
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Apakah ingin melakukan integrasi dengan API ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inlineCheckbox1"
                                // checked={
                                //     edited === true
                                //     ? fitur[0] &&
                                //         fitur.includes(item.fitur_name)
                                //     : fitur.includes(item.fitur_name)
                                // }
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inlineCheckbox1"
                            >
                                Ya
                            </label>
                        </div>
                        <div className="form-check form-check-inline ms-4">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inlineCheckbox1"
                                // checked={
                                //     edited === true
                                //     ? fitur[0] &&
                                //         fitur.includes(item.fitur_name)
                                //     : fitur.includes(item.fitur_name)
                                // }
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inlineCheckbox1"
                            >
                                Tidak
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Pilih Partner</div>
                    <Form.Select name="statusDisbursement" className='input-text-user mt-2' style={{ display: "inline" }} >
                        <option defaultChecked value="">Pilih Partner</option>
                        <option value={2}>Berhasil</option>
                        <option value={1}>Dalam Proses</option>
                        <option value={4}>Gagal</option>
                    </Form.Select>
                    <div className='d-flex justify-content-between align-items-center mt-4' >
                        <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                        <button className='btn-next-info-usaha ms-2' onClick={() => showModalSubmit()}>Konfirmasi</button>
                    </div>
                </div>
            </div>

            <Modal
                    size="lg"
                    centered
                    show={showModalSyaratKetentuan}
                    onHide={() => setShowModalSyaratKetentuan(false)}
                    style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                    className='modal-syarat-ketentuan'
                >
                    <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Syarat dan Ketentuan</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "start", marginTop: 20, marginBottom: 8 }}>
                            <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-start">nulla. Egestas consectetur etiam dolor augue morbi cursus eget non consequat. Natoque nunc odio enim proin a lectus.</p>
                        </div>
                        <div className='my-1 merchant-modal-text'>Merchant registration Ezeelink</div>
                        <div className='my-1 merchant-modal-text'>Merchant Ezeelink</div>
                        <div className='my-2'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Seluruh transaksi saya tidak terkait pencucian uang dan pendanaan terorisme"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                            />
                        </div>
                        <div className='my-2'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Saya memastikan bahwa seluruh data yang saya isi adalah benar"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                            />
                        </div>
                        <div className='my-2'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Seluruh informasi transaksi akan dikirim ke nomor telepon dan/atau email yang didaftarkan"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                                />
                        </div>
                        <div className='text-desc-modal'>Vitae quam bibendum at sit urna libero nulla aliquam. Amet netus velit feugiat neque auctor. Sed ut velit posuere a. Morbi fringilla ac turpis sit at massa integer integer faucibus. Semper nunc eu quis </div>
                        <div className='mb-3 mt-3'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Saya telah membaca dan menyetujui semua syarat dan ketentuan diatas"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                            />
                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                            <Button style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }} onClick={() => toProsesVerifikasi()}>Submit data saya</Button>
                        </div>
                    </Modal.Body>
                </Modal>
        </>
    )
}

export default PengaturanMerchant