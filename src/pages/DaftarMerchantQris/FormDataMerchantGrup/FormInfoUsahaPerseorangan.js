import React, { useState } from 'react'
import { Col, Form, Row } from '@themesberg/react-bootstrap'
import { useHistory } from 'react-router-dom'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";

registerPlugin(FilePondPluginFileEncode)

const FormInfoUsahaPerseorangan = () => {
    const history = useHistory()
    const [files, setFiles] = useState([])
    const [labelUploadFotoTempatUsaha, setLabelUploadFotoTempatUsaha] = useState(`<div class='pt-1 pb-3 mb-2 style-label-drag-drop text-center'>Masukan foto tempat usaha. <br/><br/> Maks: 3 foto, Maks ukuran satu file: 500kb</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)

    const data = [
        { id: "100", name: "Info pemilik" },
        { id: "101", name: "Info usaha" },
        { id: "102", name: "Info rekening" }
    ];

    function toInfoRekening () {
        history.push('/form-account-info')
        window.location.reload()
    }

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir Usaha Perorangan</h2>
                </div>
                <div className='pb-4 pt-3'>
                    <div className='d-flex justify-content-start align-items-center' style={{ marginLeft: 25, marginRight: 25 }}>
                        <div style={{ width: "100%", height: 4, background: "linear-gradient(90deg, #80D8DE 30.14%, #229299 67.94%, #077E86 100%)" }}></div>
                        <div style={{ borderRadius: "50%", width: 15, height: 15, background: "#077E86" }}></div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-2' style={{ fontSize: 12, color: "#383838", fontFamily: "Nunito" }}>
                        <div>Info pemilik</div>
                        <div>Info usaha</div>
                    </div>
                </div>
                <div className='base-content mt-3'>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama perusahaan</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="companyName" className='input-text-form' placeholder='Masukan nama perusahaan' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama brand/toko</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="companyName" className='input-text-form' placeholder='Masukan nama brand/toko' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kategori usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <Form.Select name='periodeFeeChart' className='input-text-form' placeholder='Pilih kategori usaha'>
                            <option defaultChecked value={0} >Pilih kategori usaha</option>
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
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Jumlah kasir (counter pembayaran)</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center' style={{ width:"7%" }}>
                        <input name="companyName" className='input-text-form' placeholder='0' type='number' min={0} max={2500} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Pendapatan pertahun</div>
                    <div className='d-flex justify-content-between align-items-center py-2' style={{ width: 442 }}>
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
                                {`< Rp 300 juta`}
                            </label>
                        </div>
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
                                Rp 300 juta - Rp 2,5 miliar
                            </label>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center py-2' style={{ width: 365 }}>
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
                                Rp 2,5 miliar - Rp 50 miliar
                            </label>
                        </div>
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
                                {`> Rp 50 miliar`}
                            </label>
                        </div>
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Alamat usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <textarea name="companyName" className='input-text-form' placeholder='cth: jln. nama jalan no.01 RT.001 RW 002' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 100, padding: 12 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kode pos</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative pe-3' style={{ width: "50%" }}>
                        <Form.Select name='periodeFeeChart' className='input-text-form' placeholder='Pilih kategori usaha'>
                            <option defaultChecked value={0} >Masukkan kode pos</option>
                            <option value={0}>Makanan dan minuman</option>
                            <option value={0}>Obat-obatan</option>
                            <option value={0}>Supermarket/minimarket</option>
                        </Form.Select>
                    </div>
                    <div className='mt-1' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>Harus sesuai dengan kelurahan pada alamat anda</div>
                    <Row className='pt-3'>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Provinsi</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <Form.Select name='periodeFeeChart' className='input-text-form'>
                                    <option defaultChecked disabled value={0} >Masukkan kode pos</option>
                                </Form.Select>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Kabupaten/kota</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <Form.Select name='periodeFeeChart' className='input-text-form'>
                                    <option defaultChecked disabled value={0} >Masukkan kode pos</option>
                                </Form.Select>
                            </div>
                        </Col>
                    </Row>
                    <Row className='pt-3'>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kecamatan</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <Form.Select name='periodeFeeChart' className='input-text-form'>
                                    <option defaultChecked disabled value={0} >Masukkan kode pos</option>
                                </Form.Select>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kelurahan</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <Form.Select name='periodeFeeChart' className='input-text-form'>
                                    <option defaultChecked disabled value={0} >Masukkan kode pos</option>
                                </Form.Select>
                            </div>
                        </Col>
                    </Row>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Jenis Toko <span style={{ fontFamily: "Nunito", fontSize: 12 }}>(bisa pilih lebih dari 1)</span></div>
                    <div className='pt-2 d-flex justify-content-start align-items-center'>
                        <Form.Check
                            className='form-confirm'
                            label="Toko Fisik"
                            id="statusId"
                            // onChange={handleChangeCheckBoxConfirm}
                            // checked={isCheckedConfirm}
                        />
                        <Form.Check
                            className='form-confirm ms-3'
                            label="Toko Online"
                            id="statusId"
                            // onChange={handleChangeCheckBoxConfirm}
                            // checked={isCheckedConfirm}
                        />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto tempat usaha</div>
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
                            labelIdle={labelUploadFotoTempatUsaha}
                        />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838", paddingTop: 60 }} >Link / Website toko</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="companyName" className='input-text-form' placeholder='Masukan link / website toko' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: "Nunito", fontSize: 14 }} className='pt-3'>Sudah pernah mendaftar QRIS sebelumnya ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
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
                                Tidak
                            </label>
                        </div>
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>NMID</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="companyName" className='input-text-form' placeholder='Masukan NMID' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div className='mt-1' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>Minimal 13 digit angka</div>
                   <div>
                   <div className='d-flex justify-content-between align-items-center mt-4' >
                        <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                        <button className='btn-next-info-usaha ms-2' onClick={() => toInfoRekening()}>Selanjutnya</button>
                    </div>
                   </div>
                </div>
                <div className='pt-3'></div>
            </div>
        </>
    )
}

export default FormInfoUsahaPerseorangan