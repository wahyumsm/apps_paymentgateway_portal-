import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from '@themesberg/react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import alertIconGrey from '../../../assets/icon/alert_icon_grey.svg'
import settlementOtomatis from '../../../assets/icon/settlement-otomatis.svg'
import noteIconRed from "../../../assets/icon/note_icon_red.svg";
import noteIconGreen from "../../../assets/icon/note_icon_green.svg"
import requestManual from '../../../assets/icon/request-manual.svg'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers'
import encryptData from '../../../function/encryptData'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronLeft, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import ReactSelect, { components } from 'react-select';

const PengaturanMerchant = () => {
    const { idProfile } = useParams()
    const history = useHistory()
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [expandedProgramAffiliator, setExpandedProgramAffiliator] = useState()
    const [expandedProgramCashback, setExpandedProgramCashback] = useState()
    const [expandedAdditionalFee, setExpandedAdditionalFee] = useState()

    const [showModalSyaratKetentuan, setShowModalSyaratKetentuan] = useState(false)
    const [getCheckKodeReferral, setGetCheckKodeReferral] = useState("")
    const [getDataKomisiAgen, setGetDataKomisiAgen] = useState([])
    const [selectedDataKomisiAgen, setSelectedDataKomisiAgen] = useState()

    const [getDataListPartner, setGetDataListPartner] = useState([])
    const [selectedDataListPartner, setSelectedDataListPartner] = useState([])
    const [inputHandle, setInputHandle] = useState({
        merchantCode: "",
        subPartnerId: "",
        jenisSettlement: 1,
        settlementDikirimkan: 0,
        menerimaPembayaran: 1,
        integrasiApi: 1,
        jenisFeeSettlement: 1,
        jumlahFeeSettlement: 0,
        komisiAgen: "",
        jenisKomisi: 1,
        jumlahKomisi: 0,
        adakanProgramCashbackMdr: 1,
        jenisCashback: 1,
        jumlahCashback: 0,
        adakanAdditionalFee: 1,
        jenisAdditionalFee: 1,
        jumlahAdditionalFee: 0,
        kodeRefferal: ""
    })

    function buttonColor (param) {
        if (param === "settlementOtomatis") {
            setInputHandle({
                ...inputHandle,
                jenisSettlement: 1
            })
        } else if (param === "requestManual") {
            setInputHandle({
                ...inputHandle,
                jenisSettlement: 2
            })
        } else {
            setInputHandle({
                ...inputHandle,
                jenisSettlement: 3
            })
        }
    }

    function toProsesVerifikasi () {
        history.push('/verification-process')
        window.location.reload()
    }

    function showModalSubmit () {
        setShowModalSyaratKetentuan(true)
    }

    const showCheckboxesProgramAffiliator = () => {
        if (!expandedProgramAffiliator) {
          setExpandedProgramAffiliator(true);
        } else {
          setExpandedProgramAffiliator(false);
        }
    };

    const showCheckboxesProgramCashback = () => {
        if (!expandedProgramCashback) {
          setExpandedProgramCashback(true);
        } else {
          setExpandedProgramCashback(false);
        }
    };

    const showCheckboxesAdditionalFee = () => {
        if (!expandedAdditionalFee) {
          setExpandedAdditionalFee(true);
        } else {
          setExpandedAdditionalFee(false);
        }
    };

    function handleChange(e) {
        if (e.target.name === "kodeRefferal") {
            checkReferralCodeHandler (e.target.value)
            setInputHandle({
                ...inputHandle,
                [e.target.name]: e.target.value
            })
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name]: e.target.name === "komisiAgen" ? e.target.value : Number(e.target.value)
            })
        }
    }

    async function getDataListPartnerHandler () {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/Partner/ListPartner", { data: "" }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length === 0) {
                let newArr = []
                getData.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setGetDataListPartner(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token.length !== 0) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setGetDataListPartner(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataAgenHandler (merchantCode) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_code": "${merchantCode}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetAgen", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mmerchant_id
                    obj.label = e.mmerchant_name
                    newArr.push(obj)
                })
                setGetDataKomisiAgen(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mmerchant_id
                    obj.label = e.mmerchant_name
                    newArr.push(obj)
                })
                setGetDataKomisiAgen(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataAddBrandStepFormTidakBerbadanHukum(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/GetMerchantConfig", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                const getDataConfig = getData.data.response_data.results;
                setInputHandle({
                    ...getDataConfig,
                    merchantCode: getDataConfig.mmerchant_id === null ? "" : getDataConfig.mmerchant_id,
                    jenisSettlement: getDataConfig.mprofdtl_is_auto_settlle === null ? 1 : getDataConfig.mprofdtl_is_auto_settlle, 
                    settlementDikirimkan: getDataConfig.mmerchant_settle_group_id === null ? 0 : getDataConfig.mmerchant_settle_group_id, 
                    menerimaPembayaran: getDataConfig.mprofdtl_is_alipay === null ? 2 : getDataConfig.mprofdtl_is_alipay, 
                    integrasiApi: getDataConfig.mprofdtl_integrate_api === null ? 2 : getDataConfig.mprofdtl_integrate_api, 
                    jenisFeeSettlement: getDataConfig.mprofilefee_settle_type === null ? 1 : getDataConfig.mprofilefee_settle_type, 
                    jumlahFeeSettlement: getDataConfig.mprofilefee_settle_fee === null ? 0 : getDataConfig.mprofilefee_settle_fee, 
                    jenisKomisi: getDataConfig.mprofilefee_affiliation_fee_type === null ? 0 : getDataConfig.mprofilefee_affiliation_fee_type, 
                    jumlahKomisi: getDataConfig.mprofilefee_affiliation_fee === null ? 0 : getDataConfig.mprofilefee_affiliation_fee,
                    adakanProgramCashbackMdr: getDataConfig.mprofilefee_cashback_is_active === null ? 2 : getDataConfig.mprofilefee_cashback_is_active,
                    jenisCashback: getDataConfig.mprofilefee_cashback_fee_type === null ? 0 : getDataConfig.mprofilefee_cashback_fee_type,
                    jumlahCashback: getDataConfig.mprofilefee_cashback_fee === null ? 0 : getDataConfig.mprofilefee_cashback_fee,
                    adakanAdditionalFee: getDataConfig.mprofilefee_additionalfee_is_active === null ? 2 : getDataConfig.mprofilefee_additionalfee_is_active,
                    jenisAdditionalFee: getDataConfig.mprofilefee_additional_fee_type === null ? 0 : getDataConfig.mprofilefee_additional_fee_type,
                    jumlahAdditionalFee: getDataConfig.mprofilefee_additional_fee === null ? 0 : getDataConfig.mprofilefee_additional_fee,
                    kodeRefferal: getDataConfig.mprofilefee_partner_referal_code === null ? "" : getDataConfig.mprofilefee_partner_referal_code
                })
                let newArrListPartner = []
                let objListPartner = {}
                objListPartner.value = getDataConfig.mpartnerqris_subpartner_id
                objListPartner.label = getDataConfig.mpartner_name
                newArrListPartner.push(objListPartner)
                setSelectedDataListPartner((objListPartner.value === null || objListPartner.value === "") ? [] : newArrListPartner)
                let newArrAgenKomisi = []
                let objAgenKomisi = {}
                objAgenKomisi.value = getDataConfig.mmerchant_mmerchantcode_aff_id
                objAgenKomisi.label = getDataConfig.mmerchant_name
                newArrAgenKomisi.push(objAgenKomisi)
                setSelectedDataKomisiAgen(objAgenKomisi.value === null ? [] : newArrAgenKomisi)
                getDataAgenHandler (getDataConfig.mmerchant_id === null ? "" : getDataConfig.mmerchant_id)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                const getDataConfig = getData.data.response_data.results;
                setInputHandle({
                    ...getDataConfig,
                    merchantCode: getDataConfig.mmerchant_id === null ? "" : getDataConfig.mmerchant_id,
                    jenisSettlement: getDataConfig.mprofdtl_is_auto_settlle === null ? 1 : getDataConfig.mprofdtl_is_auto_settlle, 
                    settlementDikirimkan: getDataConfig.mmerchant_settle_group_id === null ? 0 : getDataConfig.mmerchant_settle_group_id, 
                    menerimaPembayaran: getDataConfig.mprofdtl_is_alipay === null ? 2 : getDataConfig.mprofdtl_is_alipay, 
                    integrasiApi: getDataConfig.mprofdtl_integrate_api === null ? 2 : getDataConfig.mprofdtl_integrate_api, 
                    jenisFeeSettlement: getDataConfig.mprofilefee_settle_type === null ? 1 : getDataConfig.mprofilefee_settle_type, 
                    jumlahFeeSettlement: getDataConfig.mprofilefee_settle_fee === null ? 0 : getDataConfig.mprofilefee_settle_fee, 
                    jenisKomisi: getDataConfig.mprofilefee_affiliation_fee_type === null ? 0 : getDataConfig.mprofilefee_affiliation_fee_type, 
                    jumlahKomisi: getDataConfig.mprofilefee_affiliation_fee === null ? 0 : getDataConfig.mprofilefee_affiliation_fee,
                    adakanProgramCashbackMdr: getDataConfig.mprofilefee_cashback_is_active === null ? 2 : getDataConfig.mprofilefee_cashback_is_active,
                    jenisCashback: getDataConfig.mprofilefee_cashback_fee_type === null ? 0 : getDataConfig.mprofilefee_cashback_fee_type,
                    jumlahCashback: getDataConfig.mprofilefee_cashback_fee === null ? 0 : getDataConfig.mprofilefee_cashback_fee,
                    adakanAdditionalFee: getDataConfig.mprofilefee_additionalfee_is_active === null ? 2 : getDataConfig.mprofilefee_additionalfee_is_active,
                    jenisAdditionalFee: getDataConfig.mprofilefee_additional_fee_type === null ? 0 : getDataConfig.mprofilefee_additional_fee_type,
                    jumlahAdditionalFee: getDataConfig.mprofilefee_additional_fee === null ? 0 : getDataConfig.mprofilefee_additional_fee,
                    kodeRefferal: getDataConfig.mprofilefee_partner_referal_code === null ? "" : getDataConfig.mprofilefee_partner_referal_code
                })
                let newArrListPartner = []
                let objListPartner = {}
                objListPartner.value = getDataConfig.mpartnerqris_subpartner_id
                objListPartner.label = getDataConfig.mpartner_name
                newArrListPartner.push(objListPartner)
                setSelectedDataListPartner(objListPartner.value === null ? [] : newArrListPartner)
                let newArrAgenKomisi = []
                let objAgenKomisi = {}
                objAgenKomisi.value = getDataConfig.mmerchant_mmerchantcode_aff_id
                objAgenKomisi.label = getDataConfig.mmerchant_name
                newArrAgenKomisi.push(objAgenKomisi)
                setSelectedDataKomisiAgen((objAgenKomisi.value === null || objAgenKomisi.value === "") ? [] : newArrAgenKomisi)
                getDataAgenHandler (getDataConfig.mmerchant_id === null ? "" : getDataConfig.mmerchant_id)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function savePengaturanTambahMerchantBrandHandler(settleTypeId, settleDikirmKemana, menerimaPembayaran, integrasiApi, subPartnerId, idProfile, merchantCode, additionalFee, additionalFeeType, adakanAdditionalFee, affiliationFee, affiliationFeeType, komisiAgen, cashBackFee, cashBackFeeType, adakanCashback, settleFee, settleFeeType, refferalCode, step, position) {
        const auth = "Bearer " + getToken()
        const dataParams = encryptData(`{"settle_type_id": ${settleTypeId}, "settle_group_id": ${settleDikirmKemana}, "alipay_wechat": ${menerimaPembayaran}, "api_integrated": ${integrasiApi}, "subpartner_id": "${subPartnerId}", "profile_id": ${idProfile}, "merchant_code": "${merchantCode}", "additional_fee": ${additionalFee}, "additional_fee_type": ${additionalFeeType}, "additional_isactive": ${adakanAdditionalFee}, "affiliation_fee": ${affiliationFee}, "affiliation_fee_type": ${affiliationFeeType}, "aff_id": "${komisiAgen}", "cashback_fee": ${cashBackFee}, "cashback_fee_type": ${cashBackFeeType}, "cashback_isactive": ${adakanCashback}, "settle_fee": ${settleFee}, "settle_type_fee": ${settleFeeType}, "partner_refferal_code": "${refferalCode}", "step": ${step}}`)
        const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
        }
        const getData = await axios.post(BaseURL + "/QRIS/MerchantConfig", {data: dataParams}, { headers: headers })
        if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
            if (position === "next") {
                if (settleDikirmKemana === 101) {
                    history.push('/formulir-daftar-settlement')
                } 
            } else {
                history.push('/daftar-merchant-qris')
            }
        } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
            setUserSession(getData.data.response_new_token)
            if (position === "next") {
                if (settleDikirmKemana === 101) {
                    history.push('/formulir-daftar-settlement')
                } 
            } else {
                history.push('/daftar-merchant-qris')
            }
        }
    }

    async function checkReferralCodeHandler (referralCode) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_refferal_code": "${referralCode}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/CheckRefferalCode", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (referralCode.length !== 0) {
                    setGetCheckKodeReferral(getData.data.response_data.results.error_text)
                } else {
                    setGetCheckKodeReferral("")
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (referralCode.length !== 0) {
                    setGetCheckKodeReferral(getData.data.response_data.results.error_text)
                } else {
                    setGetCheckKodeReferral("")
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    console.log(getCheckKodeReferral, "getCheckKodeReferral");

    function backPage () {
        setShowModalSimpanData(true)
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
        getDataListPartnerHandler ()
        if (idProfile !== undefined) {
            getDataAddBrandStepFormTidakBerbadanHukum(idProfile)
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
                <div className='base-content mt-3'>
                    <div className="head-title"> 
                        <h2 className="h5" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Settlement</h2>
                    </div>
                    <div className='text-setting mt-4'>Jenis settlement</div>
                    <div className='d-flex justify-content-between align-items-center mt-2'>
                        <div className={inputHandle.jenisSettlement === 1 ? 'card-when-click mb-3 me-1' : 'card-jenis-usaha mb-3 me-1'} onClick={() => buttonColor("settlementOtomatis")} id='settlementOtomatis'>
                            <img src={settlementOtomatis} alt='qris' />
                            <div className='text-start'>
                                <div className='card-text-title'>Settlement otomatis</div>
                                <div className='card-text-subtitle'>Settlement dilakukan H+1 secara otomatis setiap jam 08:00-15:00 WIB selama hari kerja.</div>
                            </div>
                        </div>
                        <div className={inputHandle.jenisSettlement === 2 ? 'card-when-click mb-3 ms-1' : 'card-jenis-usaha mb-3 ms-1'} onClick={() => buttonColor("requestManual")} id='requestManual'>
                            <img src={requestManual} alt='qris' />
                            <div className='text-start'>
                                <div className='card-text-title'>Request manual</div>
                                <div className='card-text-subtitle'>Settlement baru akan dilakukan saat merchant melakukan request melalui aplikasi / dashboard.</div>
                            </div>
                        </div>
                        <div className={inputHandle.jenisSettlement === 3 ? 'card-when-click mb-3 ms-1' : 'card-jenis-usaha mb-3 ms-1'} onClick={() => buttonColor("requestSameDay")} id='requestSameDay'>
                            <img src={requestManual} alt='qris' />
                            <div className='text-start'>
                                <div className='card-text-title'>Request Same Day</div>
                                <div className='card-text-subtitle'>Settlement dilakukan secara otomatis dan akan langsung diproses dihari yang sama.</div>
                            </div>
                        </div>
                    </div>
                    <div className='desc-setting'>
                        <div><img src={alertIconGrey} alt="alert" /></div>
                        <div className='ms-2'>
                            • Settlement dilakukan dengan pendapatan transaksi minimal Rp 50.000 <br/>
                            • Settlement otomatis reguler dan Settlement manual dikenakan biaya admin sebesar <b> Rp 5.000. </b> <br/>
                            • Settlement otomatis reguler dan Settlement manual hanya dilakukan tiap hari dan jam kerja, <b> Senin - Jum'at </b> pukul <b> 08.00 WIB - 15.00 WIB. </b> <br/>
                            • Settlement otomatis same day akan dilakukan setiap hari dan jam kerja, pukul <b> 13.00 WIB. </b> <br/>
                            • Settlement otomatis same day akan memproses setiap transaksi yang dilakukan dibawah pukul <b> 12.00 WIB, </b> Jika melewati itu akan diproses di esok <br/> <span className='ms-2'>harinya.</span>
                        </div>
                    </div>
                    {
                        inputHandle.jenisSettlement === 3 && (
                            <>
                                <div className='text-setting mt-3'>Jenis fee settlement same day</div>
                                <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="fixed"
                                            name='jenisFeeSettlement'
                                            value={1}
                                            checked={inputHandle.jenisFeeSettlement === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="fixed"
                                        >
                                            Fixed
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline ms-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="persentase"
                                            name='jenisFeeSettlement'
                                            value={2}
                                            checked={inputHandle.jenisFeeSettlement === 2 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="persentase"
                                        >
                                            Persentase
                                        </label>
                                    </div>
                                </div>
                                <div className='text-setting mt-3'>Jumlah fee settlement same day</div>
                                <div className='d-flex justify-content-start align-items-center mt-2'>
                                    <input name='jumlahFeeSettlement' value={inputHandle.jumlahFeeSettlement} onChange={(e) => handleChange(e)} className='input-text-user' style={{ width: "20%" }} placeholder='Rp 0' />
                                    <div className='ms-3 text-setting'>Per Settlement</div>
                                </div>
                            </>
                        )
                    }
                    <div className='text-setting mt-3'>Kemana settlement akan dikirimkan ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 600 }}>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="RekeningGrup"
                                name='settlementDikirimkan'
                                value={101}
                                checked={inputHandle.settlementDikirimkan === 101 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="RekeningGrup"
                            >
                                Rekening Grup
                            </label>
                        </div>
                        <div className="form-check form-check-inline ms-4">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="RekeningBrand"
                                name='settlementDikirimkan'
                                value={102}
                                checked={inputHandle.settlementDikirimkan === 102 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="RekeningBrand"
                            >
                                Rekening Brand
                            </label>
                        </div>
                        <div className="form-check form-check-inline ms-4">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="RekeningOutlet"
                                name='settlementDikirimkan'
                                value={103}
                                checked={inputHandle.settlementDikirimkan === 103 && true}
                                onChange={(e) => handleChange(e)}
                            />
                            <label
                                className="form-check-label"
                                style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                for="RekeningOutlet"
                            >
                                Rekening Outlet
                            </label>
                        </div>
                    </div>
                    <div className='text-setting mt-3'>QRIS anda mau menerima pembayaran dari Alipay dan WeChatPay ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Ya"
                                name='menerimaPembayaran'
                                value={1}
                                checked={inputHandle.menerimaPembayaran === 1 && true}
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
                        <div className="form-check form-check-inline ms-4">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Tidak"
                                name='menerimaPembayaran'
                                value={0}
                                checked={inputHandle.menerimaPembayaran === 0 && true}
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
                    <div className='text-setting mt-3'>Apakah ingin melakukan integrasi dengan API ?</div>
                    <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                    <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Ya"
                                name='integrasiApi'
                                value={1}
                                checked={inputHandle.integrasiApi === 1 && true}
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
                        <div className="form-check form-check-inline ms-4">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="Tidak"
                                name='integrasiApi'
                                value={0}
                                checked={inputHandle.integrasiApi === 0 && true}
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
                        inputHandle.integrasiApi === 1 && (
                            <>
                                <div className='text-setting mt-3'>Partner Merchant</div>
                                <div className='dropdown dropPartnerAddUser pt-2 '>
                                    <ReactSelect
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={getDataListPartner}
                                        value={selectedDataListPartner}
                                        onChange={(selected) => setSelectedDataListPartner([selected])}
                                        placeholder="Pilih Partner Merchant"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                            </>
                        )
                    }

                    <div className="head-title"> 
                        <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Tambahan Lainnya</h2>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4' style={{ cursor: "pointer" }} onClick={showCheckboxesProgramAffiliator}>
                        <div style={{ fontFamily: "Exo", fontSize: 14, fontWeight: 700 }}>Program Affiliator</div>
                        {
                            expandedProgramAffiliator ? (
                                <FontAwesomeIcon icon={faChevronUp} className="me-3" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="me-3" />
                            )
                        }
                    </div>
                    {
                        expandedProgramAffiliator && (
                            <>
                                <div className='text-setting mt-3'>Komisi agen (Afiliator)</div>
                                <div className='dropdown dropPartnerAddUser pt-2 '>
                                    <ReactSelect
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={getDataKomisiAgen}
                                        value={selectedDataKomisiAgen}
                                        onChange={(selected) => setSelectedDataKomisiAgen([selected])}
                                        placeholder="Pilih Komisi Agen"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                                <div className='text-setting mt-3'>Jenis komisi</div>
                                <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="fixed"
                                            name='jenisKomisi'
                                            value={1}
                                            checked={inputHandle.jenisKomisi === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="fixed"
                                        >
                                            Fixed
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline ms-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="persentase"
                                            name='jenisKomisi'
                                            value={2}
                                            checked={inputHandle.jenisKomisi === 2 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="persentase"
                                        >
                                            Persentase
                                        </label>
                                    </div>
                                </div>
                                <div className='text-setting mt-3'>Jumlah komisi</div>
                                <div className='d-flex justify-content-start align-items-center mt-2'>
                                    <input name='jumlahKomisi' value={inputHandle.jumlahKomisi} onChange={(e) => handleChange(e)} className='input-text-user' style={{ width: "20%" }} placeholder='Rp 1.000' />
                                    <div className='ms-3 text-setting'>Per Transaksi</div>
                                </div>
                            </>
                        )
                    }

                    <div className='d-flex justify-content-between align-items-center mt-4' style={{ cursor: "pointer" }} onClick={showCheckboxesProgramCashback}>
                        <div style={{ fontFamily: "Exo", fontSize: 14, fontWeight: 700 }}>Program Cashback</div>
                        {
                            expandedProgramCashback ? (
                                <FontAwesomeIcon icon={faChevronUp} className="me-3" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="me-3" />
                            )
                        }
                    </div>
                    {
                        expandedProgramCashback && (
                            <>
                                <div className='text-setting mt-3'>Apakah ingin mengadakan program Cashback MDR ?</div>
                                <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="ya"
                                            name='adakanProgramCashbackMdr'
                                            value={1}
                                            checked={inputHandle.adakanProgramCashbackMdr === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="ya"
                                        >
                                            Ya
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline ms-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="tidak"
                                            name='adakanProgramCashbackMdr'
                                            value={0}
                                            checked={inputHandle.adakanProgramCashbackMdr === 0 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="tidak"
                                        >
                                            Tidak
                                        </label>
                                    </div>
                                </div>
                                <div className='text-setting mt-3'>Jenis Cashback</div>
                                <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="fixed"
                                            name='jenisCashback'
                                            value={1}
                                            checked={inputHandle.jenisCashback === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="fixed"
                                        >
                                            Fixed
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline ms-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="persentase"
                                            name='jenisCashback'
                                            value={2}
                                            checked={inputHandle.jenisCashback === 2 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="persentase"
                                        >
                                            Persentase
                                        </label>
                                    </div>
                                </div>
                                <div className='text-setting mt-3'>Jumlah cashback</div>
                                <div className='d-flex justify-content-start align-items-center mt-2'>
                                    <input name="jumlahCashback" value={inputHandle.jumlahCashback} onChange={(e) => handleChange(e)} className='input-text-user' style={{ width: "20%" }} placeholder='Rp 0' />
                                    <div className='ms-3 text-setting'>Per Transaksi</div>
                                </div>
                            </>
                        )
                    }

                    <div className='d-flex justify-content-between align-items-center mt-4' style={{ cursor: "pointer" }} onClick={showCheckboxesAdditionalFee}>
                        <div style={{ fontFamily: "Exo", fontSize: 14, fontWeight: 700 }}>Additional Fee</div>
                        {
                            expandedAdditionalFee ? (
                                <FontAwesomeIcon icon={faChevronUp} className="me-3" />
                            ) : (
                                <FontAwesomeIcon icon={faChevronDown} className="me-3" />
                            )
                        }
                    </div>
                    {
                        expandedAdditionalFee && (
                            <>
                                <div className='text-setting mt-3'>Apakah ingin mengadakan Additional Fee ?</div>
                                <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="ya"
                                            name='adakanAdditionalFee'
                                            value={1}
                                            checked={inputHandle.adakanAdditionalFee === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="ya"
                                        >
                                            Ya
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline ms-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="tidak"
                                            name='adakanAdditionalFee'
                                            value={0}
                                            checked={inputHandle.adakanAdditionalFee === 0 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="tidak"
                                        >
                                            Tidak
                                        </label>
                                    </div>
                                </div>
                                <div className='text-setting mt-3'>Jenis additional fee</div>
                                <div className='d-flex justify-content-start align-items-center py-2' style={{ width: 442 }}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="fixed"
                                            name='jenisAdditionalFee'
                                            value={1}
                                            checked={inputHandle.jenisAdditionalFee === 1 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="fixed"
                                        >
                                            Fixed
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline ms-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="persentase"
                                            name='jenisAdditionalFee'
                                            value={2}
                                            checked={inputHandle.jenisAdditionalFee === 2 && true}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label
                                            className="form-check-label"
                                            style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}
                                            for="persentase"
                                        >
                                            Persentase
                                        </label>
                                    </div>
                                </div>
                                <div className='text-setting mt-3'>Jumlah additional fee</div>
                                <div className='d-flex justify-content-start align-items-center mt-2'>
                                    <input name="jumlahAdditionalFee" value={inputHandle.jumlahAdditionalFee} onChange={(e) => handleChange(e)} className='input-text-user' style={{ width: "20%" }} placeholder='Rp 0' />
                                    <div className='ms-3 text-setting'>Per Transaksi</div>
                                </div>
                            </>
                        )
                    }

                    <div className='text-setting mt-3'>Kode Referral</div>
                    <input name="kodeRefferal" value={inputHandle.kodeRefferal} onChange={(e) => handleChange(e)} className='input-text-user mt-2' placeholder='Masukkan kode referral' />
                    {
                        getCheckKodeReferral.length !== 0 ? (
                            <div className="mt-2 d-flex justify-content-start align-items-center" style={{ color: getCheckKodeReferral === "Tidak Ada Merchant Yang Terhubung Ke Refferal Code, Silahkan Di Cek Kembali Refferal Code Tersebut!" ? "#B9121B" : "#3DB54A", fontSize: 12 }}>
                                <img src={(getCheckKodeReferral === "Tidak Ada Merchant Yang Terhubung Ke Refferal Code, Silahkan Di Cek Kembali Refferal Code Tersebut!" ? noteIconRed : noteIconGreen)} className="me-2" alt="notice" /> <span>{getCheckKodeReferral}</span>
                            </div>
                        ) : ""
                    }

                    <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
                        <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                        <button 
                            className='btn-next-info-usaha ms-2' 
                            onClick={() => 
                                savePengaturanTambahMerchantBrandHandler(
                                    inputHandle.jenisSettlement, 
                                    inputHandle.settlementDikirimkan, 
                                    inputHandle.menerimaPembayaran, 
                                    inputHandle.integrasiApi, 
                                    selectedDataListPartner.length !== 0 ? selectedDataListPartner[0].value : "",
                                    idProfile, 
                                    inputHandle.merchantCode, 
                                    inputHandle.jumlahAdditionalFee, 
                                    inputHandle.jenisAdditionalFee, 
                                    inputHandle.adakanAdditionalFee === 2 ? 0 : inputHandle.adakanAdditionalFee, 
                                    inputHandle.jumlahKomisi, 
                                    inputHandle.jenisKomisi, 
                                    selectedDataKomisiAgen.length !== 0 ? selectedDataKomisiAgen[0].value : "",
                                    inputHandle.jumlahCashback, 
                                    inputHandle.jenisCashback, 
                                    inputHandle.adakanProgramCashbackMdr === 2 ? 0 : inputHandle.adakanProgramCashbackMdr, 
                                    inputHandle.jumlahFeeSettlement, 
                                    inputHandle.jenisFeeSettlement, 
                                    inputHandle.kodeRefferal,
                                    200,
                                    "next"
                                )
                            }
                        >
                            Konfirmasi
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
                        <Button 
                            style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}
                            onClick={() => 
                                savePengaturanTambahMerchantBrandHandler(
                                    inputHandle.jenisSettlement, 
                                    inputHandle.settlementDikirimkan, 
                                    inputHandle.menerimaPembayaran, 
                                    inputHandle.integrasiApi, 
                                    selectedDataListPartner.length !== 0 ? selectedDataListPartner[0].value : "",
                                    idProfile, 
                                    inputHandle.merchantCode, 
                                    inputHandle.jumlahAdditionalFee, 
                                    inputHandle.jenisAdditionalFee, 
                                    inputHandle.adakanAdditionalFee === 2 ? 0 : inputHandle.adakanAdditionalFee, 
                                    inputHandle.jumlahKomisi, 
                                    inputHandle.jenisKomisi, 
                                    selectedDataKomisiAgen.length !== 0 ? selectedDataKomisiAgen[0].value : "",
                                    inputHandle.jumlahCashback, 
                                    inputHandle.jenisCashback, 
                                    inputHandle.adakanProgramCashbackMdr === 2 ? 0 : inputHandle.adakanProgramCashbackMdr, 
                                    inputHandle.jumlahFeeSettlement, 
                                    inputHandle.jenisFeeSettlement, 
                                    inputHandle.kodeRefferal,
                                    2,
                                    "back"
                                )
                            }
                        >
                            Simpan
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                    size="lg"
                    centered
                    show={showModalSyaratKetentuan}
                    onHide={() => setShowModalSyaratKetentuan(false)}
                    style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                    className='modal-syarat-ketentuan'
                >
                    <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                            <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Syarat dan Ketentuan</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "start", marginTop: 20, marginBottom: 8 }}>
                            <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-start">nulla. Egestas consectetur etiam dolor augue morbi cursus eget non consequat. Natoque nunc odio enim proin a lectus.</p>
                        </div>
                        <div className='my-1 merchant-modal-text'>Merchant registration Ezeelink</div>
                        <div className='my-1 merchant-modal-text'>Merchant Ezeelink</div>
                        <div className='my-2'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Seluruh transaksi saya tidak terkait pencucian uang dan pendanaan terorisme"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                            />
                        </div>
                        <div className='my-2'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Saya memastikan bahwa seluruh data yang saya isi adalah benar"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                            />
                        </div>
                        <div className='my-2'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Seluruh informasi transaksi akan dikirim ke nomor telepon dan/atau email yang didaftarkan"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                                />
                        </div>
                        <div className='text-desc-modal'>Vitae quam bibendum at sit urna libero nulla aliquam. Amet netus velit feugiat neque auctor. Sed ut velit posuere a. Morbi fringilla ac turpis sit at massa integer integer faucibus. Semper nunc eu quis </div>
                        <div className='mb-3 mt-3'>
                            <Form.Check
                                className='checklist-modal-confirm'
                                label="Saya telah membaca dan menyetujui semua syarat dan ketentuan diatas"
                                id="statusId"
                                // onChange={handleChangeCheckBoxConfirm}
                                // checked={isCheckedConfirm}
                            />
                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                            <Button style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }} onClick={() => toProsesVerifikasi()}>Submit data saya</Button>
                        </div>
                    </Modal.Body>
                </Modal>
        </>
    )
}

export default PengaturanMerchant