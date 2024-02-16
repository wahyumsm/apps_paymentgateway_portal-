import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import 'filepond/dist/filepond.min.css'
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from '@themesberg/react-bootstrap';

const FormInfoPemilikPerseorangan = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [getDataFirstStep, setGetDataFirstStep] = useState({})

    const hiddenFileInputKtp = useRef(null)
    const [imageFileKtp, setImageFileKtp] = useState(null)
    const [imageKtp, setImageKtp] = useState(null)
    const [nameImageKtp, setNameImageKtp] = useState("")
    const [uploadKtp, setUploadKtp] = useState(false)

    const hiddenFileInputSelfieKtp = useRef(null)
    const [imageFileSelfieKtp, setImageFileSelfieKtp] = useState(null)
    const [imageSelfieKtp, setImageSelfieKtp] = useState(null)
    const [nameImageSelfieKtp, setNameImageSelfieKtp] = useState("")
    const [uploadSelfieKtp, setUploadSelfieKtp] = useState(false)
    console.log(imageKtp, "imageKtp");
    console.log(nameImageKtp, "nameImageKtp");
    console.log(imageFileKtp, "imageFileKtp");
    console.log(imageSelfieKtp, "imageSelfieKtp");
    console.log(nameImageSelfieKtp, "nameImageSelfieKtp");
    console.log(imageFileSelfieKtp, "imageFileSelfieKtp");
    console.log(uploadKtp, "uploadKtp");
    const [inputHandleWni, setInputHandleWni] = useState({
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
    const [inputHandleWna, setInputHandleWna] = useState({
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
    
    const [kewarganegaraan, setKewarganegaraan] = useState(100)
    const handleOnChangeCheckBoxKewarganegaraan = (e) => {
        setKewarganegaraan(Number(e.target.value));
    };

    function handleChange(e, param) {
        if (param === 100) {
            setInputHandleWni({
                ...inputHandleWni,
                [e.target.name] : e.target.value
            })
        } else {
            setInputHandleWna({
                ...inputHandleWna,
                [e.target.name] : e.target.value
            })
        }
    }

    const handleClickKtp = () => {
        hiddenFileInputKtp.current.click();
    };

    const handleFileChangeKtp = (event) => {
        if(event.target.files[0]) {
            setImageKtp(event.target.files[0])
            setNameImageKtp(event.target.files[0].name)
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setUploadKtp(true)
                setImageFileKtp(imageFileKtp)
            }
            else {
                setUploadKtp(false)
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    setImageFileKtp(reader.result)
                })
                reader.readAsDataURL(event.target.files[0])
            }
        }
    }

    const handleClickSelfieKtp = () => {
        hiddenFileInputSelfieKtp.current.click();
    };

    const handleFileChangeSelfieKtp = (event) => {
        if(event.target.files[0]) {
            setImageSelfieKtp(event.target.files[0])
            setNameImageSelfieKtp(event.target.files[0].name)
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setUploadSelfieKtp(true)
                setImageFileSelfieKtp(imageFileSelfieKtp)
            }
            else {
                setUploadSelfieKtp(false)
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    console.log(reader.result, "reader.result");
                    setImageFileSelfieKtp(reader.result)
                })
                reader.readAsDataURL(event.target.files[0])
            }
        }
    }

    async function getDataFirstStepInfoPemilikPerorangan(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetFirstStepData", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (getData.data.response_data.results.mprofdtl_identity_type_id === 100) {
                    setInputHandleWni({...getData.data.response_data.results, userName: getData.data.response_data.results.mprofdtl_name, numberId: getData.data.response_data.results.mprofdtl_identity_no})
                } else {
                    setInputHandleWna({...getData.data.response_data.results, userName: getData.data.response_data.results.mprofdtl_name, numberId: getData.data.response_data.results.mprofdtl_identity_no})
                }
                setKewarganegaraan(getData.data.response_data.results.mprofdtl_identity_type_id)
                setImageFileKtp(getData.data.response_data.results.mprofdtl_identity_url)
                setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                setImageFileSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_url)
                setNameImageSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_file_name)
                setGetDataFirstStep(getData.data.response_data.results)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (getData.data.response_data.results.mprofdtl_identity_type_id === 100) {
                    setInputHandleWni({...getData.data.response_data.results, userName: getData.data.response_data.results.mprofdtl_name, numberId: getData.data.response_data.results.mprofdtl_identity_no})
                } else {
                    setInputHandleWna({...getData.data.response_data.results, userName: getData.data.response_data.results.mprofdtl_name, numberId: getData.data.response_data.results.mprofdtl_identity_no})
                }
                setKewarganegaraan(getData.data.response_data.results.mprofdtl_identity_type_id)
                setImageFileKtp(getData.data.response_data.results.mprofdtl_identity_url)
                setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                setImageFileSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_url)
                setNameImageSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_file_name)
                setGetDataFirstStep(getData.data.response_data.results)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    console.log(getDataFirstStep, "getDataFirstStep");

    async function formDataFirstStepInfoPemilikPerorangan(kewarganegaraan, profileId, numberKtp, nameUser, imageKtp, imageFileKtp, nameImageKtp, imageSelfieKtp, imageFileSelfieKtp, nameImageSelfieKtp, step, businessType, merchantName, position) {
        try {
            console.log(imageFileKtp, "imageFileKtp");
            console.log(nameImageKtp, "nameImageKtp");
            console.log(imageSelfieKtp, "imageSelfieKtp");
            if (imageKtp === null) {
                console.log("masuk1");
                if (imageSelfieKtp === null) {
                    console.log("masuk11");
                    const auth = "Bearer " + getToken()
                    const formData = new FormData()
                    const dataParams = encryptData(`{"user_role": 0, "profile_id": ${profileId}, "email": "", "identity_id": ${kewarganegaraan}, "identity_number": "${numberKtp}", "user_name": "${nameUser}", "phone_number": "", "grupID": 0, "brandID": 0, "outletID": 0, "step": ${step}, "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": "${merchantName}"}`)
                    formData.append('ktpUrl', null)
                    formData.append('SelfieKtpUrl', null)
                    formData.append('Data', dataParams)
                    const headers = {
                        'Content-Type':'multipart/form-data',
                        'Authorization' : auth
                    }
                    const saveFirstStep = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
                    if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token === null) {
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    } else if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token !== null) {
                        setUserSession(saveFirstStep.data.response_new_token)
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    }
                } else {
                    console.log("masuk12");
                    const auth = "Bearer " + getToken()
                    const formData = new FormData()
                    const dataParams = encryptData(`{"user_role": 0, "profile_id": ${profileId}, "email": "", "identity_id": ${kewarganegaraan}, "identity_number": "${numberKtp}", "user_name": "${nameUser}", "phone_number": "", "grupID": 0, "brandID": 0, "outletID": 0, "step": ${step}, "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": "${merchantName}"}`)
                    formData.append('ktpUrl', null)
                    formData.append('SelfieKtpUrl', imageSelfieKtp)
                    formData.append('Data', dataParams)
                    const headers = {
                        'Content-Type':'multipart/form-data',
                        'Authorization' : auth
                    }
                    const saveFirstStep = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
                    if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token === null) {
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    } else if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token !== null) {
                        setUserSession(saveFirstStep.data.response_new_token)
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    }
                }
            } else {
                console.log("masuk2");
                if (imageSelfieKtp === null) {
                    console.log("masuk21");
                    const auth = "Bearer " + getToken()
                    const formData = new FormData()
                    const dataParams = encryptData(`{"user_role": 0, "profile_id": ${profileId}, "email": "", "identity_id": ${kewarganegaraan}, "identity_number": "${numberKtp}", "user_name": "${nameUser}", "phone_number": "", "grupID": 0, "brandID": 0, "outletID": 0, "step": ${step}, "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": "${merchantName}"}`)
                    formData.append('ktpUrl', imageKtp)
                    formData.append('SelfieKtpUrl', null)
                    formData.append('Data', dataParams)
                    const headers = {
                        'Content-Type':'multipart/form-data',
                        'Authorization' : auth
                    }
                    const saveFirstStep = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
                    if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token === null) {
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    } else if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token !== null) {
                        setUserSession(saveFirstStep.data.response_new_token)
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    }
                } else {
                    console.log("masuk22");
                    const auth = "Bearer " + getToken()
                    const formData = new FormData()
                    const dataParams = encryptData(`{"user_role": 0, "profile_id": ${profileId}, "email": "", "identity_id": ${kewarganegaraan}, "identity_number": "${numberKtp}", "user_name": "${nameUser}", "phone_number": "", "grupID": 0, "brandID": 0, "outletID": 0, "step": ${step}, "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": "${merchantName}"}`)
                    formData.append('ktpUrl', imageKtp)
                    formData.append('SelfieKtpUrl', imageSelfieKtp)
                    formData.append('Data', dataParams)
                    const headers = {
                        'Content-Type':'multipart/form-data',
                        'Authorization' : auth
                    }
                    const saveFirstStep = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
                    if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token === null) {
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    } else if (saveFirstStep.status === 200 && saveFirstStep.data.response_code === 200 && saveFirstStep.data.response_new_token !== null) {
                        setUserSession(saveFirstStep.data.response_new_token)
                        if (profileId === 0) {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        } else {
                            if (position === "next") {
                                history.push(`/form-info-usaha-perorangan/${profileId}`)
                            } else if (position === "back") {
                                history.push('/daftar-merchant-qris')
                            }
                        }
                    }
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function backPage () {
        setShowModalSimpanData(true)
    }

    useEffect(() => {
        if (profileId !== undefined) {
            getDataFirstStepInfoPemilikPerorangan(profileId)
        }
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push('/daftar-merchant-qris')} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="d-flex justify-content-start align-items-center head-title"> 
                    <FontAwesomeIcon onClick={() => backPage()} icon={faChevronLeft} className="me-3 mt-1" style={{cursor: "pointer"}} />
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
                                value={100}
                                checked={kewarganegaraan === 100 && true}
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
                                value={101}
                                checked={kewarganegaraan === 101 && true}
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
                        kewarganegaraan === 101 ? (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai KITAS</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="userName" value={inputHandleWna.userName} onChange={(e) => handleChange(e, 101)} className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor KITAS pemilik usaha</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="numberId" value={inputHandleWna.numberId} onChange={(e) => handleChange(e, 101)} className='input-text-form' placeholder='Masukan nomor KITAS pemilik' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto KITAS pemilik usaha</div>
                                <div className='viewDragDrop  mt-2' onClick={handleClickKtp} style={{cursor: "pointer"}}>
                                    {
                                        !imageFileKtp ?
                                        <>
                                            <div className='pt-4 text-center'>Masukkan foto KITAS.</div>
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
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Selfie dengan KITAS</div>
                                <div className='viewDragDrop  mt-2' onClick={handleClickSelfieKtp} style={{cursor: "pointer"}}>
                                    {
                                        !imageFileSelfieKtp ?
                                        <>
                                            <div className='pt-4 text-center'>Masukan foto selfie dengan KITAS.</div>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeSelfieKtp}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputSelfieKtp}
                                                id="image"
                                                name="image"
                                            />
                                        </>
                                         :
                                        <>
                                            <img src={imageFileSelfieKtp} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                            <input
                                                type="file"
                                                onChange={handleFileChangeSelfieKtp}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputSelfieKtp}
                                                id="image"
                                                name="image"
                                            />
                                            <div className='mt-2 ms-3'>{nameImageSelfieKtp}</div>
                                        </>
                                    }
                                    <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg</div>
                                    <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai eKTP</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="userName" value={inputHandleWni.userName} onChange={(e) => handleChange(e, 100)} className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor eKTP pemilik usaha</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="numberId" value={inputHandleWni.numberId} onChange={(e) => handleChange(e, 100)} className='input-text-form' placeholder='Masukan nomor eKTP pemilik' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto eKTP pemilik usaha sesuai</div>
                                <div className='viewDragDrop  mt-2' onClick={handleClickKtp} style={{cursor: "pointer"}}>
                                    {
                                        !imageFileKtp ?
                                        <>
                                            <div className='pt-4 text-center'>Masukkan foto eKTP.</div>
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
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='mt-3'>Selfie dengan eKTP</div>
                                <div className='viewDragDrop  mt-2' onClick={handleClickSelfieKtp} style={{cursor: "pointer"}}>
                                    {
                                        !imageFileSelfieKtp ?
                                        <>
                                            <div className='pt-4 text-center'>Masukan foto selfie dengan eKTP.</div>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeSelfieKtp}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputSelfieKtp}
                                                id="image"
                                                name="image"
                                            />
                                        </>
                                         :
                                        <>
                                            <img src={imageFileSelfieKtp} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                            <input
                                                type="file"
                                                onChange={handleFileChangeSelfieKtp}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputSelfieKtp}
                                                id="image"
                                                name="image"
                                            />
                                            <div className='mt-2 ms-3'>{nameImageSelfieKtp}</div>
                                        </>
                                    }
                                    <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg</div>
                                    <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                                </div>
                            </>
                        )
                    }
                    <div className='text-end mt-4'>
                        <button 
                            onClick={() => formDataFirstStepInfoPemilikPerorangan(kewarganegaraan, getDataFirstStep.mprofile_id === undefined ? 0 : getDataFirstStep.mprofile_id, kewarganegaraan === 100 ? inputHandleWni.numberId : inputHandleWna.numberId, kewarganegaraan === 100 ? inputHandleWni.userName : inputHandleWna.userName, imageKtp, imageFileKtp === null ? "" : imageFileKtp, nameImageKtp, imageSelfieKtp, imageFileSelfieKtp, nameImageSelfieKtp, 2, 2, "", "next")} 
                            className={((inputHandleWni.userName.length !== 0 && inputHandleWni.numberId.length !== 0 && imageFileKtp !== null && imageFileSelfieKtp !== null && imageFileKtp.length !== 0 && imageFileSelfieKtp.length !== 0) || (inputHandleWna.userName.length !== 0 && inputHandleWna.numberId.length !== 0 && imageFileKtp !== null && imageFileSelfieKtp !== null && imageFileKtp.length !== 0 && imageFileSelfieKtp.length !== 0)) ? 'btn-next-active mb-4' : 'btn-next-inactive mb-4'}
                            disabled={((inputHandleWni.userName.length === 0 || inputHandleWni.numberId.length === 0 || imageFileKtp === null || imageFileSelfieKtp === null || imageFileKtp.length === 0 || imageFileSelfieKtp.length === 0) && (inputHandleWna.userName.length === 0 || inputHandleWna.numberId.length === 0 || imageFileKtp === null || imageFileSelfieKtp === null || imageFileKtp.length === 0 || imageFileSelfieKtp.length === 0))}
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
                <div className='pt-3'></div>
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
                        <Button onClick={() => formDataFirstStepInfoPemilikPerorangan(kewarganegaraan, getDataFirstStep.mprofile_id === undefined ? 0 : getDataFirstStep.mprofile_id, kewarganegaraan === 100 ? inputHandleWni.numberId : inputHandleWna.numberId, kewarganegaraan === 100 ? inputHandleWni.userName : inputHandleWna.userName, imageKtp, imageFileKtp, nameImageKtp, imageSelfieKtp, imageFileSelfieKtp, nameImageSelfieKtp, 1, 2, "", "back")} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormInfoPemilikPerseorangan