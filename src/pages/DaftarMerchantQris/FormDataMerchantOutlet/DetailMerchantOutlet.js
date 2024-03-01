import React, { useEffect, useMemo, useRef, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { Col, Image, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { agenLists } from '../../../data/tables';
import { FilterComponentQrisOutletDetail } from '../../../components/FilterComponentQris';
import loadingEzeelink from "../../../assets/img/technologies/Double Ring-1s-303px.svg"
import { useHistory, useParams } from 'react-router-dom';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import axios from 'axios';
import ReactSelect, { components } from 'react-select';
import noteIconRed from "../../../assets/icon/note_icon_red.svg"
import encryptData from '../../../function/encryptData';

const DetailMerchantOutlet = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [dataDetailOutlet, setDataDetailOutlet] = useState({})
    const hiddenFileInputKtp = useRef(null)
    const [imageFileKtp, setImageFileKtp] = useState(null)
    const [imageKtp, setImageKtp] = useState(null)
    const [nameImageKtp, setNameImageKtp] = useState("")
    const [uploadKtp, setUploadKtp] = useState(false)
    const [formatEktp, setFormatEktp] = useState(false)

    const hiddenFileInputSelfieKtp = useRef(null)
    const [imageFileSelfieKtp, setImageFileSelfieKtp] = useState(null)
    const [imageSelfieKtp, setImageSelfieKtp] = useState(null)
    const [nameImageSelfieKtp, setNameImageSelfieKtp] = useState("")
    const [uploadSelfieKtp, setUploadSelfieKtp] = useState(false)

    const [getDataFirstStep, setGetDataFirstStep] = useState({})
    const [dataList, setDataList] = useState([])
    const [selectedDataGrup, setSelectedDataGrup] = useState([])
    const [dataListBrand, setDataListBrand] = useState([])
    const [selectedDataBrand, setSelectedDataBrand] = useState([])
    const [inputHandle, setInputHandle] = useState({
        jenisUsaha: 1,
        peranPendaftar: 0,
        namaUser: "",
        nomorKtp: "",
        kewarganegaraan: 0,
        noTelp: "",
    })

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: (e.target.name === "peranPendaftar" || e.target.name === "kewarganegaraan" || e.target.name === "jenisUsaha") ? Number(e.target.value) : e.target.value
        })
    }
    const handleClickKtp = () => {
        hiddenFileInputKtp.current.click();
    };

    const handleClickSelfieKtp = () => {
        hiddenFileInputSelfieKtp.current.click();
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
                    setImageFileSelfieKtp(reader.result)
                })
                reader.readAsDataURL(event.target.files[0])
            }
        }
    }

    function handleChangeGrup (e) {
        setSelectedDataBrand([])
        setSelectedDataGrup([e])
        getDataBrandHandler(e.value)
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

    async function getDataBrandHandler(merchantNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListOutlet", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.moutlet_nou
                    obj.label = e.moutlet_name
                    newArr.push(obj)
                })
                setDataListBrand(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.moutlet_nou
                    obj.label = e.moutlet_name
                    newArr.push(obj)
                })
                setDataListBrand(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListDataDetailOutletQrisHandler(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantGrup = await axios.post(BaseURL + "/QRIS/OnboardingGetProfileStore", { data: dataParams }, { headers: headers })
            // console.log(datamerchantGrup, 'ini user detal funct');
            if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length === 0) {
                setDataDetailOutlet(datamerchantGrup.data.response_data.results)
                setInputHandle({...inputHandle, jenisUsaha: datamerchantGrup.data.response_data.results.mprofdtl_bustype, peranPendaftar: datamerchantGrup.data.response_data.results.mprofdtl_register_role, namaUser: datamerchantGrup.data.response_data.results.profile_user_name === null ? "" : datamerchantGrup.data.response_data.results.profile_user_name, nomorKtp: datamerchantGrup.data.response_data.results.mprofdtl_identity_no === null ? "" : datamerchantGrup.data.response_data.results.mprofdtl_identity_no, kewarganegaraan: datamerchantGrup.data.response_data.results.mprofdtl_identity_type_id, noTelp: datamerchantGrup.data.response_data.results.mprofdtl_mobile})
                setImageFileKtp(datamerchantGrup.data.response_data.results.mprofdtl_identity_url)
                setNameImageKtp(datamerchantGrup.data.response_data.results.mprofdtl_identity_url_name)
                let newArrDataGrup = []
                let objDataGrup = {}
                objDataGrup.value = datamerchantGrup.data.response_data.results.mmerchant_nou
                objDataGrup.label = datamerchantGrup.data.response_data.results.mmerchant_name
                newArrDataGrup.push(objDataGrup)
                setSelectedDataGrup(objDataGrup.value === null ? [] : newArrDataGrup)
                getDataBrandHandler(datamerchantGrup.data.response_data.results.mmerchant_nou)
                let newArrDataBrand = []
                let objDataBrand = {}
                objDataBrand.value = datamerchantGrup.data.response_data.results.moutlet_nou
                objDataBrand.label = datamerchantGrup.data.response_data.results.moutlet_name
                newArrDataBrand.push(objDataBrand)
                setSelectedDataBrand(objDataBrand.value === null ? [] : newArrDataBrand)
            } else if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length !== 0) {
                setUserSession(datamerchantGrup.data.response_new_token)
                setDataDetailOutlet(datamerchantGrup.data.response_data.results)
                setInputHandle({...inputHandle, jenisUsaha: datamerchantGrup.data.response_data.results.mprofdtl_bustype, peranPendaftar: datamerchantGrup.data.response_data.results.mprofdtl_register_role, namaUser: datamerchantGrup.data.response_data.results.profile_user_name === null ? "" : datamerchantGrup.data.response_data.results.profile_user_name, nomorKtp: datamerchantGrup.data.response_data.results.mprofdtl_identity_no === null ? "" : datamerchantGrup.data.response_data.results.mprofdtl_identity_no, kewarganegaraan: datamerchantGrup.data.response_data.results.mprofdtl_identity_type_id, noTelp: datamerchantGrup.data.response_data.results.mprofdtl_mobile})
                setImageFileKtp(datamerchantGrup.data.response_data.results.mprofdtl_identity_url)
                setNameImageKtp(datamerchantGrup.data.response_data.results.mprofdtl_identity_url_name)
                let newArrDataGrup = []
                let objDataGrup = {}
                objDataGrup.value = datamerchantGrup.data.response_data.results.mmerchant_nou
                objDataGrup.label = datamerchantGrup.data.response_data.results.mmerchant_name
                newArrDataGrup.push(objDataGrup)
                setSelectedDataGrup(objDataGrup.value === null ? [] : newArrDataGrup)
                getDataBrandHandler(datamerchantGrup.data.response_data.results.mmerchant_nou)
                let newArrDataBrand = []
                let objDataBrand = {}
                objDataBrand.value = datamerchantGrup.data.response_data.results.moutlet_nou
                objDataBrand.label = datamerchantGrup.data.response_data.results.moutlet_name
                newArrDataBrand.push(objDataBrand)
                setSelectedDataBrand(objDataBrand.value === null ? [] : newArrDataBrand)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
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
        getListDataDetailOutletQrisHandler(profileId)
        getDataGrupHandler()
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push('/daftar-merchant-qris')} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Merchant Outlet</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Info Merchant Outlet</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Info Merchant Outlet</h2>
            </div>
            <div className='base-content mt-4 pb-4'>
                <div className='d-flex justify-content-between align-items-center'>
                    <div className='nama-merchant-in-detail'>{dataDetailOutlet?.mstore_name}</div>
                    <div className='status-in-detail-qris-brand-success'>{dataDetailOutlet?.mregstatus_name_ind}</div>
                </div>
                <Row>
                    <Col xs={4}>
                        <div className='sub-title-detail-merchant mt-3'>Group</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mmerchant_name === "" ? "-" : dataDetailOutlet?.mmerchant_name}</div>
                        <div className='sub-title-detail-merchant mt-3'>Tanggal terdaftar</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.create_date}</div>
                        <div className='sub-title-detail-merchant mt-3'>Email terdaftar</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mprofdtl_email === "" ? "-" : dataDetailOutlet?.mprofdtl_email}</div>
                        <div className='sub-title-detail-merchant mt-3'>Tujuan settlment</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mqrismerchsettle_settlegroup}</div>
                    </Col>
                    <Col xs={4}>
                        <div className='sub-title-detail-merchant mt-3'>Brand</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.moutlet_name === "" ? "-" : dataDetailOutlet?.moutlet_name}</div>
                        <div className='sub-title-detail-merchant mt-3'>Kategori Usaha</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mbuscat_name}</div>
                        <div className='sub-title-detail-merchant mt-3'>Riwayat terakhir</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.edit_date}</div>
                        <div className='sub-title-detail-merchant mt-3'>Nomor rekening</div>
                        <div className='isi-content-detail-merchant mt-2'>{(dataDetailOutlet?.mqrismerchsettle_acc_number === "" || dataDetailOutlet?.mqrismerchsettle_acc_number === null) ? "-" : dataDetailOutlet?.mqrismerchsettle_acc_number}</div>
                    </Col>
                    <Col xs={4}>
                        <div className='sub-title-detail-merchant mt-3'>ID outlet</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mstore_id === null ? "-" : dataDetailOutlet?.mstore_id}</div>
                        <div className='sub-title-detail-merchant mt-3'>No. handphone pemilik/direktur</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mprofdtl_mobile === "" ? "-" : dataDetailOutlet?.mprofdtl_mobile}</div>
                        <div className='sub-title-detail-merchant mt-3'>Jenis settlement</div>
                        <div className='isi-content-detail-merchant mt-2'>{dataDetailOutlet?.mprofilefee_settle_type === null ? "-" : dataDetailOutlet?.mprofilefee_settle_type}</div>
                        <div className='sub-title-detail-merchant mt-3'>Nama pemilik rekening</div>
                        <div className='isi-content-detail-merchant mt-2'>{(dataDetailOutlet?.mqrismerchsettle_acc_name === "" || dataDetailOutlet?.mqrismerchsettle_acc_name === null) ? "-" : dataDetailOutlet?.mqrismerchsettle_acc_name}</div>
                    </Col>
                </Row>
            </div>
            
            <div className='base-content my-2 pb-4'>
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
                                onChange={(e) => handleChange(e)}
                                disabled
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
                                onChange={(e) => handleChange(e)}
                                disabled
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
                    <div className="dropdown dropDisbursePartner mt-2">
                        <ReactSelect
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            options={dataList}
                            value={selectedDataGrup}
                            onChange={(e) => handleChangeGrup(e)}
                            placeholder="Pilih Nama Grup"
                            components={{ Option }}
                            styles={customStylesSelectedOption}
                            isDisabled
                        />
                    </div>
                    <div className='mb-1 mt-3' style={{ fontFamily: "Nunito", fontSize: 14}}>Brand</div>
                    <div className="dropdown dropDisbursePartner mt-2">
                        <ReactSelect
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            options={dataListBrand}
                            value={selectedDataBrand}
                            onChange={(selected) => setSelectedDataBrand([selected])}
                            placeholder="Pilih brand"
                            components={{ Option }}
                            styles={customStylesSelectedOption}
                            isDisabled
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
                                        onChange={(e) => handleChange(e)}
                                        disabled
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
                                        disabled
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
                                onChange={(e) => handleChange(e)}
                                disabled
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
                                disabled
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
                        <input name="namaUser" value={inputHandle.namaUser} onChange={(e) => handleChange(e)} disabled className='input-text-form' placeholder='Masukan nama lengkap' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor eKTP pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="nomorKtp" value={inputHandle.nomorKtp} onChange={(e) => handleChange(e)} disabled className='input-text-form' placeholder='Masukan nomor eKTP pemilik' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto eKTP pemilik usaha sesuai akta pendirian / perubahan terakhir</div>
                    <div className='viewDragDrop mt-2' onClick={handleClickKtp}  style={{cursor: "pointer"}}>
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
                                    disabled
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
                                    disabled
                                />
                                <div className='mt-2 ms-4'>{nameImageKtp}</div>
                            </>
                        }
                        <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg</div>
                        <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                    </div>
                    {
                        uploadKtp && <div className='pt-2' style={{ color: "#B9121B", fontSize: 12, fontFamily: "Nunito" }}><span className='me-2'><img src={noteIconRed} alt="" /></span>Data lebih dari 500kb</div>
                    }
                    {
                        inputHandle.jenisUsaha === 2 && 
                        <>
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
                                            disabled
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
                                            disabled
                                        />
                                        <div className='mt-2 ms-4'>{nameImageSelfieKtp}</div>
                                    </>
                                }
                                <div className='pt-3 text-center'>Maks ukuran satu file: 500kb, Format .jpg</div>
                                <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                            </div>
                        </>
                    }
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>No telepon pemilik usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="noTelp" value={inputHandle.noTelp} onChange={(e) => handleChange(e)} disabled type='number' onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} className='input-text-form' placeholder='Masukan no telepon' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                </div>
        </div>
    )
}

export default DetailMerchantOutlet 