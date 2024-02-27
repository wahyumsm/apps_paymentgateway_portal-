import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import { Button, Form, Modal } from '@themesberg/react-bootstrap';
import 'filepond/dist/filepond.min.css'
import { useHistory, useParams } from 'react-router-dom';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import axios from 'axios';
import encryptData from '../../../function/encryptData';
import ReactSelect, { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const FormTambahSettlement = (props) => {
    const history = useHistory()
    const searchParams = new URLSearchParams(props.location.search);
    const type = searchParams.get('type');
    const { settleGroup, merchantNou, userNou} = useParams()
    const [showModalPemilikRek, setShowModalPemilikRek] = useState(false)
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [dataNamaPemilikRek, setDataNamaPemilikRek] = useState("")
    const [isLoadingInfoRekeningGrup, setIsLoadingInfoRekeningGrup] = useState(false)
    const [selectedDataBank, setSelectedDataBank] = useState([])
    const [getDataBank, setGetDataBank] = useState([])
    const [dataAllBrand, setDataAllBrand] = useState([])
    const [profileIdBrand, setProfileIdBrand] = useState({})
    const [selectedDataBrandTujuan, setSelectedDataBrandTujuan] = useState([])
    const [getDataBrandTujuan, setGetDataBrandTujuan] = useState([])
    const [selectedDataOutletTujuan, setSelectedDataOutletTujuan] = useState([])
    const [getDataOutletTujuan, setGetDataOutletTujuan] = useState([])
    const [dataMerchantSettlement, setDataMerchantSettlement] = useState({})
    const [inputHandle, setInputHandle] = useState({
        noRek: "",
        namaPemilikRek: ""
    })

    function handleChange (e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value
        })
    }

    function handleChangeBrandTujuan (e) {
        setSelectedDataOutletTujuan([])
        const findData = dataAllBrand.find((item) => item.moutlet_nou === e.value)
        setProfileIdBrand(findData)
        setSelectedDataBrandTujuan([e])
        getDataListOutletHandler(merchantNou, e.value)
    }

    async function getDataNamaPemilikRekeningHandler(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetOwnerName", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                setDataNamaPemilikRek(getData.data.response_data.results.mprofdtl_name)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                setDataNamaPemilikRek(getData.data.response_data.results.mprofdtl_name)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataListBrandHandler(merchantNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListOutletSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                setDataAllBrand(getData.data.response_data.results)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.moutlet_nou
                    obj.label = e.moutlet_name
                    newArr.push(obj)
                })
                setGetDataBrandTujuan(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                setDataAllBrand(getData.data.response_data.results)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.moutlet_nou
                    obj.label = e.moutlet_name
                    newArr.push(obj)
                })
                setGetDataBrandTujuan(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataListOutletHandler(merchantNou, outletNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_nou": ${outletNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetListStoreSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mstore_nou
                    obj.label = e.mstore_name
                    newArr.push(obj)
                })
                setGetDataOutletTujuan(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mstore_nou
                    obj.label = e.mstore_name
                    newArr.push(obj)
                })
                setGetDataOutletTujuan(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBankListHandler() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetBankList", { data: "" }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_id
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setGetDataBank(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_id
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setGetDataBank(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataFormDaftarSettlementHandler(profileId, settleGroupId, merchantNou, userNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "settle_group_id": ${settleGroupId}, "merchant_nou": ${merchantNou}, "user_nou": ${userNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetRegisterMerchantSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                const data = getData.data.response_data.results
                setInputHandle({...data, noRek: data.mqrismerchsettle_acc_number === null ? "" : data.mqrismerchsettle_acc_number, namaPemilikRek: data.mqrismerchsettle_acc_name === null ? "" : data.mqrismerchsettle_acc_name})
                let newArr = []
                let obj = {}
                obj.value = data.mqrismerchsettle_bank_id
                obj.label = data.mbank_name
                newArr.push(obj)
                setSelectedDataBank(obj.value === 0 ? [] : newArr)
                getDataListOutletHandler(merchantNou, data.mqrismerchsettle_bank_id)
                let newArrBrand = []
                let objBrand = {}
                objBrand.value = data.moutlet_nou
                objBrand.label = data.moutlet_name
                newArrBrand.push(objBrand)
                setSelectedDataBrandTujuan(objBrand.value === null ? [] : newArrBrand)
                setDataMerchantSettlement(data)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                const data = getData.data.response_data.results
                setInputHandle({...data, noRek: data.mqrismerchsettle_acc_number === null ? "" : data.mqrismerchsettle_acc_number, namaPemilikRek: data.mqrismerchsettle_acc_name === null ? "" : data.mqrismerchsettle_acc_name})
                let newArr = []
                let obj = {}
                obj.value = data.mqrismerchsettle_bank_id
                obj.label = data.mbank_name
                newArr.push(obj)
                setSelectedDataBank(obj.value === 0 ? [] : newArr)
                getDataListOutletHandler(merchantNou, data.mqrismerchsettle_bank_id)
                let newArrBrand = []
                let objBrand = {}
                objBrand.value = data.moutlet_nou
                objBrand.label = data.moutlet_name
                newArrBrand.push(objBrand)
                setSelectedDataBrandTujuan(objBrand.value === null ? [] : newArrBrand)
                setDataMerchantSettlement(data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function addFormDaftarSettlementHandler(profileId, settleGroupId, merchantNou, userNou, bankId, noRek, namaPemilikRek, email, merchSettleId, step) {
        try {
            setIsLoadingInfoRekeningGrup(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "merchant_nou": ${merchantNou}, "settle_group_id": ${settleGroupId}, "reff_id": ${userNou}, "bank_id": ${bankId}, "account_number": "${noRek}", "account_name": "${namaPemilikRek}", "email": "${email === undefined ? "" : email}", "fee": 0, "merch_settle_id": ${merchSettleId === undefined ? 0 : merchSettleId}, "step": ${step}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/RegisterMerchantSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                history.push(`/detail-settlement/${profileId}/${settleGroupId}`)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                history.push(`/detail-settlement/${profileId}/${settleGroupId}`)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function confirmDaftarRekening (dataNamaPemilikRek, dataMerchantSettlement, settleGroup, merchantNou, selectedDataBrandTujuan, selectedDataOutletTujuan, selectedDataBank, noRek, namaPemilikRek, step) {
        if (namaPemilikRek !== dataNamaPemilikRek) {
            setShowModalPemilikRek(true)
        } else {
            setShowModalPemilikRek(false)
            addFormDaftarSettlementHandler(profileIdBrand.mprofile_id, settleGroup, merchantNou, Number(type) === 2 ? (selectedDataBrandTujuan.length !== 0 ? selectedDataBrandTujuan[0].value : userNou) : (selectedDataOutletTujuan.length !== 0 ? selectedDataOutletTujuan[0].value : userNou), selectedDataBank.length !== 0 ? selectedDataBank[0].value : 0, noRek, namaPemilikRek, dataMerchantSettlement?.mprofdtl_email === null ? "" : dataMerchantSettlement?.mprofdtl_email, dataMerchantSettlement?.mqrismerchsettle_id === null ? 0 : dataMerchantSettlement?.mqrismerchsettle_id, step)
        }
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
        getBankListHandler()
        getDataListBrandHandler(merchantNou)
        if (Object.keys(profileIdBrand).length !== 0) {
            getDataNamaPemilikRekeningHandler(profileIdBrand.mprofile_id)
        }
        if (Number(userNou) !== 0) {
            if (Object.keys(profileIdBrand).length !== 0) {
                getDataFormDaftarSettlementHandler(profileIdBrand.mprofile_id, settleGroup, merchantNou, userNou)
            }
        }
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Detail merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah settlement</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Formulir tambah settlement</h2>
            </div>
            <div className='base-content mt-4 pb-4'>
                <div className='alert-form-info-pemilik py-4'>
                    <img src={alertIconYellow} alt="icon" />
                    <div className='ms-2'>Jika tujuan settlement brand yang anda cari tidak ada, kamu harus mendaftarkan brand terlebih dahulu melalui tombol disamping: <span style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, cursor: "pointer", textDecorationLine: "underline" }} onClick={() => history.push('/formulir-info-pemilik-brand')}>Daftar brand</span></div>
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Brand tujuan</div>
                <div className="dropdown dropSaldoPartner pt-2">
                    <ReactSelect
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        options={getDataBrandTujuan}
                        value={selectedDataBrandTujuan}
                        onChange={(e) => handleChangeBrandTujuan(e)}
                        placeholder="Pilih Brand Tujuan"
                        components={{ Option }}
                        styles={customStylesSelectedOption}
                    />
                </div>
                {
                    Number(type) === 3 && (
                        <>
                            <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Outlet tujuan</div>
                            <div className="dropdown dropSaldoPartner pt-2">
                                <ReactSelect
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={getDataOutletTujuan}
                                    value={selectedDataOutletTujuan}
                                    onChange={(selected) => setSelectedDataOutletTujuan([selected])}
                                    placeholder="Pilih Outlet Tujuan"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </div>
                        </>
                    )
                }
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama bank</div>
                <div className="dropdown dropSaldoPartner pt-2">
                    <ReactSelect
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        options={getDataBank}
                        value={selectedDataBank}
                        onChange={(selected) => setSelectedDataBank([selected])}
                        placeholder="Pilih Bank"
                        components={{ Option }}
                        styles={customStylesSelectedOption}
                    />
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nomor rekening</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="noRek" value={inputHandle.noRek} onChange={(e) => handleChange(e)} className='input-text-form' type="number" onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} placeholder='Masukan nomor rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik rekening</div>
                <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                    <input name="namaPemilikRek" value={inputHandle.namaPemilikRek} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                </div>
                <div className='d-flex justify-content-between align-items-center mt-4' >
                    <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                    <button 
                        className={(selectedDataBrandTujuan.length !== 0 && selectedDataBank.length !== 0 && inputHandle.namaPemilikRek.length !== 0 && inputHandle.noRek.length !== 0 && (Number(type) === 2 || (Number(type) === 3 && selectedDataOutletTujuan.length !== 0))) ? 'btn-next-info-usaha ms-2' : 'btn-next-info-usaha-inactive ms-2'}
                        disabled={selectedDataBrandTujuan.length === 0 || selectedDataBank.length === 0 || inputHandle.namaPemilikRek.length === 0 || inputHandle.noRek.length === 0 || (Number(type) === 3 && selectedDataOutletTujuan.length === 0)}
                        onClick={() => confirmDaftarRekening(dataNamaPemilikRek, dataMerchantSettlement, settleGroup, merchantNou, selectedDataBrandTujuan, selectedDataOutletTujuan, selectedDataBank, inputHandle.noRek, inputHandle.namaPemilikRek, 300)} 
                    >
                        Konfirmasi
                    </button>
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
                        <Button 
                            style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2"
                            onClick={() => setShowModalPemilikRek(false)}
                        >
                            Ganti pemilik rekening
                        </Button>
                        <Button 
                            style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}
                            onClick={() => addFormDaftarSettlementHandler(profileIdBrand.mprofile_id, settleGroup, merchantNou, Number(type) === 2 ? (selectedDataBrandTujuan.length !== 0 ? selectedDataBrandTujuan[0].value : userNou) : (selectedDataOutletTujuan.length !== 0 ? selectedDataOutletTujuan[0].value : userNou), selectedDataBank.length !== 0 ? selectedDataBank[0].value : 0, inputHandle.noRek, inputHandle.namaPemilikRek, dataMerchantSettlement?.mprofdtl_email === null ? "" : dataMerchantSettlement?.mprofdtl_email, dataMerchantSettlement?.mqrismerchsettle_id === null ? 0 : dataMerchantSettlement?.mqrismerchsettle_id, 300)}
                        >
                            Ya, Lanjutkan
                        </Button>
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
                        <Button onClick={() => setShowModalSimpanData(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                        <Button onClick={() => addFormDaftarSettlementHandler(profileIdBrand.mprofile_id, settleGroup, merchantNou, Number(type) === 2 ? (selectedDataBrandTujuan.length !== 0 ? selectedDataBrandTujuan[0].value : userNou) : (selectedDataOutletTujuan.length !== 0 ? selectedDataOutletTujuan[0].value : userNou), selectedDataBank.length !== 0 ? selectedDataBank[0].value : 0, inputHandle.noRek, inputHandle.namaPemilikRek, dataMerchantSettlement?.mprofdtl_email === null ? "" : dataMerchantSettlement?.mprofdtl_email, dataMerchantSettlement?.mqrismerchsettle_id === null ? 0 : dataMerchantSettlement?.mqrismerchsettle_id, 201)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>
                            {isLoadingInfoRekeningGrup ? (<>Mohon tunggu... <FontAwesomeIcon icon={faSpinner} spin /></>) : `Simpan`}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default FormTambahSettlement