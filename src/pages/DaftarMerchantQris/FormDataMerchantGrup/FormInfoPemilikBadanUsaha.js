import React, { useEffect, useRef, useState } from 'react'
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Modal } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import noteIconRed from "../../../assets/icon/note_icon_red.svg"

const FormInfoPemilikBadanUsaha = (props) => {
    const history = useHistory()
    const { profileId } = useParams()
    const hiddenFileInputKtp = useRef(null)
    const [imageFileKtp, setImageFileKtp] = useState(null)
    const [imageKtp, setImageKtp] = useState(null)
    const [nameImageKtp, setNameImageKtp] = useState("")
    const [formatEktp, setFormatEktp] = useState(false)
    const [uploadKtp, setUploadKtp] = useState(false)
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [getDataFirstStep, setGetDataFirstStep] = useState({})

    const [inputHandle, setInputHandle] = useState({
        merchantNou: 0,
        peranPendaftar: 0,
        namaUser: "",
        nomorKtp: "",
        kewarganegaraan: 0,
        noTelp: "",
    })

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: (e.target.name === "peranPendaftar" || e.target.name === "kewarganegaraan") ? Number(e.target.value) : e.target.value
        })
    }

    const handleClickKtp = () => {
        hiddenFileInputKtp.current.click();
    };

    const handleFileChangeKtp = (event) => {
        if ((event.target.files[0].name).slice(-3) === "JPG" || (event.target.files[0].name).slice(-3) === "jpg") {
            setFormatEktp(false)
            if(event.target.files[0]) {
                setImageKtp(event.target.files[0])
                if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                    setUploadKtp(true)
                    setImageFileKtp(null)
                    setNameImageKtp("")
                }
                else {
                    setNameImageKtp(event.target.files[0].name)
                    setUploadKtp(false)
                    const reader = new FileReader()
                    reader.addEventListener("load", () => {
                        setImageFileKtp(reader.result)
                    })
                    reader.readAsDataURL(event.target.files[0])
                }
            }
        } else {
            setFormatEktp(true)
            setUploadKtp(false)
            setNameImageKtp("")
            setImageFileKtp(null)
            setImageKtp(null)
        }
    }

    async function getDataFirstStepInfoPemilikBadanUsaha(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetFirstStepData", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                setInputHandle({
                    ...getData.data.response_data.results, 
                    merchantNou: getData.data.response_data.results.mmerchant_nou,
                    peranPendaftar: getData.data.response_data.results.mprofdtl_register_role === null ? 0 : getData.data.response_data.results.mprofdtl_register_role, 
                    namaUser: getData.data.response_data.results.mprofdtl_name, 
                    nomorKtp: getData.data.response_data.results.mprofdtl_identity_no, 
                    kewarganegaraan: getData.data.response_data.results.mprofdtl_identity_type_id, 
                    noTelp: getData.data.response_data.results.mprofdtl_mobile
                })
                setImageFileKtp(getData.data.response_data.results.mprofdtl_identity_url)
                setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                setGetDataFirstStep(getData.data.response_data.results)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                setInputHandle({
                    ...getData.data.response_data.results, 
                    merchantNou: getData.data.response_data.results.mmerchant_nou,
                    peranPendaftar: getData.data.response_data.results.mprofdtl_register_role === null ? 0 : getData.data.response_data.results.mprofdtl_register_role, 
                    namaUser: getData.data.response_data.results.mprofdtl_name, 
                    nomorKtp: getData.data.response_data.results.mprofdtl_identity_no, 
                    kewarganegaraan: getData.data.response_data.results.mprofdtl_identity_type_id, 
                    noTelp: getData.data.response_data.results.mprofdtl_mobile
                })
                setImageFileKtp(getData.data.response_data.results.mprofdtl_identity_url)
                setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                setGetDataFirstStep(getData.data.response_data.results)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function formDataFirstStepInfoPemilikBadanUsaha(merchantNou, peranPendaftar, namaUser, nomorKtp, kewarganegaraan, noTelp, imageKtp, step, businessType, position, profileId) {
        try {
        console.log(profileId, "profileId");
        const auth = "Bearer " + getToken()
        const formData = new FormData()
        const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "register_type": 101, "user_role": ${peranPendaftar}, "profile_id": ${profileId === undefined ? 0 : profileId}, "email": "", "identity_id": ${kewarganegaraan}, "identity_number": "${nomorKtp}", "user_name": "${namaUser}", "phone_number": "${noTelp}", "grupID": 0, "brandID": 0, "outletID": 0, "step": ${step}, "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": ""}`)
        formData.append('ktpUrl', imageKtp)
        formData.append('SelfieKtpUrl', null)
        formData.append('Data', dataParams)
        const headers = {
            'Content-Type':'multipart/form-data',
            'Authorization' : auth
        }
        const getData = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
        if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
            if (position === "next") {
                console.log("masuk1");
                history.push(`/form-info-usaha-badan-usaha/${getData.data.response_data.mprof_id}`)
            } else {
                console.log("masuk2");
                history.push('/daftar-merchant-qris')
            }
        } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
            setUserSession(getData.data.response_new_token)
            if (position === "next") {
                console.log("masuk1");
                history.push(`/form-info-usaha-badan-usaha/${getData.data.response_data.mprof_id}`)
            } else {
                console.log("masuk2");
                history.push('/daftar-merchant-qris')
            }
        }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function backPage (namaPemilik) {
        if (namaPemilik.length !== 0) {
            setShowModalSimpanData(true)
        } else {
            setShowModalSimpanData(false)
            history.push('/daftar-merchant-qris')
        }
    }

    useEffect(() => {
        if (profileId !== undefined) {
            getDataFirstStepInfoPemilikBadanUsaha(profileId)
        }
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push('/daftar-merchant-qris')} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="d-flex justify-content-start align-items-center head-title"> 
                    <FontAwesomeIcon onClick={() => backPage(inputHandle.namaUser)} icon={faChevronLeft} className="me-3 mt-1" style={{cursor: "pointer"}} />
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
                        <div>Dokumen usaha</div>
                    </div>
                </div>
                <div className='alert-form-info-pemilik py-4'>
                    <img src={alertIconYellow} alt="icon" />
                    <div className='ms-2'>Semua data pada setiap form harus diisi</div>
                </div>
                <div className='base-content my-4'>
                    <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Peran pendaftar</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="direktur"
                                name='peranPendaftar'
                                value={1}
                                checked={inputHandle.peranPendaftar === 1 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="direktur"
                            >
                                Pemilik usaha / Direktur
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="staff"
                                name='peranPendaftar'
                                value={2}
                                checked={inputHandle.peranPendaftar === 2 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="staff"
                            >
                                Staff perwakilan
                            </label>
                        </div>
                    </div>
                    <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Kewarganegaraan pemilik usaha</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="wni"
                                name='kewarganegaraan'
                                value={100}
                                checked={inputHandle.kewarganegaraan === 100 && true}
                                onChange={(e) => handleChange(e)}
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
                                value={101}
                                checked={inputHandle.kewarganegaraan === 101 && true}
                                onChange={(e) => handleChange(e)}
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
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaUser" value={inputHandle.namaUser} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`} pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="nomorKtp" value={inputHandle.nomorKtp} onChange={(e) => handleChange(e)} className='input-text-form' placeholder={`Masukan nomor ${inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`} pemilik`} style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`} pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                    <div className='viewDragDrop mt-2' onClick={handleClickKtp}  style={{cursor: "pointer"}}>
                        {
                            !imageFileKtp ?
                            <>
                                {
                                    formatEktp === true ?
                                    <div className='pt-4 text-center' style={{ color: "#B9121B" }}><span className='me-1'><img src={noteIconRed} alt="" /></span> Format harus .jpg</div> :
                                    <div className='pt-4 text-center'>Masukkan foto {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`}.</div>
                                }
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                            </>
                                :
                            <>
                                <img src={imageFileKtp} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-3'>{nameImageKtp}</div>
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    {
                        uploadKtp && <div className='pt-2' style={{ color: "#B9121B", fontSize: 12, fontFamily: "Nunito" }}><span className='me-2'><img src={noteIconRed} alt="" /></span>Data lebih dari 500kb</div>
                    }
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>No telepon pemilik usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="noTelp" value={inputHandle.noTelp} onChange={(e) => handleChange(e)} type='number' onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} className='input-text-form' placeholder='Masukan no telepon' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div className='text-end mt-4'>
                        <button 
                            className={((inputHandle.peranPendaftar === 1 || inputHandle.peranPendaftar === 2) && (inputHandle.kewarganegaraan === 100 || inputHandle.kewarganegaraan === 101) && inputHandle.namaUser.length !== 0 && inputHandle.nomorKtp.length !== 0 && (imageKtp !== null || imageFileKtp !== null) && inputHandle.noTelp.length !== 0) ? 'btn-next-active mb-4' : 'btn-next-inactive mb-4'}
                            disabled={(inputHandle.peranPendaftar !== 1 && inputHandle.peranPendaftar !== 2) || (inputHandle.kewarganegaraan !== 100 && inputHandle.kewarganegaraan !== 101) || inputHandle.namaUser.length === 0 || inputHandle.nomorKtp.length === 0 || (imageKtp === null && imageFileKtp === null) || inputHandle.noTelp.length === 0}
                            onClick={() => formDataFirstStepInfoPemilikBadanUsaha(inputHandle.merchantNou, inputHandle.peranPendaftar, inputHandle.namaUser, inputHandle.nomorKtp, inputHandle.kewarganegaraan, inputHandle.noTelp, imageKtp, 2, 1, "next", profileId === undefined ? 0 : profileId)}
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>

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
                        <Button onClick={() => setShowModalSimpanData(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                        <Button onClick={() => formDataFirstStepInfoPemilikBadanUsaha(inputHandle.merchantNou, inputHandle.peranPendaftar, inputHandle.namaUser, inputHandle.nomorKtp, inputHandle.kewarganegaraan, inputHandle.noTelp, imageKtp, 1, 1, "back", profileId === undefined ? 0 : profileId)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormInfoPemilikBadanUsaha