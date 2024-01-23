import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, OverlayTrigger, Popover, Row } from '@themesberg/react-bootstrap'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import flagIdRoundIcon from '../../../assets/icon/flag_id_round.svg'
import flagEnRoundIcon from '../../../assets/icon/flag_en_round.svg'
import flagRrtRoundIcon from '../../../assets/icon/flag_rrt_round.svg'
import dropdownBlack from '../../../assets/icon/drop_down_black.svg'
import alertIconGrey from '../../../assets/icon/alert_icon_grey.svg'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css'
import chevronDown from '../../../assets/icon/chevron_down_icon.svg'
import settlementOtomatis from '../../../assets/icon/settlement-otomatis.svg'
import requestManual from '../../../assets/icon/request-manual.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";

registerPlugin(FilePondPluginFileEncode)

const PengaturanMerchant = () => {
    const { idProfile } = useParams()
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

    useEffect(() => {
        if (idProfile !== undefined) {
            // getDataAddBrandStepFormTidakBerbadanHukum(idProfile)
        }
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambah Brand</h2>
                </div>
                <div className='base-content mt-3'>
                    <div className="head-title"> 
                        <h2 className="h5" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Settlement</h2>
                    </div>
                    <div className='text-setting mt-4'>Jenis settlement</div>
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
                        <div className={tabJenisUsaha === "requestSameDay" ? 'card-when-click mb-3 ms-1' : 'card-jenis-usaha mb-3 ms-1'} onClick={() => buttonColor("requestManual")} id='badanUsaha'>
                            <img src={requestManual} alt='qris' />
                            <div className='text-start'>
                                <div className='card-text-title'>Request Same Day</div>
                                <div className='card-text-subtitle'>Settlement dilakukan secara otomatis dan akan langsung diproses dihari yang sama.</div>
                            </div>
                        </div>
                    </div>
                    <div className='desc-setting'>
                        <div><img src={alertIconGrey} alt="alert" /></div>
                        <div className='ms-2'>
                            • Settlement dilakukan dengan pendapatan transaksi minimal Rp 50.000 <br/>
                            • Settlement otomatis reguler dan Settlement manual dikenakan biaya admin sebesar <b> Rp 5.000. </b> <br/>
                            • Settlement otomatis reguler dan Settlement manual hanya dilakukan tiap hari dan jam kerja, <b> Senin - Jum'at </b> pukul <b> 08.00 WIB - 15.00 WIB. </b> <br/>
                            • Settlement otomatis same day akan dilakukan setiap hari dan jam kerja, pukul <b> 13.00 WIB. </b> <br/>
                            • Settlement otomatis same day akan memproses setiap transaksi yang dilakukan dibawah pukul <b> 12.00 WIB, </b> Jika melewati itu akan diproses di esok <br/> <span className='ms-2'>harinya.</span>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Jenis fee settlement same day</div>
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
                                Fixed
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
                                Persentase
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Jumlah fee settlement same day</div>
                    <div className='d-flex justify-content-start align-items-center mt-2'>
                        <input className='input-text-user' style={{ width: "20%" }} placeholder='Rp 0' />
                        <div className='ms-3 text-setting'>Per Settlement</div>
                    </div>
                    <div className='text-setting mt-3'>Kemana settlement akan dikirimkan ?</div>
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
                                Rekening Brand
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
                                Rekening Outlet
                            </label>
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

                    <div className="head-title"> 
                        <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambahan Lainnya</h2>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4' style={{ cursor: "pointer" }}>
                        <div style={{ fontFamily: "Exo", fontSize: 14, fontWeight: 700 }}>Program Affiliator</div>
                        <div className='me-3'><img src={chevronDown} alt=""/></div>
                    </div>
                    <div className='text-setting mt-3'>Komisi agen (Afiliator)</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <Form.Select name='periodeFeeChart' className='input-text-form' placeholder='Nama agen 1'>
                            <option defaultChecked value={0} >Nama agen 1</option>
                            <option value={0}>Makanan dan minuman</option>
                            <option value={0}>Obat-obatan</option>
                            <option value={0}>Supermarket/minimarket</option>
                            <option value={0}>Toko serba ada (toserba)</option>
                            <option value={0}>Retail</option>
                            <option value={0}>Department Store</option>
                            <option value={0}>Buku dan alat tulis</option>
                            <option value={0}>Lainnya </option>
                        </Form.Select>
                    </div>
                    <div className='text-setting mt-3'>Jenis komisi</div>
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
                                Fixed
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
                                Persentase
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Jumlah komisi</div>
                    <div className='d-flex justify-content-start align-items-center mt-2'>
                        <input className='input-text-user' style={{ width: "20%" }} placeholder='Rp 1.000' />
                        <div className='ms-3 text-setting'>Per Transaksi</div>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mt-4' style={{ cursor: "pointer" }}>
                        <div style={{ fontFamily: "Exo", fontSize: 14, fontWeight: 700 }}>Program Cashback</div>
                        <div className='me-3'><img src={chevronDown} alt=""/></div>
                    </div>
                    <div className='text-setting mt-3'>Apakah ingin mengadakan program Cashback MDR ?</div>
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
                    <div className='text-setting mt-3'>Jenis Cashback</div>
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
                                Fixed
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
                                Persentase
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Jumlah cashback</div>
                    <div className='d-flex justify-content-start align-items-center mt-2'>
                        <input className='input-text-user' style={{ width: "20%" }} placeholder='Rp 0' />
                        <div className='ms-3 text-setting'>Per Transaksi</div>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mt-4' style={{ cursor: "pointer" }}>
                        <div style={{ fontFamily: "Exo", fontSize: 14, fontWeight: 700 }}>Additional Fee</div>
                        <div className='me-3'><img src={chevronDown} alt=""/></div>
                    </div>
                    <div className='text-setting mt-3'>Apakah ingin mengadakan Additional Fee ?</div>
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
                    <div className='text-setting mt-3'>Jenis additional fee</div>
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
                                Fixed
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
                                Persentase
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>Jumlah additional fee</div>
                    <div className='d-flex justify-content-start align-items-center mt-2'>
                        <input className='input-text-user' style={{ width: "20%" }} placeholder='Rp 0' />
                        <div className='ms-3 text-setting'>Per Transaksi</div>
                    </div>
                    <div className='text-setting mt-3'>Kode Referral</div>
                    <input className='input-text-user mt-2' placeholder='Masukkan kode referral' />

                    <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
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