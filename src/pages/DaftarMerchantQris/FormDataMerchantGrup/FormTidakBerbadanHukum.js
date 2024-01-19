import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Button, Form, Modal } from '@themesberg/react-bootstrap';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const FormTidakBerbadanHukum = () => {
    const history = useHistory()
    const { idNou } = useParams()
    const [isCheckedConfirm, setIsCheckedConfirm] = useState(false)
    const [isDisableChecked, setIsDisableChecked] = useState(false)
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [getDataFirstStep, setGetDataFirstStep] = useState({})
    const [inputHandle, setInputHandle] = useState({
        namaGrup: "",
        namaUser: "",
        nomorKtp: "",
        email: "",
        noTelp: "",
    })
    const handleChangeCheckBoxConfirm = () => {
        setIsCheckedConfirm(!isCheckedConfirm)
    }

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    async function getDataFirstStepFormTidakBerbadanHukum(merchantNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou":"${merchantNou}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetFirstStepData", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                setInputHandle({...getData.data.response_data.results, namaGrup: getData.data.response_data.results.mmerchant_name, namaUser: getData.data.response_data.results.mprofdtl_name, nomorKtp: getData.data.response_data.results.mprofdtl_identity_no, email: getData.data.response_data.results.mprofdtl_email, noTelp: getData.data.response_data.results.mprofdtl_mobile})
                setGetDataFirstStep(getData.data.response_data.results)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                setInputHandle({...getData.data.response_data.results, namaGrup: getData.data.response_data.results.mmerchant_name, namaUser: getData.data.response_data.results.mprofdtl_name, nomorKtp: getData.data.response_data.results.mprofdtl_identity_no, email: getData.data.response_data.results.mprofdtl_email, noTelp: getData.data.response_data.results.mprofdtl_mobile})
                setGetDataFirstStep(getData.data.response_data.results)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function formDataFirstStepDataTidakBebadanHukum(namaGrup, namaUser, nomorKtp, email, noTelp, step, businessType, position, profileId) {
        const auth = "Bearer " + getToken()
        const formData = new FormData()
        const dataParams = encryptData(`{"user_role": 0, "profile_id": ${profileId}, "email": "${email}", "identity_id": 100, "identity_number": "${nomorKtp}", "user_name": "${namaUser}", "phone_number": "${noTelp}", "grupID": 0, "brandID": 0, "outletID": 0, "step": "${step}", "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": "${namaGrup}"}`)
        formData.append('Data', dataParams)
        const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
        }
        const getData = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
        if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
            if (position === "next") {
                history.push('/pengaturan-merchant')
            } else if (position === "back") {
                history.push('/daftar-merchant-qris')
            }
        } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
            setUserSession(getData.data.response_new_token)
            if (position === "next") {
                history.push('/pengaturan-merchant')
            } else if (position === "back") {
                history.push('/daftar-merchant-qris')
            }
        }
    }

    function backPage () {
        setShowModalSimpanData(true)
    }

    useEffect(() => {
        if (idNou !== undefined) {
            getDataFirstStepFormTidakBerbadanHukum(idNou)
        }
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="d-flex justify-content-start align-items-center head-title"> 
                    <FontAwesomeIcon onClick={() => backPage()} icon={faChevronLeft} className="me-3 mt-1" style={{cursor: "pointer"}} />
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir data merchant</h2>
                </div>
                <div className='alert-form-info-pemilik py-4 mt-3'>
                    <img src={alertIconYellow} alt="icon" />
                    <div className='ms-2'>Semua data pada setiap form harus diisi</div>
                </div>
                <div className='base-content my-4'>
                    <div className='field-form-tidak-berbadan-hukum'>Nama grup</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaGrup" onChange={(e) => handleChange(e)} value={inputHandle.namaGrup} className='input-text-form' placeholder='Masukan nama grup' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Grup'*/ />
                    </div>
                    <div className='field-form-tidak-berbadan-hukum pt-3'>Nama lengkap penanggung jawab</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaUser" onChange={(e) => handleChange(e)} value={inputHandle.namaUser} className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Lengkap'*/ />
                    </div>
                    <div className='field-form-tidak-berbadan-hukum pt-3'>Nomor eKTP penanggung jawab</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="nomorKtp" onChange={(e) => handleChange(e)} value={inputHandle.nomorKtp} className='input-text-form' placeholder='Masukan nomor eKTP' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nomor eKTP'*/ />
                    </div>
                    <div className='field-form-tidak-berbadan-hukum pt-3'>Email</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="email" onChange={(e) => handleChange(e)} value={inputHandle.email} className='input-text-form' placeholder='Masukan email' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Email'*/ />
                    </div>
                    <div className='field-form-tidak-berbadan-hukum pt-3'>No telepon penanggung jawab</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="noTelp" onChange={(e) => handleChange(e)} value={inputHandle.noTelp} className='input-text-form' placeholder='Masukan no telepon' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan No Telepon'*/ />
                    </div>
                    <div className='mb-3 mt-3'>
                        <Form.Check
                            className='form-confirm'
                            label="Saya sebagai pendaftar menyatakan bahwa data diatas adalah benar dan dapat dipertanggungjawabkan"
                            id="statusId"
                            onChange={handleChangeCheckBoxConfirm}
                            checked={isCheckedConfirm}
                            disabled={isDisableChecked}
                        />
                    </div>
                    <div className='text-end mt-4'>
                        <button 
                            className="btn-next-active mb-4"
                            onClick={() => formDataFirstStepDataTidakBebadanHukum(inputHandle.namaGrup, inputHandle.namaUser, inputHandle.nomorKtp, inputHandle.email, inputHandle.noTelp, 2, 3, "next", getDataFirstStep.mprofile_id)}
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
                        <Button onClick={() => formDataFirstStepDataTidakBebadanHukum(inputHandle.namaGrup, inputHandle.namaUser, inputHandle.nomorKtp, inputHandle.email, inputHandle.noTelp, 1, 3, "back", getDataFirstStep.mprofile_id)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormTidakBerbadanHukum