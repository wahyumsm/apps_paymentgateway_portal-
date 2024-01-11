import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css'
import { Form } from '@themesberg/react-bootstrap';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';

registerPlugin(FilePondPluginFileEncode)

const FormInfoPemilikPerseorangan = () => {
    const history = useHistory()
    const location = useLocation();
    const dataJenisUsaha = location.pathname;
    console.log(dataJenisUsaha, "dataJenisUsaha");
    console.log(location, "location");
    const [files, setFiles] = useState([])
    const [inputHandle, setInputHandle] = useState({
        numberId: "",
        userName: "",
        phoneNumber: "",
        grupId: 0,
        brandId: 0,
        outletId: 0,
        step: 1,
        businessType: 1,
        userId: 0,
        merchantName: ""
    })
    
    const [kewarganegaraan, setKewarganegaraan] = useState("1")
    const handleOnChangeCheckBoxKewarganegaraan = (e) => {
        setKewarganegaraan(e.target.value);
    };

    const [labelUploadKtp, setLabelUploadKtp] = useState(`<div class='pt-1 pb-3 mb-2 style-label-drag-drop text-center'>Masukan foto eKTP pemilik. <br/><br/> Maks ukuran satu file: 500kb, Format: .jpg</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)

    const [labelUploadSelfie, setLabelUploadSelfie] = useState(`<div class='pt-1 pb-3 mb-2 style-label-drag-drop text-center'>Masukan foto eKTP perwakilan. <br/><br/> Maks ukuran satu file: 500kb, Format: .jpg</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)

    const [labelUploadSKitas, setLabelUploadSKitas] = useState(`<div class='pt-1 pb-3 mb-2 style-label-drag-drop text-center'>Masukan foto KITAS pemilik. <br/><br/> Maks ukuran satu file: 500kb, Format: .jpg</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)

    function toInfoUsaha () {
        history.push('/form-info-usaha-perseorangan')
        window.location.reload()
    }

    async function formInfoPemilikPeroranganHandler(id, namaAgen, emailAgen, phoneNumber, bankName, akunBank, rekeningOwner, active, nominal) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_id":"${id}", "agen_name":"${namaAgen}", "agen_email":"${emailAgen}", "agen_mobile":"${phoneNumber}", "agen_bank_id":"${bankName}", "agen_bank_number":"${akunBank}", "agen_bank_name":"${rekeningOwner}", "status":"${active}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const editAgen = await axios.post(BaseURL + "/Agen/UpdateAgen", { data: dataParams }, { headers: headers })
            if (editAgen.status === 200 && editAgen.data.response_code === 200 && editAgen.data.response_new_token.length === 0) {
            } else if (editAgen.status === 200 && editAgen.data.response_code === 200 && editAgen.data.response_new_token.length !== 0) {
                setUserSession(editAgen.data.response_new_token)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir data merchant</h2>
                </div>
                <div className='pb-4 pt-3'>
                    <div className='d-flex justify-content-start align-items-center' style={{ marginLeft: 25, marginRight: 25 }}>
                        <div style={{ borderRadius: "50%", width: 15, height: 15, background: "#077E86" }}></div>
                        <div style={{ width: "100%", height: 4, background: "#F0F0F0" }}></div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-2' style={{ fontSize: 12, color: "#383838", fontFamily: "Nunito" }}>
                        <div>Info pemilik</div>
                        <div>Info usaha</div>
                    </div>
                </div>
                <div className='alert-form-info-pemilik py-4'>
                    <img src={alertIconYellow} alt="icon" />
                    <div className='ms-2'>Semua data pada setiap form harus diisi</div>
                </div>
                <div className='base-content my-4'>
                    <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Kewarganegaraan pemilik usaha</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="wni"
                                name='kewarganegaraan'
                                value={"1"}
                                checked={kewarganegaraan === "1" && true}
                                onChange={(e) => handleOnChangeCheckBoxKewarganegaraan(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="wni"
                            >
                                Warga Negara Indonesia
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="wna"
                                name='kewarganegaraan'
                                value={"2"}
                                checked={kewarganegaraan === "2" && true}
                                onChange={(e) => handleOnChangeCheckBoxKewarganegaraan(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="wna"
                            >
                                Warga Negara Asing
                            </label>
                        </div>
                    </div>
                    {
                        kewarganegaraan === "2" ? (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai KITAS</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="companyName" className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor KITAS pemilik usaha</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="companyName" className='input-text-form' placeholder='Masukan nomor KTP pemilik' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto KITAS pemilik usaha</div>
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
                                        labelIdle={labelUploadSKitas}
                                    />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Selfie dengan KITAS</div>
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
                                        labelIdle={labelUploadKtp}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai eKTP</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="companyName" className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor eKTP pemilik usaha</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="companyName" className='input-text-form' placeholder='Masukan nomor eKTP pemilik' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto eKTP pemilik usaha sesuaI</div>
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
                                        labelIdle={labelUploadKtp}
                                    />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Selfie dengan eKTP</div>
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
                                        labelIdle={labelUploadKtp}
                                    />
                                </div>
                            </>
                        )
                    }
                    <div className='text-end mt-3'>
                        <button onClick={() => toInfoUsaha()} className='btn-next mb-4'>Selanjutnya</button>
                    </div>
                </div>
                <div className='pt-3'></div>
            </div>
        </>
    )
}

export default FormInfoPemilikPerseorangan