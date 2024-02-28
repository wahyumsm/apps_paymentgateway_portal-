import React, { useMemo } from 'react'
import SubAccountComponent from '../../components/SubAccountComponent'
import { useHistory } from 'react-router-dom'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession, CustomLoader } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Button, Col, Form, Modal, Row } from '@themesberg/react-bootstrap'
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import chevron from "../../assets/icon/chevron_down_icon.svg"
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import noteIconGreen from "../../assets/icon/note_icon_green.svg"
import transferSuccess from "../../assets/icon/berhasiltopup_icon.svg"
import transferProses from "../../assets/icon/transaksiproses_icon.svg"
import transferFailed from "../../assets/icon/gagaltopup_icon.svg"
import OtpInput from 'react-otp-input'
import axios from 'axios'
import { useEffect } from 'react'
import FilterSubAccount from '../../components/FilterSubAccount'
import Countdown from 'react-countdown'
import encryptData from '../../function/encryptData'
import CurrencyInput from 'react-currency-input-field'
import { eng } from '../../components/Language'

const TransferSubAccount = () => {

    const history = useHistory()
    const user_role = getRole()
    const access_token = getToken()
    const [showDaftarRekening, setShowDaftarRekening] = useState(false)
    const [showBank, setShowBank] = useState(false)
    const [showTransfer, setShowTransfer] = useState(false)
    const [showModalInputCode, setShowModalInputCode] = useState(false)
    const [showModalMaxInputOtp, setShowModalMaxInputOtp] = useState(false)
    const [toCountdown, setToCountdown] = useState(false)
    const [showTransferBerhasil, setShowTransferBerhasil] = useState(false)
    const [otp, setOtp] = useState('')
    const renderer = ({ minutes, seconds }) => {  return <span>{minutes !== 0 && `${minutes} menit`} {seconds} detik</span>; }
    const [listBank, setListBank] = useState([])
    const [listRekening, setListRekening] = useState([])
    const [listAkunPartner, setListAkunPartner] = useState([])
    const [checking, setChecking] = useState({})
    const [transferFee, setTransferFee] = useState({})
    const [sendOtp, setSendOtp] = useState({})
    const [dataConfirm, setDataConfirm] = useState({})
    const [editNominal, setEditNominal] = useState(false)
    const [msg, setMsg] = useState("")
    const [errMsg, setErrMsg] = useState('')
    const [clickCheck, setClickCheck] = useState(false)
    const [isChecked, setIsChecked] = useState(false);
    const [filterTextBank, setFilterTextBank] = useState('')
    const [filterTextRekening, setFilterTextRekening] = useState('')
    const filterItemsBank = listBank.filter(
        item => (item.mbank_name && item.mbank_name.toLowerCase().includes(filterTextBank.toLowerCase())) || (item.mbank_code && item.mbank_code.toLowerCase().includes(filterTextBank.toLowerCase()))
    )
    const filterItemsRekening = listRekening.filter(
        item => (item.moffshorebankacclist_name && item.moffshorebankacclist_name.toLowerCase().includes(filterTextRekening.toLowerCase())) || (item.moffshorebankacclist_number && item.moffshorebankacclist_number.toLowerCase().includes(filterTextRekening.toLowerCase()))
    )

    const [inputHandle, setInputHandle] = useState({
        akunPartner: "",
        nomorAkun: "",
        namaAkun:""
    })

    const [inputData, setInputData] = useState({
        bankName: "",
        bankCode: ""
    })

    const [inputDataRekening, setInputDataRekening] = useState({
        noRek: ""
    })

    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };

    function handleChangeOtp (value) {
        setOtp(value)
        setErrMsg("")
    }

    const [inputTransfer, setInputTransfer] = useState ({
        nominal: "",
        desc: ""
    })

    const subHeaderComponentMemoBank = useMemo(() => {
        return (
            <FilterSubAccount filterText={filterTextBank} onFilter={e => setFilterTextBank(e.target.value)} title={language === null ? eng.cariDaftarBank : language.cariDaftarBank} placeholder={language === null ? eng.placeholderNamaKodeBank : language.placeholderNamaKodeBank} />
        );	}, [filterTextBank]
    );

    const subHeaderComponentMemoRekening = useMemo(() => {
        return (
            <FilterSubAccount filterText={filterTextRekening} onFilter={e => setFilterTextRekening(e.target.value)} title={language === null ? eng.cariDaftarBank : language.cariDaftarBank} placeholder={language === null ? eng.placeholderNamaKodeBank : language.placeholderNamaKodeBank} />
        );	}, [filterTextRekening]
    );

    const handleRowClicked = row => {
        setFilterTextBank('')
        filterItemsBank.map(item => {
            if (row.mbank_code === item.mbank_code) {
                setInputData({
                    bankName: row.mbank_name,
                    bankCode: row.mbank_code
                });
                setShowBank(false)
                feeTransferHandler(row.mbank_code)
            }
        });
    };

    const handleRowClickedRekening = row => {
        setFilterTextRekening('')
        setClickCheck(false)
        setIsCheckedAccBankButton(false)
        setChecking({})
        filterItemsRekening.map(item => {
            if (row.moffshorebankacclist_number === item.moffshorebankacclist_number) {
                setInputDataRekening({
                    noRek: row.moffshorebankacclist_number
                });
                setInputData({
                    bankCode: row.moffshorebankacclist_bank_code,
                    bankName: row.mbank_name
                })
                setShowDaftarRekening(false)
                feeTransferHandler(row.moffshorebankacclist_bank_code)
            }
        });
    };

    function handleChangeRek(e) {
        setClickCheck(false)
        setIsCheckedAccBankButton(false)
        setChecking({})
        setInputDataRekening({
            ...inputDataRekening,
            [e.target.name] : e.target.value
        })
    }

    function handleChangeTransfer(e, listAkun) {
        listAkun = listAkun.find(item => item.partner_id === e.target.value)
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
            nomorAkun: listAkun.account_number,
            namaAkun: listAkun.account_name,
        });
    }

    function handleChange(e) {
        setInputTransfer({
            ...inputTransfer,
            [e.target.name]: (e.target.name !== "desc") ? Number(e.target.value).toString() : e.target.value,
        });
    }

    function handleChangeNominal(e) {
        setInputTransfer({
            ...inputTransfer,
            nominal: e
        })
    }

    function completeTime() {
        setToCountdown(false)
    }

    function sendAgain() {
        sendOtpHanlder(inputHandle.akunPartner)
    }

    var htmlToImage = require('html-to-image')

    const onButtonClick = (async (dataConfirmation) => {
        const dom = document.getElementById('bukti');
        const fontEmbedCss = await htmlToImage.getFontEmbedCSS(dom);
        // console.log(dom, 'dom');
        htmlToImage.toPng(dom, { fontEmbedCss })
            .then(function (dataUrl) {
                // console.log(dataUrl, 'dataUrl');
                var link = document.createElement('a');
                link.download = `bukti-pembayaran-${dataConfirmation.trans_id}.png`
                link.href = dataUrl;
                link.click()
                // download(dataUrl, "bukti-tarnsfer.png")
            })
            .catch((err) => {
                // console.log(err, 'oops, something went wrong!')
            })
    })

    const columnsBank = [
        {
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px"
        },
        {
            name: language === null ? eng.namaBank : language.namaBank,
            selector: row => row.mbank_name,
        },
        {
            name: language === null ? eng.kodeBank : language.kodeBank,
            selector: row => row.mbank_code,
            width: "150px"
        },
    ]

    const columns = [
        {
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px"
        },
        {
            name: language === null ? eng.namaPemilikRek : language.namaPemilikRek,
            selector: row => row.moffshorebankacclist_name,
        },
        {
            name: language === null ? eng.noRek : language.noRek,
            selector: row => row.moffshorebankacclist_number,
        },
        {
            name: language === null ? eng.namaBank : language.namaBank,
            selector: row => row.mbank_name,
        },
    ]

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/riwayat-transaksi/va-dan-paylink");
    }

    function toMutasi () {
        history.push("/Sub Account Bank/info-saldo-dan-mutasi")
    }

    function toInputCode () {
        setShowTransfer(false)
        sendOtpHanlder(inputHandle.akunPartner)
    }

    function toTransfer () {
        confirmHandler(inputDataRekening.noRek, inputTransfer.nominal, inputData.bankCode, inputTransfer.desc, otp, isChecked, inputHandle.akunPartner)
    }

    async function getAkunPartner() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listPartnerAkun = await axios.post(BaseURL + "/SubAccount/GetAgenAccount", { data: "" }, { headers: headers })
            if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length === 0) {
                // listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListAkunPartner(listPartnerAkun.data.response_data)
                if (listPartnerAkun.data.response_data.length !== 0) {
                    setInputHandle({
                        ...inputHandle,
                        akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                        nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                        namaAkun: listPartnerAkun.data.response_data[0].account_name,
                    })
                }
            } else if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length !== 0) {
                setUserSession(listPartnerAkun.data.response_new_token)
                // listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListAkunPartner(listPartnerAkun.data.response_data)
                if (listPartnerAkun.data.response_data.length !== 0) {
                    setInputHandle({
                        ...inputHandle,
                        akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                        nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                        namaAkun: listPartnerAkun.data.response_data[0].account_name,
                    })
                }
            }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBankList() {
        try {
          const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"fitur_id": 106}`)
            const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const bankList = await axios.post(BaseURL + "/Home/BankGetList", { data: dataParams }, { headers: headers })
          if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length === 0) {
            bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListBank(bankList.data.response_data)
          } else if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length !== 0) {
            setUserSession(bankList.data.response_new_token)
            bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListBank(bankList.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getRekeningList() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const bankList = await axios.post(BaseURL + "/SubAccount/GetListAccount", { data: "" }, { headers: headers })
            // console.log(bankList, 'list bank');
            if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length === 0) {
                bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListRekening(bankList.data.response_data)
            } else if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length !== 0) {
                setUserSession(bankList.data.response_new_token)
                bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListRekening(bankList.data.response_data)
            }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    const [isCheckedAccBankButton, setIsCheckedAccBankButton] = useState(false)

    async function checkAccountHandler(accountNumber, bankCode, diperiksa) {
        try {
            setClickCheck(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"account_number": "${accountNumber}", "bank_code": "${bankCode}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            if (diperiksa === true) {
                setIsCheckedAccBankButton(true)
                const handleCheckAccount = await axios.post(BaseURL + "/SubAccount/AccountInquiryName", { data: dataParams }, { headers: headers })
                // console.log(handleCheckAccount, 'check account tombol periksa');
                if (handleCheckAccount.status === 200 && handleCheckAccount.data.response_code === 200 && handleCheckAccount.data.response_new_token === null) {
                    setChecking(handleCheckAccount.data.response_data)
                    setMsg(handleCheckAccount.data.response_message)
                } else if (handleCheckAccount.status === 200 && handleCheckAccount.data.response_code === 200 && handleCheckAccount.data.response_new_token !== null) {
                    setUserSession(handleCheckAccount.data.response_new_token)
                    setChecking(handleCheckAccount.data.response_data)
                    setMsg(handleCheckAccount.data.response_message)
                }
            } else {
                setIsCheckedAccBankButton(true)
                const handleCheckAccount = await axios.post(BaseURL + "/SubAccount/AccountInquiryName", { data: dataParams }, { headers: headers })
                // console.log(handleCheckAccount, 'check account tanpa tombol periksa');
                if (handleCheckAccount.status === 200 && handleCheckAccount.data.response_code === 200 && handleCheckAccount.data.response_new_token === null) {
                    setChecking(handleCheckAccount.data.response_data)
                    setMsg(handleCheckAccount.data.response_message)
                    if (handleCheckAccount.data.response_message === "Success") {
                        setShowTransfer(true)
                    } else {
                        setShowTransfer(false)
                    }
                } else if (handleCheckAccount.status === 200 && handleCheckAccount.data.response_code === 200 && handleCheckAccount.data.response_new_token !== null) {
                    setUserSession(handleCheckAccount.data.response_new_token)
                    setChecking(handleCheckAccount.data.response_data)
                    setMsg(handleCheckAccount.data.response_message)
                    if (handleCheckAccount.data.response_message === "Success") {
                        setShowTransfer(true)
                    } else {
                        setShowTransfer(false)
                    }
                }
            }
        } catch (error) {
            // console.log(error)
            if (error.response.status !== 200) {
                setMsg(error.response.data.response_message)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    async function feeTransferHandler(bankCode) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"bank_code": "${bankCode}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const checkTransferFee = await axios.post(BaseURL + "/SubAccount/GetTransferFee", { data: dataParams }, { headers: headers })
            // console.log(checkTransferFee, 'transfer fee');
            if (checkTransferFee.status === 200 && checkTransferFee.data.response_code === 200 && checkTransferFee.data.response_new_token === null) {
                setTransferFee(checkTransferFee.data.response_data)
            } else if (checkTransferFee.status === 200 && checkTransferFee.data.response_code === 200 && checkTransferFee.data.response_new_token !== null) {
                setUserSession(checkTransferFee.data.response_new_token)
                setTransferFee(checkTransferFee.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function sendOtpHanlder(subPartnerId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"sub_partner_id": "${subPartnerId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const sendOtpCheck = await axios.post(BaseURL + "/SubAccount/SendOTPTransfer", { data: dataParams }, { headers: headers })
            // console.log(sendOtpCheck, 'otp');
            if (sendOtpCheck.status === 200 && sendOtpCheck.data.response_code === 200 && sendOtpCheck.data.response_new_token === null) {
                const timeStamp = new Date(sendOtpCheck.data.response_data.retry*1000).toLocaleString()
                const countdown = new Date(timeStamp).getTime()
                sendOtpCheck.data.response_data.retry = countdown
                setSendOtp(sendOtpCheck.data.response_data)
                setShowModalInputCode(true)
                setToCountdown(true)
            } else if (sendOtpCheck.status === 200 && sendOtpCheck.data.response_code === 200 && sendOtpCheck.data.response_new_token !== null) {
                setUserSession(sendOtpCheck.data.response_new_token)
                const timeStamp = new Date(sendOtpCheck.data.response_data.retry*1000).toLocaleString()
                const countdown = new Date(timeStamp).getTime()
                sendOtpCheck.data.response_data.retry = countdown
                setSendOtp(sendOtpCheck.data.response_data)
                setShowModalInputCode(true)
                setToCountdown(true)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
            if (error.response.data.response_data.retry === 0 && error.response.data.response_data.hit_count === 3) {
                setShowModalInputCode(false)
                setShowModalMaxInputOtp(true)
            }
        }
    }

    async function confirmHandler(nomorAkun, nominal, bankCode, desc, otp, saveNomorAkun, subPartnerId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"account_number": "${nomorAkun}", "amount": ${Number(nominal)}, "bank_code": "${bankCode}", "description": "${desc}", "otp": "${otp}", "save_account_number": ${saveNomorAkun}, "sub_partner_id": "${subPartnerId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const sendDataConfirm = await axios.post(BaseURL + "/SubAccount/Transfer", { data: dataParams }, { headers: headers })
            // console.log(sendDataConfirm, 'transfer fee');
            if (sendDataConfirm.status === 200 && sendDataConfirm.data.response_code === 200 && sendDataConfirm.data.response_new_token === null) {
                setDataConfirm(sendDataConfirm.data.response_data)
                setShowModalInputCode(false)
                setShowTransferBerhasil(true)
            } else if (sendDataConfirm.status === 200 && sendDataConfirm.data.response_code === 200 && sendDataConfirm.data.response_new_token !== null) {
                setUserSession(sendDataConfirm.data.response_new_token)
                setDataConfirm(sendDataConfirm.data.response_data)
                setShowModalInputCode(false)
                setShowTransferBerhasil(true)
            }
        } catch (error) {
            // console.log(error)
            if (error.response.data.response_code === 400) {
                if (error.response.data.response_data !== null) {
                    setDataConfirm(error.response.data.response_data)
                    setShowModalInputCode(false)
                    setShowTransferBerhasil(true)
                } else {
                    setErrMsg(error.response.data.response_message)
                    setShowModalInputCode(true)
                }
            }
            history.push(errorCatch(error.response.status))
        }
    }

    function toShowDataTransfer (isCheckingButton) {
        if (checking.account_name === undefined && isCheckingButton === false) {
            // console.log('sini');
            checkAccountHandler(inputDataRekening.noRek, inputData.bankCode, isCheckingButton)
        } else {
            setShowTransfer(true)
        }
    }

    function batalIn (param) {
        if (param === "rekening") {
            setShowDaftarRekening(false)
            setFilterTextRekening('')
        } else {
            setShowBank(false)
            setFilterTextBank('')
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: '600',
                fontSize: '14px',
                fontFamily: 'Exo'
            },
        },
        cells: {
            style: {
                cursor: 'pointer',
            }
        },
    };

    // console.log(listAkunPartner, "LIST AKUN PARTNER");

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        getAkunPartner()
        getBankList()
        getRekeningList()
    }, [])


    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> {language === null ? eng.laporan : language.laporan}</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? eng.subAccountBank : language.subAccountBank} &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;{language === null ? eng.transfer : language.transfer}</span>
            <div className="head-title mt-3 mb-3">
                <div classN ame="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{language === null ? eng.transfer : language.transfer}</div>
            </div>
            {
                listAkunPartner.length !== 0 ?
                <>
                    <div className='base-content-custom px-3 pt-4 pb-4' style={{ width: "50%" }}>
                        <div className="mb-3">{language === null ? eng.pilihAkun : language.pilihAkun}</div>
                        <Form.Select name="akunPartner" value={inputHandle.akunPartner} onChange={(e) => handleChangeTransfer(e, listAkunPartner)}>
                            {listAkunPartner.map((item, idx) => {
                                return (
                                    <option key={idx} value={item.partner_id}>
                                        {item.account_name} - {item.account_number}
                                    </option>
                                )
                            })}
                        </Form.Select>
                    </div>
                    <div className="head-title">
                        <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{language === null ? eng.rekTujuan : language.rekTujuan}</div>
                    </div>
                    <div className='base-content-custom px-3 pt-4 pb-4' >
                        <Row className='mt-1 align-items-center'>
                            <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                                {language === null ? eng.pilihBank : language.pilihBank} <span style={{ color: "red" }}>*</span>
                            </Col>
                            <Col xs={10} className="position-relative d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => setShowBank(true)}>
                                <input style={{ cursor: "pointer", backgroundColor: "#FFFFFF" }} disabled name="bankName" value={inputData.bankName} className="input-text-user" placeholder={language === null ? eng.pilihBankTujuan : language.pilihBankTujuan}/>
                                <div className="position-absolute right-4" ><img src={chevron} alt="time" /></div>
                            </Col>
                        </Row>
                        <Row className='mt-3 align-items-center'>
                            <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                                {language === null ? eng.nomorRekTujuan : language.nomorRekTujuan} <span style={{ color: "red" }}>*</span>
                            </Col>
                            <Col xs={8}>
                                <input type='number' name='noRek' value={inputDataRekening.noRek} onChange={(e) => handleChangeRek(e)} className="input-text-user" placeholder={language === null ? eng.placeholderNoRekTujuan : language.placeholderNoRekTujuan} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}/>
                            </Col>
                            <Col xs={2} >
                                <button
                                    onClick={() => checkAccountHandler(inputDataRekening.noRek, inputData.bankCode, true)}
                                    className={(inputDataRekening.noRek.length !== 0 && inputData.bankCode.length !== 0) ? 'btn-ez-transfer' : 'btn-noez-transfer'}
                                    disabled={inputDataRekening.noRek.length === 0 || inputData.bankCode.length === 0}
                                >
                                    {language === null ? eng.periksa : language.periksa}
                                </button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={2}></Col>
                            <Col xs={10}>
                                {
                                    clickCheck === true ?
                                        <>
                                            {
                                                msg === "Success" ?
                                                <div style={{ color: "#3DB54A", fontSize: 12 }} className="mt-2">
                                                    <img src={noteIconGreen} className="me-2" alt="icon notice" />
                                                    {language === null ? eng.rekeningTerkonfirmasi : language.rekeningTerkonfirmasi} - {checking.account_name}
                                                </div> :
                                                <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-2">
                                                    <img src={noteIconRed} className="me-2" alt="icon notice" />
                                                    {inputData.bankCode === "" ? (language === null ? eng.silahkanPilihBankDahulu : language.silahkanPilihBankDahulu) : msg}
                                                </div>
                                            }
                                        </> : <></>
                                }

                                <div className='d-flex align-items-center justify-content-between'>
                                    <div className='mt-2'>
                                        <Form.Check
                                            label={language === null ? eng.simpanKeDaftarRek : language.simpanKeDaftarRek}
                                            id="statusId"
                                            onChange={handleOnChangeCheckBox}
                                            checked={isChecked}
                                        />
                                    </div>
                                    <div className='mt-2'>
                                        <button
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 14,
                                                fontWeight: 700,
                                                alignItems: "center",
                                                height: 48,
                                                color: "#077E86",
                                                background: "unset",
                                                border: "unset",
                                                textDecoration: 'underline'
                                            }}
                                            onClick={() => setShowDaftarRekening(true)}
                                        >
                                            {language === null ? eng.lihatDaftarRek : language.lihatDaftarRek}
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-3 align-items-center'>
                            <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                                {language === null ? eng.nominalTransfer : language.nominalTransfer} <span style={{ color: "red" }}>*</span>
                            </Col>
                            <Col xs={10}>
                                <CurrencyInput
                                    className='input-text-user'
                                    value={inputTransfer.nominal === undefined ? 0 : inputTransfer.nominal}
                                    onValueChange={(e) => handleChangeNominal(e)}
                                    placeholder={language === null ? eng.placeholderNominalTransfer : language.placeholderNominalTransfer}
                                    groupSeparator={"."}
                                    decimalSeparator={','}
                                    allowDecimals={false}
                                />

                                {/* {
                                    editNominal ?
                                        <input
                                            name="nominal"
                                            value={inputTransfer.nominal === undefined ? 0 : inputTransfer.nominal}
                                            type='number'
                                            className="input-text-user"
                                            // placeholder='Rp 0'
                                            onChange={handleChange}
                                            min={0}
                                            onBlur={() => setEditNominal(!editNominal)}
                                            onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                        /> :
                                        <input
                                            name="nominal"
                                            value={inputTransfer.nominal === undefined ? convertToRupiah(0, true, 0) : convertToRupiah(inputTransfer.nominal, true, 0)}
                                            type='text'
                                            className="input-text-user"
                                            // placeholder='Rp 0'
                                            onChange={handleChange}
                                            onFocus={() => setEditNominal(!editNominal)}
                                        />
                                } */}
                            </Col>
                        </Row>
                        <Row className='mt-3 align-items-center'>
                            <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                                {language === null ? eng.deskripsi : language.deskripsi}
                            </Col>
                            <Col xs={10}>
                                <input name="desc" value={inputTransfer.desc} type='text' className="input-text-user" placeholder={language === null ? eng.placeholderDeskripsi : language.placeholderDeskripsi} onChange={handleChange}/>
                            </Col>
                        </Row>
                        <Row className='mt-3 align-items-center'>
                            <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                                {language === null ? eng.biayaTransfer : language.biayaTransfer} <span style={{ color: "red" }}>*</span>
                            </Col>
                            <Col xs={10}>
                                <input value={(transferFee.fee_transfer === undefined) ? convertToRupiah(0, true, 0) : convertToRupiah(transferFee.fee_transfer, true, 0)} type='text' disabled className="input-text-user" placeholder={`${language === null ? eng.rp : language.rp} 0`}/>
                            </Col>
                        </Row>
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-3" >
                        <button
                            className={(inputHandle.akunPartner.length !== 0 && inputData.bankName.length !== 0 && inputDataRekening.noRek.length !== 0 && Number(inputTransfer.nominal) >= 10000 && transferFee.fee_transfer !== undefined) ? 'btn-ez-transfer' : 'btn-ez'}
                            disabled={inputHandle.akunPartner.length === 0 || inputData.bankName.length === 0 || inputDataRekening.noRek.length === 0 || Number(inputTransfer.nominal) < 10000 || transferFee.fee_transfer === undefined}
                            style={{ width: '25%' }}
                            onClick={() => toShowDataTransfer(isCheckedAccBankButton)}
                        >
                            {language === null ? eng.transferSekarang : language.transferSekarang}
                        </button>
                    </div>
                </> :
                <SubAccountComponent/>
            }

            {/*Modal Pilih Bank*/}
            <Modal className="history-modal bank-list-subakun" size="xs" centered show={showBank} onHide={() => setShowBank(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => batalIn('bank')}
                    />

                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    {language === null ? eng.daftarBank : language.daftarBank}
                </Modal.Title>
                <Modal.Body>
                    <div className="div-table mt-3">
                        <DataTable
                            columns={columnsBank}
                            data={filterItemsBank}
                            customStyles={customStyles}
                            progressComponent={<CustomLoader />}
                            highlightOnHover
                            subHeader
                            subHeaderComponent={subHeaderComponentMemoBank}
                            persistTableHead
                            onRowClicked={handleRowClicked}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="300px"
                        />
                    </div>
                    <div className='text-center my-1'>
                        <button
                            onClick={() => batalIn('bank')}
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "#FFFFFF",
                                color: "#888888",
                                border: "0.6px solid #EBEBEB",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.batal : language.batal}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Daftar Rekening*/}
            <Modal className="history-modal" size="xl" centered show={showDaftarRekening} onHide={() => setShowDaftarRekening(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => batalIn('rekening')}
                    />

                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    {language === null ? eng.daftarRekening : language.daftarRekening}
                </Modal.Title>
                <Modal.Body>
                    <div className="div-table bank-list-subakun mt-3">
                        <DataTable
                            columns={columns}
                            data={filterItemsRekening}
                            customStyles={customStyles}
                            progressComponent={<CustomLoader />}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemoRekening}
                            persistTableHead
                            onRowClicked={handleRowClickedRekening}
                            highlightOnHover
                            fixedHeader={true}
                            fixedHeaderScrollHeight="300px"
                        />
                    </div>
                    <div className='text-center my-1'>
                        <button
                            onClick={() => batalIn('rekening')}
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "#FFFFFF",
                                color: "#888888",
                                border: "0.6px solid #EBEBEB",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.batal : language.batal}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Transfer*/}
            <Modal className="history-modal" size="md" centered show={showTransfer} onHide={() => setShowTransfer(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowTransfer(false)}
                    />

                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    {language === null ? eng.konfirmasiTransfer : language.konfirmasiTransfer}
                </Modal.Title>
                <Modal.Body>
                    <div className='px-2 py-3' style={{ backgroundColor: "rgba(240, 240, 240, 0.38)" }}>
                        <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.dariRek : language.dariRek}</div>
                        <div className='mt-1' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{inputHandle.nomorAkun}</div>
                        <div className='mt-3' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{language === null ? eng.rekTujuan : language.rekTujuan}</div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.namaBank : language.namaBank}</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.noRek : language.noRek}</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{language === null ? eng.bank : language.bank} {inputData.bankName}</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{inputDataRekening.noRek}</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.nominalTransfer : language.nominalTransfer}</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{checking.account_name}</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{convertToRupiah(inputTransfer.nominal, true, 0)}</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.deskripsi : language.deskripsi}</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.biayaAdmin : language.biayaAdmin}</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{inputTransfer.desc !== "" ? inputTransfer.desc : "-"}</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{convertToRupiah(transferFee.fee_transfer, true, 0)}</div>
                        </div>
                        <div className='mt-3' style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.total : language.total}</div>
                        <div className='mt-1' style={{ fontSize: 24, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{convertToRupiah((Number(inputTransfer.nominal) + Number(transferFee.fee_transfer)), true, 0)}</div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <button
                            onClick={() => setShowTransfer(false)}
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "0px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "#FFFFFF",
                                color: "#888888",
                                border: "0.6px solid #EBEBEB",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.batal : language.batal}
                        </button>
                        <button
                            onClick={() => toInputCode()}
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "0px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.transfer : language.transfer}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Input Code*/}
            <Modal className="history-modal" size="xs" centered show={showModalInputCode} onHide={() => setShowModalInputCode(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowModalInputCode(false)}
                    />
                </Modal.Header>
                <Modal.Title className="mt-2 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    {language === null ? eng.konfirmasiOtp : language.konfirmasiOtp}
                </Modal.Title>
                <Modal.Body>
                    <div className='text-center' style={{ fontSize: 16, fontWeight: 400, color: "#888888", fontFamily: "Source Sans Pro" }}>{language === null ? eng.kodeVerifikasi : language.kodeVerifikasi} <b>{sendOtp.mobile_phone}</b> </div>
                    <div className='d-flex flex-column justify-content-center align-items-center mt-3'>
                        <OtpInput
                            isInputNum={true}
                            className='px-2'
                            value={otp}
                            onChange={(e) => handleChangeOtp(e)}
                            numInputs={6}
                            inputStyle={{ border: errMsg !== "" ? "1.4px solid #B9121B" : "1px solid #EBEBEB", borderRadius: 8, backgroundColor: "#FFFFFF", gap: 12, width: "3rem", height:"3rem", fontSize: 20, fontFamily: "Exo", fontWeight: 700, color: "#393939" }}
                            // inputStyle={{ border: "1.4px solid #B9121B", borderRadius: 8, backgroundColor: "#FFFFFF" }}
                        />
                        <div className='mt-3'>
                            {
                                errMsg !== "" ?
                                <div style={{ color: "#B9121B", fontSize: 14 }}>{errMsg}</div> : <></>
                            }
                        </div>
                    </div>
                    {
                        toCountdown === true ?
                            <div className='text-center mt-3' style={{color: "#393939", fontSize: 16, fontFamily: "Source Sans Pro" }}>{language === null ? eng.mohonTungguDalam : language.mohonTungguDalam} <b><Countdown date={new Date(sendOtp.retry)} renderer={renderer} onComplete={completeTime} /></b> {language === null ? eng.untukKirimUlang : language.untukKirimUlang}</div> :
                            <div className='d-flex justify-content-center align-items-center mt-3'>
                                <div className="me-1" style={{ color: "#393939", fontFamily: "Nunito", fontSize: 16 }}>{language === null ? eng.tidakMenerimaOtp : language.tidakMenerimaOtp} </div>
                                <div onClick={sendAgain} className='ms-1' style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>{language === null ? eng.kirimUlang : language.kirimUlang}</div>
                            </div>
                    }
                    <div className='text-center mt-3'>{language === null ? eng.maksimumPermintaanOtp : language.maksimumPermintaanOtp} : {sendOtp.hit_count}/3</div>
                    <div className='px-5'>
                        <button
                            onClick={() => toTransfer()}
                            className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                            style={{
                                width: "100%",
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "12px 48px",
                                gap: 8,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.konfirmasi : language.konfirmasi}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Gagal input OTP karena telah maksimum */}
            <Modal className="history-modal" size="xs" centered show={showModalMaxInputOtp} onHide={() => setShowModalMaxInputOtp(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowModalMaxInputOtp(false)}
                    />
                </Modal.Header>
                <Modal.Title className="mt-2 px-4 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    <div><img src={transferFailed}  alt="failed" /></div>
                    <div className='mt-3'>{language === null ? eng.andaMencapaiMaksPermintaanOtp : language.andaMencapaiMaksPermintaanOtp}</div>
                </Modal.Title>
                <Modal.Body>
                    <div className='text-center px-5' style={{ fontSize: 16, fontWeight: 400, color: "#888888", fontFamily: "Source Sans Pro" }}>{language === null ? eng.batasMaksimumOtp : language.batasMaksimumOtp} </div>
                    <div className='px-5 mx-4'>
                        <button
                            onClick={() => window.location.reload()}
                            className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                            style={{
                                width: "100%",
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "12px 48px",
                                gap: 8,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                                cursor: "pointer"
                            }}
                        >
                            {language === null ? eng.mengerti : language.mengerti}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Transfer Berhasil dan Gagal*/}
            <Modal className="history-modal" size="md" centered show={showTransferBerhasil} onHide={() => setShowTransferBerhasil(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowTransferBerhasil(false)}
                    />

                </Modal.Header>
                <Modal.Body style={{ padding: 'unset'}}>
                    <div id='bukti' className='px-3 my-3' style={{ backgroundColor: "#FFFFFF" }}>
                        <div className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                            <div><img src={dataConfirm.status_id === 2 ? transferSuccess : dataConfirm.status_id === 1 ? transferProses : transferFailed}  alt="success" /></div>
                            <div className='mt-3 mb-3'>{dataConfirm.status_message}</div>
                            {
                                dataConfirm.status_id === 1 ?
                                    <div style={{ fontSize: 14, fontFamily: 'Nunito', color: '#848484' }} className='mt-2'>{language === null ? eng.cekMutasi : language.cekMutasi}</div> : <></>
                            }
                        </div>
                        <div className='px-2 py-3' style={{ backgroundColor: "rgba(240, 240, 240, 0.38)" }}>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.dariRek : language.dariRek}</div>
                            <div className='mt-1' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{dataConfirm.source_account_number}</div>
                            <div className='mt-3' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{language === null ? eng.rekTujuan : language.rekTujuan}</div>
                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.namaBank : language.namaBank}</div>
                                <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.noRek : language.noRek}</div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-1'>
                                <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{inputData.bankName}</div>
                                <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{dataConfirm.beneficiary_account_number}</div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</div>
                                <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.nominalTransfer : language.nominalTransfer}</div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-1'>
                                <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{dataConfirm.beneficiary_account_name}</div>
                                <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{convertToRupiah(dataConfirm.transfer_amount, true, 0)}</div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.deskripsi : language.deskripsi}</div>
                                <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.biayaAdmin : language.biayaAdmin}</div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-1'>
                                <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{dataConfirm.description !== "" ? dataConfirm.description : "-"}</div>
                                <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{convertToRupiah(dataConfirm.admin_fee, true, 0)}</div>
                            </div>
                            <div className='mt-3' style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>{language === null ? eng.total : language.total}</div>
                            <div style={{ fontSize: 24, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>{convertToRupiah((Number(dataConfirm.transfer_amount)) + (Number(dataConfirm.admin_fee)))}</div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center mt-3 mb-4'>
                        {
                            dataConfirm.status_id !== 1 ?
                            <>
                                <button
                                onClick={() => onButtonClick(dataConfirm)}
                                    className="mx-2"
                                    style={{
                                        fontFamily: "Exo",
                                        fontSize: 16,
                                        fontWeight: 900,
                                        alignItems: "center",
                                        padding: "0px 12px",
                                        gap: 8,
                                        width: 208,
                                        height: 45,
                                        background: "#FFFFFF",
                                        color: "#888888",
                                        border: "0.6px solid #EBEBEB",
                                        borderRadius: 6,
                                    }}
                                >
                                    {language === null ? eng.unduhBuktiTf : language.unduhBuktiTf}
                                </button>
                                <button
                                    onClick={() => toMutasi()}
                                    className="mx-2"
                                    style={{
                                        fontFamily: "Exo",
                                        fontSize: 16,
                                        fontWeight: 900,
                                        alignItems: "center",
                                        padding: "0px 12px",
                                        gap: 8,
                                        width: 144,
                                        height: 45,
                                        background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                        border: "0.6px solid #2C1919",
                                        borderRadius: 6,
                                    }}
                                >
                                    {language === null ? eng.lihatMutasi : language.lihatMutasi}
                                </button>
                            </> :
                            <>
                                <button
                                    onClick={() => toMutasi()}
                                    className="mx-2"
                                    style={{
                                        fontFamily: "Exo",
                                        fontSize: 16,
                                        fontWeight: 900,
                                        alignItems: "center",
                                        padding: "0px 12px",
                                        gap: 8,
                                        width: 144,
                                        height: 45,
                                        background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                        border: "0.6px solid #2C1919",
                                        borderRadius: 6,
                                    }}
                                >
                                    {language === null ? eng.lihatMutasi : language.lihatMutasi}
                                </button>
                            </>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TransferSubAccount