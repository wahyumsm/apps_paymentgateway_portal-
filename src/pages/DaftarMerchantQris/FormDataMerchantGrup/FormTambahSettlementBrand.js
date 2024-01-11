import React, { useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import { Button, Form, Modal } from '@themesberg/react-bootstrap';
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css'

registerPlugin(FilePondPluginFileEncode)

const FormTambahSettlementBrand = () => {
    const [showModalPemilikRek, setShowModalPemilikRek] = useState(false)
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [showModalUploadDokumen, setShowModalUploadDokumen] = useState(false)

    const [files, setFiles] = useState([])
    const [labelUploadDokumenSettlement, setLabelUploadDokumenSettlement] = useState(`<div class='pt-1 pb-3 mb-2 style-label-drag-drop-settlement-qris text-center'>Taruh file atau dokumen disini <br/> Pilih atau letakkan file Excel kamu disini</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Detail merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah settlement</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir tambah settlement</h2>
            </div>
            <div className='base-content mt-4'>
                <div className='alert-form-info-pemilik py-4 mt-3'>
                    <img src={alertIconYellow} alt="icon" />
                    <div className='ms-2'>Jika tujuan settlement brand yang anda cari tidak ada, kamu harus mendaftarkan brand terlebih dahulu melalui tombol disamping: <span style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, cursor: "pointer", textDecorationLine: "underline" }}>Daftar brand</span></div>
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Brand tujuan</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <Form.Select name='periodeFeeChart' className='input-text-form' placeholder='Pilih kategori usaha'>
                        <option defaultChecked value={0} >Pilih brand tujuan</option>
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
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama bank</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <Form.Select name='periodeFeeChart' className='input-text-form' placeholder='Pilih kategori usaha'>
                        <option defaultChecked value={0} >Pilih bank</option>
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
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor rekening</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="companyName" className='input-text-form' placeholder='Masukan nomor rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik rekening</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="companyName" className='input-text-form' placeholder='Masukan nama rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div className='d-flex justify-content-between align-items-center mt-4' >
                    <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                    <button className='btn-next-info-usaha ms-2'>Konfirmasi</button>
                </div>
            </div>

            <Modal
                size="lg"
                centered
                show={showModalPemilikRek}
                onHide={() => setShowModalPemilikRek(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-info-rekening'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Nama pemilik rekening berbeda dengan nama pemilik usaha, lanjutkan ?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Nama pemilik rekening berbeda dengan nama pemilik usaha yang didaftarkan, mohon periksa kembali sebelum melanjutkan</p>
                    </div>               
                    <div className="d-flex justify-content-center mb-3">
                        <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Ganti pemilik rekening</Button>
                        <Button style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya, Lanjutkan</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalSimpanData}
                onHide={() => setShowModalSimpanData(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-simpan-data-settlement'
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Harap simpan data anda</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Data anda akan terhapus apabila anda keluar tanpa menyimpan data anda</p>
                    </div>             
                    <div className="d-flex justify-content-center mt-2 mb-3">
                        <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                        <Button style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalUploadDokumen}
                onHide={() => setShowModalUploadDokumen(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-simpan-data-settlement'
            >
                <Modal.Header closeButton>
                    <Modal.Title className='title-sub-content-detail-merchant'>Upload dokumen settlement</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div className='mt-2'>
                        <FilePond
                            className="dragdrop"
                            files={files}
                            // onupdatefiles={(newFile) => fileCSV(newFile, listBank, balanceDetail, feeBank)}
                            // onaddfilestart={() => setErrorFound([])}
                            // onaddfile={addFile}
                            // allowMultiple={true}
                            // maxFiles={3}
                            server="/api"
                            name="files"
                            labelIdle={labelUploadDokumenSettlement}
                        />
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <button style={{ width: "100%" }} className='btn-prev-info-usaha'>Sebelumnya</button>
                        <button style={{ width: "100%" }} className='btn-next-info-usaha'>Konfirmasi</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default FormTambahSettlementBrand