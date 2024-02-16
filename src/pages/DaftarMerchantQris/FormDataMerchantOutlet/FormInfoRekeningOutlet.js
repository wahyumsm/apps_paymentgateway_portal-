import { Button, Form, Modal } from '@themesberg/react-bootstrap'
import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const FormInfoRekeningOutlet = () => {
    const history = useHistory()
    const { settleGroup, merchantNou, userNou} = useParams()
    const [showModalPemilikRek, setShowModalPemilikRek] = useState(false)
    const [showModalKonfirmasiData, setShowModalKonfirmasiData] = useState(false)
    const [showModalSimpanData, setShowModalSimpanData] = useState(false)
    const [getDataBank, setgetDataBank] = useState([])
    const [dataMerchantSettlement, setDataMerchantSettlement] = useState({})
    const [selectedDataBank, setSelectedDataBank] = useState([])
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
                setgetDataBank(newArr)
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                let newArr = []
                getData.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_id
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setgetDataBank(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataFormDaftarSettlementHandler(settleGroupId, merchantNou, userNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"settle_group_id": ${settleGroupId}, "merchant_nou": ${merchantNou}, "user_nou": ${userNou}}`)
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
                setSelectedDataBank(obj.value === null ? [] : newArr)
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
                setSelectedDataBank(obj.value === null ? [] : newArr)
                setDataMerchantSettlement(data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    console.log(selectedDataBank, "selectedDataBank");

    async function addFormDaftarSettlementHandler(profileId, settleGroupId, merchantNou, userNou, bankId, noRek, namaPemilikRek, email, merchSettleId, step) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}, "merchant_nou": ${merchantNou}, "settle_group_id": ${settleGroupId}, "reff_id": ${userNou}, "bank_id": ${bankId}, "account_number": "${noRek}", "account_name": "${namaPemilikRek}", "email": "${email}", "fee": 0, "merch_settle_id": ${merchSettleId}, "step": ${step}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getData = await axios.post(BaseURL + "/QRIS/RegisterMerchantSettlement", { data: dataParams }, { headers: headers })
            if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token === null) {
                if (step === 3) {
                    history.push(`/daftar-merchant-qris`)
                } else {
                    history.push(`/detail-merchant-brand`)
                }
            } else if (getData.status === 200 && getData.data.response_code === 200 && getData.data.response_new_token !== null) {
                setUserSession(getData.data.response_new_token)
                if (step === 3) {
                    history.push(`/daftar-merchant-qris`)
                } else {
                    history.push(`/detail-merchant-brand`)
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
        if (settleGroup !== undefined) {
            getDataFormDaftarSettlementHandler(settleGroup, merchantNou, userNou)
        }
        getBankListHandler()
    }, [])
    

    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
                <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push('/daftar-merchant-qris')} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Merchant Brand</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah merchant</span></span>
                <div className="d-flex justify-content-start align-items-center head-title"> 
                    <FontAwesomeIcon onClick={() => backPage()} icon={faChevronLeft} className="me-3 mt-1" style={{cursor: "pointer"}} />
                    <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Tambah Outlet</h2>
                </div>
                <div className='base-content mt-4'>
                    <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }} className=''>Informasi Rekening Outlet</div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-4'>Nama Bank</div>
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
                        <input name="noRek" value={inputHandle.noRek} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nomor rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 400, fontSize: 14, color: "#383838" }} className='pt-3'>Nama pemilik rekening</div>
                    <div className='pt-2 d-flex justify-content-end align-items-center position-relative'>
                        <input name="namaPemilikRek" value={inputHandle.namaPemilikRek} onChange={(e) => handleChange(e)} className='input-text-form' placeholder='Masukan nama rekening' style={{ fontFamily: 'Nunito', fontSize: 14, color: "#383838" }} /*placeholder='Masukkan Nama Perusahaan'*/ />
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4 pb-4' >
                        <button className='btn-prev-info-usaha me-2'>Sebelumnya</button>
                        <button onClick={() => addFormDaftarSettlementHandler(dataMerchantSettlement?.mprofile_id, settleGroup, merchantNou, userNou, selectedDataBank.length !== 0 ? selectedDataBank[0].value : "", inputHandle.noRek, inputHandle.namaPemilikRek, dataMerchantSettlement?.mprofdtl_email === null ? "" : dataMerchantSettlement?.mprofdtl_email, dataMerchantSettlement?.mqrismerchsettle_id === null ? 0 : dataMerchantSettlement?.mqrismerchsettle_id, 300)} className='btn-next-info-usaha ms-2'>Konfirmasi</button>
                    </div>
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
                        <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Ganti pemilik rekening</Button>
                        <Button style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya, Lanjutkan</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalKonfirmasiData}
                onHide={() => setShowModalKonfirmasiData(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Konfirmasi data anda</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Apakah anda yakin dengan data yang sudah anda masukan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Kembali</Button>
                        <Button style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Konfirmasi</Button>
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
                        <Button onClick={() => addFormDaftarSettlementHandler(dataMerchantSettlement?.mprofile_id, settleGroup, merchantNou, userNou, selectedDataBank.length !== 0 ? selectedDataBank[0].value : "", inputHandle.noRek, inputHandle.namaPemilikRek, dataMerchantSettlement?.mprofdtl_email === null ? "" : dataMerchantSettlement?.mprofdtl_email, dataMerchantSettlement?.mqrismerchsettle_id === null ? 0 : dataMerchantSettlement?.mqrismerchsettle_id, 201)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FormInfoRekeningOutlet