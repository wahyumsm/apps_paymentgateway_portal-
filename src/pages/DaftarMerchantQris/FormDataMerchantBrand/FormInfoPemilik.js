import React, { useEffect, useRef, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Modal } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactSelect, { components } from 'react-select';
import noteIconRed from "../../../assets/icon/note_icon_red.svg"
import filePdfQris from "../../../assets/icon/file_pdf_qris.svg";

const FormInfoPemilik = (props) => {
    const history = useHistory()
    const { profileId } = useParams()
    const hiddenFileInputKtp = useRef(null)
    const [imageFileKtp, setImageFileKtp] = useState(null)
    const [imageKtp, setImageKtp] = useState(null)
    const [nameImageKtp, setNameImageKtp] = useState("")
    const [formatKtp, setFormatKtp] = useState(false)
    const [fileSizeKtp, setFileSizeKtp] = useState(false)
    const [uploadPdfKtp, setUploadPdfKtp] = useState(false)

    const hiddenFileInputSelfieKtp = useRef(null)
    const [imageFileSelfieKtp, setImageFileSelfieKtp] = useState(null)
    const [imageSelfieKtp, setImageSelfieKtp] = useState(null)
    const [nameImageSelfieKtp, setNameImageSelfieKtp] = useState("")
    const [uploadSelfieKtp, setUploadSelfieKtp] = useState(false)
    const [formatSelfieKtp, setFormatSelfieKtp] = useState(false)

    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [isLoadingInfoPemilikBadanUsaha, setIsLoadingInfoPemilikBadanUsaha] = useState(false)
    const [dataList, setDataList] = useState([])
    const [selectedDataGrup, setSelectedDataGrup] = useState([])

    const [inputHandle, setInputHandle] = useState({
        jenisUsaha: 1,
        peranPendaftar: 0,
        namaUser: "",
        nomorKtp: "",
        kewarganegaraan: 0,
        noTelp: "",
    })

    function handleChange(e, kewarganegaraan) {
        if (e.target.name === "jenisUsaha") {
            if (Number(e.target.value) === 1) {
                setImageFileSelfieKtp(null)
                setImageSelfieKtp(null)
                setInputHandle({
                    ...inputHandle,
                    jenisUsaha: Number(e.target.value),
                    peranPendaftar: 0
                })
            } else {
                setInputHandle({
                    ...inputHandle,
                    jenisUsaha: Number(e.target.value),
                })
            }
        } else if (e.target.name === "kewarganegaraan") {
            setFileSizeKtp(false)
            setUploadPdfKtp(false)
            setFormatKtp(false)
            setNameImageKtp("")
            setImageFileKtp(null)
            setImageKtp(null)
            setInputHandle({
                ...inputHandle,
                kewarganegaraan: Number(e.target.value),
                nomorKtp: ""
            })
        } else if (e.target.name === "nomorKtp") {
            if (kewarganegaraan === 100) {
                if (e.target.value.length > 16) {
                    setInputHandle({
                        ...inputHandle,
                        [e.target.name]: (e.target.value).slice(0,16)
                    })
                } else {
                    setInputHandle({
                        ...inputHandle,
                        [e.target.name]: e.target.value
                    })
                }
            } else {
                setInputHandle({
                    ...inputHandle,
                    [e.target.name]: e.target.value
                })
            }
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name]: (e.target.name === "peranPendaftar") ? Number(e.target.value) : e.target.value
            })
        }
    }

    const handleClickKtp = () => {
        hiddenFileInputKtp.current.click();
    };

    const handleClickSelfieKtp = () => {
        hiddenFileInputSelfieKtp.current.click();
    };

    const handleFileChangeKtp = (event) => {
        if ((event.target.files[0].name).slice(-3) === "pdf") {
            setImageKtp(event.target.files[0])
            setImageFileKtp(null)
            setNameImageKtp(event.target.files[0].name)
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setFileSizeKtp(true)
                setUploadPdfKtp(false)
            } else {
                setFileSizeKtp(false)
                setUploadPdfKtp(true)
            }
        } else {
            setUploadPdfKtp(false)
            if ((event.target.files[0].name).slice(-3) === "JPG" || (event.target.files[0].name).slice(-3) === "jpg" || (event.target.files[0].name).slice(-4) === "JPEG" || (event.target.files[0].name).slice(-4) === "jpeg" || (event.target.files[0].name).slice(-3) === "PNG" || (event.target.files[0].name).slice(-3) === "png") {
                setFormatKtp(false)
                if(event.target.files[0]) {
                    setImageKtp(event.target.files[0])
                    if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                        setFileSizeKtp(true)
                        setImageFileKtp(null)
                        setNameImageKtp("")
                    }
                    else {
                        setNameImageKtp(event.target.files[0].name)
                        setFileSizeKtp(false)
                        const reader = new FileReader()
                        reader.addEventListener("load", () => {
                            setImageFileKtp(reader.result)
                        })
                        reader.readAsDataURL(event.target.files[0])
                    }
                }
            } else {
                setFormatKtp(true)
                setFileSizeKtp(false)
                setNameImageKtp("")
                setImageFileKtp(null)
                setImageKtp(null)
            }
        }
    }

    const handleFileChangeSelfieKtp = (event) => {
        if ((event.target.files[0].name).slice(-3) === "JPG" || (event.target.files[0].name).slice(-3) === "jpg") {
            setFormatSelfieKtp(false)
            if(event.target.files[0]) {
                setImageSelfieKtp(event.target.files[0])
                if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                    setUploadSelfieKtp(true)
                    setImageFileSelfieKtp(null)
                    setNameImageSelfieKtp("")
                }
                else {
                    setNameImageSelfieKtp(event.target.files[0].name)
                    setUploadSelfieKtp(false)
                    const reader = new FileReader()
                    reader.addEventListener("load", () => {
                        setImageFileSelfieKtp(reader.result)
                    })
                    reader.readAsDataURL(event.target.files[0])
                }
            }
        } else {
            setFormatSelfieKtp(true)
            setUploadSelfieKtp(false)
            setNameImageSelfieKtp("")
            setImageFileSelfieKtp(null)
            setImageSelfieKtp(null)
        }
    }

    async function getDataGrupHandler() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListMerchant", { data: "" }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mmerchant_nou
                    obj.label = e.mmerchant_name
                    newArr.push(obj)
                })
                setDataList(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mmerchant_nou
                    obj.label = e.mmerchant_name
                    newArr.push(obj)
                })
                setDataList(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataFirstStepInfoPemilik(profileId) {
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
                    jenisUsaha: getData.data.response_data.results.mprofdtl_bustype,
                    peranPendaftar: getData.data.response_data.results.mprofdtl_register_role === null ? 0 : getData.data.response_data.results.mprofdtl_register_role,
                    namaUser: getData.data.response_data.results.mprofdtl_name,
                    nomorKtp: getData.data.response_data.results.mprofdtl_identity_no,
                    kewarganegaraan: getData.data.response_data.results.mprofdtl_identity_type_id,
                    noTelp: getData.data.response_data.results.mprofdtl_mobile
                })
                if (getData.data.response_data.results.mprofdtl_identity_url.slice(-3) === "pdf") {
                    setImageFileKtp(null)
                    setUploadPdfKtp(true)
                    setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                } else {
                    setUploadPdfKtp(false)
                    setImageFileKtp(getData.data.response_data.results.mprofdtl_identity_url)
                    setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                }
                setImageFileSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_url)
                setNameImageSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_file_name)
                let newArrDataGrup = []
                let objDataGrup = {}
                objDataGrup.value = getData.data.response_data.results.mmerchant_nou
                objDataGrup.label = getData.data.response_data.results.mmerchant_name
                newArrDataGrup.push(objDataGrup)
                setSelectedDataGrup(objDataGrup.value === null ? [] : newArrDataGrup)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                setInputHandle({
                    ...getData.data.response_data.results,
                    jenisUsaha: getData.data.response_data.results.mprofdtl_bustype,
                    peranPendaftar: getData.data.response_data.results.mprofdtl_register_role === null ? 0 : getData.data.response_data.results.mprofdtl_register_role,
                    namaUser: getData.data.response_data.results.mprofdtl_name,
                    nomorKtp: getData.data.response_data.results.mprofdtl_identity_no,
                    kewarganegaraan: getData.data.response_data.results.mprofdtl_identity_type_id,
                    noTelp: getData.data.response_data.results.mprofdtl_mobile
                })
                if (getData.data.response_data.results.mprofdtl_identity_url.slice(-3) === "pdf") {
                    setImageFileKtp(null)
                    setUploadPdfKtp(true)
                    setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                } else {
                    setUploadPdfKtp(false)
                    setImageFileKtp(getData.data.response_data.results.mprofdtl_identity_url)
                    setNameImageKtp(getData.data.response_data.results.mprofdtl_identity_file_name)
                }
                setImageFileSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_url)
                setNameImageSelfieKtp(getData.data.response_data.results.mprofdtl_selfie_identity_file_name)
                let newArrDataGrup = []
                let objDataGrup = {}
                objDataGrup.value = getData.data.response_data.results.mmerchant_nou
                objDataGrup.label = getData.data.response_data.results.mmerchant_name
                newArrDataGrup.push(objDataGrup)
                setSelectedDataGrup(objDataGrup.value === null ? [] : newArrDataGrup)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function formDataFirstStepInfoPemilikBadanUsaha(peranPendaftar, namaUser, nomorKtp, kewarganegaraan, noTelp, imageKtp, imageSelfieKtp, step, businessType, merchantNou, position, profileId) {
        try {
            setIsLoadingInfoPemilikBadanUsaha(true)
            const auth = "Bearer " + getToken()
            const formData = new FormData()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "register_type": 102, "user_role": ${peranPendaftar}, "profile_id": ${profileId === undefined ? 0 : profileId}, "email": "", "identity_id": ${kewarganegaraan}, "identity_number": "${nomorKtp}", "user_name": "${namaUser}", "phone_number": "${noTelp}", "grupID": 0, "brandID": 0, "outletID": 0, "step": ${step}, "bussiness_type": ${businessType}, "user_id": 0, "merchant_name": ""}`)
            formData.append('ktpUrl', imageKtp)
            formData.append('SelfieKtpUrl', imageSelfieKtp)
            formData.append('Data', dataParams)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/FirstStepAddMerchantQRISOnboarding", formData, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (position === "next") {
                    history.push(`/formulir-info-usaha-brand/${getData.data.response_data.mprof_id}`)
                } else {
                    setIsLoadingInfoPemilikBadanUsaha(false)
                    history.push('/daftar-merchant-qris')
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (position === "next") {
                    history.push(`/formulir-info-usaha-brand/${getData.data.response_data.mprof_id}`)
                } else {
                    setIsLoadingInfoPemilikBadanUsaha(false)
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

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    useEffect(() => {
        if (profileId !== undefined) {
            getDataFirstStepInfoPemilik(profileId)
        }
        getDataGrupHandler()
    }, [])


    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => backPage(inputHandle.namaUser)} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
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
                        {
                            inputHandle.jenisUsaha === 1 && <div>Dokumen usaha</div>
                        }
                    </div>
                </div>
                <div className='base-content my-2'>
                <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Apa Jenis Usaha Merchant? </div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="badanUsaha"
                                name='jenisUsaha'
                                value={1}
                                checked={inputHandle.jenisUsaha === 1 && true}
                                onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="badanUsaha"
                            >
                                Badan Usaha
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="perorangan"
                                name='jenisUsaha'
                                value={2}
                                checked={inputHandle.jenisUsaha === 2 && true}
                                onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="perorangan"
                            >
                                Perorangan
                            </label>
                        </div>
                    </div>
                    <div className='my-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Grup</div>
                    <div className="dropdown dropInfoPemilikBrand mt-2" >
                        <ReactSelect
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            options={dataList}
                            value={selectedDataGrup}
                            onChange={(selected) => setSelectedDataGrup([selected])}
                            placeholder="Pilih Nama Grup"
                            components={{ Option }}
                            styles={customStylesSelectedOption}
                        />
                    </div>
                    {
                        inputHandle.jenisUsaha === 1 &&
                        <>
                            <div className='mt-3 mb-1' style={{ fontFamily: "Nunito", fontSize: 14}}>Peran pendaftar</div>
                            <div className='d-flex justify-content-start align-items-center py-2'>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="direktur"
                                        name='peranPendaftar'
                                        value={1}
                                        checked={inputHandle.peranPendaftar === 1 && true}
                                        onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)}
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
                                        onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)}
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
                        </>
                    }
                    <div className={inputHandle.jenisUsaha === 2 ? 'mt-3 mb-1' : 'my-1'} style={{ fontFamily: "Nunito", fontSize: 14}}>Kewarganegaraan pemilik usaha</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="wni"
                                name='kewarganegaraan'
                                value={100}
                                checked={inputHandle.kewarganegaraan === 100 && true}
                                onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)}
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
                                onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)}
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
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik usaha sesuai {inputHandle.jenisUsaha === 2 ? (inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`) : (inputHandle.kewarganegaraan === 101 ? `KITAS` : `akta pendirian / perubahan terakhir`)}</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaUser" value={inputHandle.namaUser} onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)} className='input-text-form' placeholder={`Masukan nama sesuai ${inputHandle.jenisUsaha === 2 ? (inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`) : (inputHandle.kewarganegaraan === 101 ? `KITAS` : `akta pendirian / perubahan terakhir`)}`} style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`} pemilik usaha {inputHandle.jenisUsaha === 1 ? ((inputHandle.kewarganegaraan === 100 || inputHandle.kewarganegaraan === 0) && `sesuai akta pendirian / perubahan terakhir`) : ``}</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="nomorKtp" value={inputHandle.nomorKtp} onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)} type={inputHandle.kewarganegaraan === 101 ? 'text' : 'number'} onKeyDown={inputHandle.kewarganegaraan === 101 ? "" : (evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} className='input-text-form' placeholder={`Masukan nomor ${inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`}`} style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`} pemilik usaha {inputHandle.jenisUsaha === 1 ? ((inputHandle.kewarganegaraan === 100 || inputHandle.kewarganegaraan === 0) && `sesuai akta pendirian / perubahan terakhir`) : ``}</div>
                    <div className='viewDragDrop mt-2' onClick={handleClickKtp}  style={{cursor: "pointer"}}>
                        {
                            (!imageFileKtp && uploadPdfKtp === false && fileSizeKtp === false && formatKtp === false) ?
                            <>
                                <div className='pt-4 text-center'>Masukkan foto {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`}.</div>
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                            </>
                                : (imageFileKtp) ?
                            <>
                                <img src={imageFileKtp} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-3'>{nameImageKtp}</div>
                            </>
                                : (uploadPdfKtp === true) ?
                            <>
                                <img src={filePdfQris} alt="alt" width="auto" height="120px" className='pt-4 ms-4 text-start' />
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                                <div className='mt-2 ms-4'>{nameImageKtp}</div>
                            </>
                                : (fileSizeKtp === true) ?
                            <>
                                <div className='mt-4 d-flex justify-content-center align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "Nunito" }}>
                                    <img src={noteIconRed} className="me-2" alt="icon notice" />
                                    <div>File lebih dari 500kb</div>
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                            </>
                                : (formatKtp === true) &&
                            <>
                                <div className='mt-4 d-flex justify-content-center align-items-center' style={{ color: "#B9121B", fontSize: 12, fontFamily: "Nunito" }}>
                                    <img src={noteIconRed} className="me-2" alt="icon notice" />
                                    <div>Format harus .jpg, .jpeg, .png atau .pdf</div>
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFileChangeKtp}
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInputKtp}
                                    id="image"
                                    name="image"
                                />
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg, .jpeg, .png atau .pdf</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    {/* {
                        inputHandle.jenisUsaha === 2 &&
                        <>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='mt-3'>Selfie dengan {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`}</div>
                            <div className='viewDragDrop  mt-2' onClick={handleClickSelfieKtp} style={{cursor: "pointer"}}>
                                {
                                    !imageFileSelfieKtp ?
                                    <>
                                        {
                                            formatSelfieKtp === true ?
                                            <div className='pt-4 text-center' style={{ color: "#B9121B" }}><span className='me-1'><img src={noteIconRed} alt="" /></span> Format harus .jpg</div> :
                                            <div className='pt-4 text-center'>Masukan foto selfie dengan {inputHandle.kewarganegaraan === 101 ? `KITAS` : `eKTP`}.</div>
                                        }
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
                            {
                                uploadSelfieKtp && <div className='pt-2' style={{ color: "#B9121B", fontSize: 12, fontFamily: "Nunito" }}><span className='me-2'><img src={noteIconRed} alt="" /></span>Data lebih dari 500kb</div>
                            }
                        </>
                    } */}
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>No telepon pemilik usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="noTelp" value={inputHandle.noTelp} onChange={(e) => handleChange(e, inputHandle.kewarganegaraan)} type='number' onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} className='input-text-form' placeholder='Masukan no telepon' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div className='text-end mt-4'>
                        <button
                            className={(((inputHandle.jenisUsaha === 1 && (inputHandle.peranPendaftar === 1 || inputHandle.peranPendaftar === 2))  || inputHandle.jenisUsaha === 2) && (inputHandle.kewarganegaraan === 100 || inputHandle.kewarganegaraan === 101) && inputHandle.namaUser.length !== 0 && inputHandle.nomorKtp.length !== 0 && (uploadPdfKtp !== false || (imageKtp !== null || imageFileKtp !== null)) && inputHandle.noTelp.length !== 0 && fileSizeKtp === false) ? 'btn-next-active mb-4' : 'btn-next-inactive mb-4'}
                            disabled={((inputHandle.jenisUsaha === 1 && (inputHandle.peranPendaftar !== 1 && inputHandle.peranPendaftar !== 2))) || (inputHandle.kewarganegaraan !== 100 && inputHandle.kewarganegaraan !== 101) || inputHandle.namaUser.length === 0 || inputHandle.nomorKtp.length === 0 || (uploadPdfKtp === false && (imageKtp === null && imageFileKtp === null)) || inputHandle.noTelp.length === 0 || fileSizeKtp !== false}
                            onClick={() => formDataFirstStepInfoPemilikBadanUsaha(inputHandle.peranPendaftar, inputHandle.namaUser, inputHandle.nomorKtp, inputHandle.kewarganegaraan, inputHandle.noTelp, imageKtp, imageSelfieKtp, 2, inputHandle.jenisUsaha, selectedDataGrup.length !== 0 ? selectedDataGrup[0].value : 0, "next", profileId === undefined ? 0 : profileId)}
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
                        <Button onClick={() => formDataFirstStepInfoPemilikBadanUsaha(inputHandle.peranPendaftar, inputHandle.namaUser, inputHandle.nomorKtp, inputHandle.kewarganegaraan, inputHandle.noTelp, imageKtp, imageSelfieKtp, 1, inputHandle.jenisUsaha, selectedDataGrup.length !== 0 ? selectedDataGrup[0].value : 0, "back", profileId === undefined ? 0 : profileId)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>
                            {isLoadingInfoPemilikBadanUsaha ? (<>Mohon tunggu... <FontAwesomeIcon icon={faSpinner} spin /></>) : `Simpan`}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormInfoPemilik