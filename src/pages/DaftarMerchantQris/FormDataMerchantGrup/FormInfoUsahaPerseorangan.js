import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Modal, Row } from '@themesberg/react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import ReactSelect, { components } from 'react-select';

const FormInfoUsahaPerseorangan = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [dataKategoriUsaha, setDataKategoriUsaha] = useState([])
    const [selectedDataKategoriUsaha, setSelectedDataKategoriUsaha] = useState([])
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [alertMaxFile, setAlertMaxFile] = useState(false)
    const [inputHandle, setInputHandle] = useState({
        namaPerusahaan: "",
        namaBrand: "",
        jumlahKasir: 0,
        pendapatanPertahun: 0,
        kategoriUsaha: "",
        alamatUsaha: "",
        kodePos: "",
        jenisToko: "",
        kepunyaanQris: "",
        nmid: ""
    })

    console.log(inputHandle.kepunyaanQris, "inputHandle.kepunyaanQris");

    const [dataAlamatDetail, setDataAlamatDetail] = useState({
        provinsi: "",
        kabKota: "",
        kecamatan: "",
        kelurahan: ""
    })

    const hiddenFileInputTempatUsaha = useRef(null)
    const [imageFileTempatUsaha, setImageFileTempatUsaha] = useState([])
    const [imageTempatUsaha, setImageTempatUsaha] = useState(null)
    const [nameImageTempatUsaha, setNameImageTempatUsaha] = useState("")
    const [uploadTempatUsaha, setUploadTempatUsaha] = useState(false)
    console.log(imageFileTempatUsaha, 'imageFileTempatUsaha');

    const handleClickTempatUsaha = () => {
        hiddenFileInputTempatUsaha.current.click();
    };

    function handleChange(e) {
        if (e.target.name === "pendapatanPertahun") {
            setSelectedDataKategoriUsaha([])
            getDataKategoriUsaha(e.target.value)
            setInputHandle({
                ...inputHandle,
                [e.target.name]: Number(e.target.value)
            })
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleFileChangeTempatUsaha = (event) => {
        if(event.target.files[0]) {
            setImageTempatUsaha(event.target.files[0])
            setNameImageTempatUsaha(event.target.files[0].name)
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setUploadTempatUsaha(true)
                setImageFileTempatUsaha(imageFileTempatUsaha)
            }
            else {
                setUploadTempatUsaha(false)
                console.log("file >>> ", event.target.files.length);
                if (event.target.files.length > 3) {
                    setAlertMaxFile(true)
                } else {
                    setAlertMaxFile(false)
                    const tempArr = [];

                    [...event.target.files].forEach(file => {

                        tempArr.push({
                            data: file,
                            url: URL.createObjectURL(file)
                        });
                    });

                    setImageFileTempatUsaha(tempArr);
                }
            }
        }
    }

    async function getDataKategoriUsaha(businessCategory) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"business_category": ${businessCategory}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListBusinessCategory", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length === 0) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbuscat_id
                    obj.label = e.mbuscat_name
                    newArr.push(obj)
                })
                setDataKategoriUsaha(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length !== 0) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbuscat_id
                    obj.label = e.mbuscat_name
                    newArr.push(obj)
                })
                setDataKategoriUsaha(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataSecondStepInfoUsahaPerorangan(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "business_level": 101}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetSecondStepData", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                const getDataSecStep = getData.data.response_data.results
                setInputHandle({
                    ...getDataSecStep,
                    namaPerusahaan: getDataSecStep.mprofbus_name,
                    namaBrand: getDataSecStep.mprofbus_brand,
                    jumlahKasir: getDataSecStep.mprofbus_cashier_count,
                    pendapatanPertahun: getDataSecStep.mprofbus_mbusinc_id,
                    kategoriUsaha: getDataSecStep.mprofbus_buscat_id,
                    alamatUsaha: getDataSecStep.mprofbus_address,
                    kodePos: getDataSecStep.mprofbus_postal_code,
                    jenisToko: getDataSecStep.mprofbus_shop_type,
                    kepunyaanQris: getDataSecStep.mprofbus_is_have_QRIS === true ? "1" : "2",
                    nmid: getDataSecStep.mprofbus_NMID_QRIS
                })
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                const getDataSecStep = getData.data.response_data.results
                setInputHandle({
                    ...getDataSecStep,
                    namaPerusahaan: getDataSecStep.mprofbus_name,
                    namaBrand: getDataSecStep.mprofbus_brand,
                    jumlahKasir: getDataSecStep.mprofbus_cashier_count,
                    pendapatanPertahun: getDataSecStep.mprofbus_mbusinc_id,
                    kategoriUsaha: getDataSecStep.mprofbus_buscat_id,
                    alamatUsaha: getDataSecStep.mprofbus_address,
                    kodePos: getDataSecStep.mprofbus_postal_code,
                    jenisToko: getDataSecStep.mprofbus_shop_type,
                    kepunyaanQris: getDataSecStep.mprofbus_is_have_QRIS === true ? "1" : "2",
                    nmid: getDataSecStep.mprofbus_NMID_QRIS
                })
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function formDataSecondStepInfoUsahaPerorangan(businessLevel, profileId, namaPerusahaan, namaBrand, kategoriUsaha, jumlahKasir, pendapatanPerTahun, alamat, kodePos, provinsi, kota, kecamatan, kelurahan, jenisToko, kepunyaanQris, imageOnlineShop, nmid) {
        try {
            const auth = "Bearer " + getToken()
            const formData = new FormData()
            const dataParams = encryptData(`{"business_level": ${businessLevel}, "mprofbus_mprofile_id":${profileId}, "mprofbus_name":"${namaPerusahaan}", "mprofbus_brand":"${namaBrand}", "mprofbus_buscat_id": ${kategoriUsaha}, "mprofbus_cashier_count": ${jumlahKasir}, "mprofbus_mbusinc_id": ${pendapatanPerTahun}, "mprofbus_address": "${alamat}", "mprofbus_postal_code": "${kodePos}", "mprofbus_province": "${provinsi}", "mprofbus_city": "${kota}", "mprofbus_district": "${kecamatan}", "mprofbus_village": "${kelurahan}", "mprofbus_shop_type": "${jenisToko}", "mprofbus_is_have_QRIS": ${kepunyaanQris}, "mprofbus_NMID_QRIS": "${nmid}"}`)
            formData.append('toko1_url', imageOnlineShop)
            formData.append('Data', dataParams)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/SecondStepAddMerchantQRISOnboarding", formData, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)

            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function backPage () {
        setShowModalSimpanData(true)
    }

    function saveAndGoBack () {
        formDataSecondStepInfoUsahaPerorangan(101, profileId, inputHandle.namaPerusahaan, inputHandle.namaBrand, inputHandle.kategoriUsaha, inputHandle.jumlahKasir, inputHandle.pendapatanPertahun, inputHandle.alamatUsaha, inputHandle.kodePos, "", "", "", "", inputHandle.jenisToko, inputHandle.kepunyaanQris, imageTempatUsaha, inputHandle.nmid)
        history.push('/daftar-merchant-qris')
    }

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
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

    useEffect(() => {
        if (profileId !== undefined) {
            getDataSecondStepInfoUsahaPerorangan(profileId)
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
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className=''>Nama perusahaan</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaPerusahaan" value={inputHandle.namaPerusahaan} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama perusahaan' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama brand/toko</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaBrand" value={inputHandle.namaBrand} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama brand/toko' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Jumlah kasir (counter pembayaran)</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center' style={{ width:"7%" }}>
                        <input name="jumlahKasir" value={inputHandle.jumlahKasir} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='0' type='number' min={0} max={2500} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 45 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Pendapatan pertahun</div>
                    <Row className='py-2' style={{ marginLeft: "unset", marginRight: "unset" }}>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputA"
                                name='pendapatanPertahun'
                                value={1}
                                checked={inputHandle.pendapatanPertahun === 1 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputA"
                            >
                                {`< Rp 300 juta`}
                            </label>
                        </Col>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputB"
                                name='pendapatanPertahun'
                                value={2}
                                checked={inputHandle.pendapatanPertahun === 2 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputB"
                            >
                                Rp 300 juta - Rp 2,5 miliar
                            </label>
                        </Col>
                    </Row>
                    <Row className='py-2' style={{ marginLeft: "unset", marginRight: "unset" }}>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputC"
                                name='pendapatanPertahun'
                                value={3}
                                checked={inputHandle.pendapatanPertahun === 3 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputC"
                            >
                                Rp 2,5 miliar - Rp 50 miliar
                            </label>
                        </Col>
                        <Col xs={3} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="inputD"
                                name='pendapatanPertahun'
                                value={4}
                                checked={inputHandle.pendapatanPertahun === 4 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="inputD"
                            >
                                {`> Rp 50 miliar`}
                            </label>
                        </Col>
                    </Row>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kategori usaha</div>
                    <div className='dropdown dropPartnerAddUser pt-2 '>
                        <ReactSelect
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            options={dataKategoriUsaha}
                            value={selectedDataKategoriUsaha}
                            onChange={(selected) => setSelectedDataKategoriUsaha([selected])}
                            placeholder="Pilih Partner Merchant"
                            components={{ Option }}
                            styles={customStylesSelectedOption}
                        />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Alamat usaha</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center'>
                        <textarea name="alamat" value={inputHandle.alamat} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='cth: jln. nama jalan no.01 RT.001 RW 002' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838", height: 100, padding: 12 }} /*placeholder='Masukkan Nama Perusahaan'*/ />
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
                                <input name="provinsi" value={dataAlamatDetail.provinsi} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }}>Kabupaten/kota</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input name="kabKota" value={dataAlamatDetail.kabKota} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                    </Row>
                    <Row className='pt-3'>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kecamatan</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input name="kecamatan" value={dataAlamatDetail.kecamatan} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Kelurahan</div>
                            <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                <input name="kelurahan" value={dataAlamatDetail.kelurahan} disabled className='input-text-user' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                            </div>
                        </Col>
                    </Row>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Jenis Toko <span style={{ fontFamily: "Nunito", fontSize: 12 }}>(bisa pilih lebih dari 1)</span></div>
                    <div className='pt-2 d-flex justify-content-start align-items-center'>
                        <Form.Check
                            className='form-jenis-toko-qris'
                            label="Toko Fisik"
                            id="statusId"
                            name='jenisToko'
                            value={"1"}
                            checked={inputHandle.jenisToko === "1" && true}
                            onChange={(e) => handleChange(e)}
                        />
                        <Form.Check
                            className='form-jenis-toko-qris ms-3'
                            label="Toko Online"
                            id="statusId"
                            name='jenisToko'
                            value={"2"}
                            checked={inputHandle.jenisToko === "2" && true}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    {
                        inputHandle.jenisToko === "1" && (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Foto tempat usaha</div>
                                <div className='viewDragDrop mt-2' style={{cursor: "pointer"}} onClick={handleClickTempatUsaha}>
                                    {
                                        imageFileTempatUsaha.length === 0 ? 
                                        <>
                                            <div className='pt-4 text-center'>Masukkan foto tempat usaha.</div>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeTempatUsaha}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputTempatUsaha}
                                                id="image"
                                                name="image"
                                                multiple
                                            />
                                            <div className='pt-3 text-center'>Maks: 3 foto, Maks ukuran satu file: 500kb</div>
                                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                                        </> 
                                            : 
                                        <>
                                            <div className='d-flex justify-content-start align-items-center' >
                                            {
                                                imageFileTempatUsaha.map((item, id) => {
                                                    return (
                                                        <img src={item.url} alt="alt" width="auto" height="120px" key={id} className='pt-4 ms-4 text-start' />
                                                    )
                                                })
                                            }
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeTempatUsaha}
                                                accept=".jpg"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInputTempatUsaha}
                                                id="image"
                                                name="image"
                                                multiple
                                            />
                                            <div className='pt-3 text-center'>Maks: 3 foto, Maks ukuran satu file: 500kb</div>
                                            <div className='d-flex justify-content-center align-items-center mt-2 pb-4 text-center'><div className='upload-file-qris'>Upload file</div></div>
                                        </>
                                    }
                                </div>
                                <div>{alertMaxFile === true ? "file lebih dari 3" : ""}</div>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838"}} className='pt-3'>Link / Website toko</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="companyName" className='input-text-form' placeholder='Masukan link / website toko' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                            </>
                        )
                    }
                    <div style={{ fontFamily: "Nunito", fontSize: 14 }} className='pt-3'>Sudah pernah mendaftar QRIS sebelumnya ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2'>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Ya"
                                name='kepunyaanQris'
                                value={"1"}
                                checked={inputHandle.kepunyaanQris === "1" && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="Ya"
                            >
                                Ya
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Tidak"
                                name='kepunyaanQris'
                                value={"2"}
                                checked={inputHandle.kepunyaanQris === "2" && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="Tidak"
                            >
                                Tidak
                            </label>
                        </div>
                    </div>
                    {
                        inputHandle.kepunyaanQris === "1" && (
                            <>
                                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>NMID</div>
                                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                                    <input name="companyName" className='input-text-form' placeholder='Masukan NMID' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                                </div>
                                <div className='mt-1' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>Minimal 13 digit angka</div>
                            </>
                        )
                    }
                   <div>
                   <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
                        <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                        <button className='btn-next-info-usaha ms-2' onClick={() => formDataSecondStepInfoUsahaPerorangan(101, profileId, inputHandle.namaPerusahaan, inputHandle.namaBrand, inputHandle.kategoriUsaha, inputHandle.jumlahKasir, inputHandle.pendapatanPertahun, inputHandle.alamatUsaha, inputHandle.kodePos, "", "", "", "", inputHandle.jenisToko, inputHandle.kepunyaanQris, imageTempatUsaha, inputHandle.nmid)}>Selanjutnya</button>
                    </div>
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
                        <Button onClick={() => saveAndGoBack()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormInfoUsahaPerseorangan