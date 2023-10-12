import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, InputGroup, Row, Spinner } from '@themesberg/react-bootstrap'
import { useState } from 'react'
import $ from 'jquery'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import JSONPretty from 'react-json-pretty'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

const GetBalance = () => {

    const user_role = getRole()
    const history = useHistory()
    const access_token = getToken()
    const [isGetBalance, setIsGetBalance] = useState("getBalance")

    function balance(isTabs){
        if(isTabs === "getBalance"){
            setIsGetBalance(isTabs)
            setInputMutasi({
                ...inputMutasi,
                bankTypeMutasi: "",
                pinNumberMutasi: ""
            })
            setDataMutasi({})
            setDateRangeGetMutasi([])
            setStateGetMutasi(null)
            setInputDataBif({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: "",
                pinNumber: ""
            })
            setDataTransferBif({}) 
            setInputDataOnline({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: "",
                pinNumber: ""
            })
            setDataTransferOnline({})
            $('#getbalancetab').addClass('menu-detail-akun-hr-active')
            $('#getbalancespan').addClass('menu-detail-akun-span-active')
            $('#mutasitab').removeClass('menu-detail-akun-hr-active')
            $('#mutasispan').removeClass('menu-detail-akun-span-active')
            $('#transferbiftab').removeClass('menu-detail-akun-hr-active')
            $('#transferbifspan').removeClass('menu-detail-akun-span-active')
            $('#transferonlinetab').removeClass('menu-detail-akun-hr-active')
            $('#transferonlinespan').removeClass('menu-detail-akun-span-active')
        } else if(isTabs === "mutasi"){
            setIsGetBalance(isTabs)
            setInputGetBalance({
                bankType: "",
                pinNumber: ""
            })
            setDataGetBalance({})
            setDataBankBalance({})
            setInputDataBif({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: "",
                pinNumber: ""
            })
            setDataTransferBif({})
            setInputDataOnline({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: "",
                pinNumber: ""
            })
            setDataTransferOnline({})
            $('#getbalancetab').removeClass('menu-detail-akun-hr-active')
            $('#getbalancespan').removeClass('menu-detail-akun-span-active')
            $('#mutasitab').addClass('menu-detail-akun-hr-active')
            $('#mutasispan').addClass('menu-detail-akun-span-active')
            $('#transferbiftab').removeClass('menu-detail-akun-hr-active')
            $('#transferbifspan').removeClass('menu-detail-akun-span-active')
            $('#transferonlinetab').removeClass('menu-detail-akun-hr-active')
            $('#transferonlinespan').removeClass('menu-detail-akun-span-active')
        } else if(isTabs === "transferBif"){
            setIsGetBalance(isTabs)
            setInputGetBalance({
                bankType: "",
                pinNumber: ""
            })
            setDataGetBalance({})
            setDataBankBalance({})
            setInputMutasi({
                ...inputMutasi,
                bankTypeMutasi: "",
                pinNumberMutasi: ""
            })
            setDataMutasi({})
            setDateRangeGetMutasi([])
            setStateGetMutasi(null)
            setInputDataOnline({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: "",
                pinNumber: ""
            })
            setDataTransferOnline({})
            $('#getbalancetab').removeClass('menu-detail-akun-hr-active')
            $('#getbalancespan').removeClass('menu-detail-akun-span-active')
            $('#mutasitab').removeClass('menu-detail-akun-hr-active')
            $('#mutasispan').removeClass('menu-detail-akun-span-active')
            $('#transferbiftab').addClass('menu-detail-akun-hr-active')
            $('#transferbifspan').addClass('menu-detail-akun-span-active')
            $('#transferonlinetab').removeClass('menu-detail-akun-hr-active')
            $('#transferonlinespan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsGetBalance(isTabs)
            setInputGetBalance({
                bankType: "",
                pinNumber: ""
            })
            setDataGetBalance({})
            setDataBankBalance({})
            setInputMutasi({
                ...inputMutasi,
                bankTypeMutasi: "",
                pinNumberMutasi: ""
            })
            setDataMutasi({})
            setDateRangeGetMutasi([])
            setStateGetMutasi(null)
            setInputDataBif({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: "",
                pinNumber: ""
            })
            setDataTransferBif({}) 
            $('#getbalancetab').removeClass('menu-detail-akun-hr-active')
            $('#getbalancespan').removeClass('menu-detail-akun-span-active')
            $('#mutasitab').removeClass('menu-detail-akun-hr-active')
            $('#mutasispan').removeClass('menu-detail-akun-span-active')
            $('#transferbiftab').removeClass('menu-detail-akun-hr-active')
            $('#transferbifspan').removeClass('menu-detail-akun-span-active')
            $('#transferonlinetab').addClass('menu-detail-akun-hr-active')
            $('#transferonlinespan').addClass('menu-detail-akun-span-active')
        }
    }

    /* FUNCTION TAB GET BALANCE */

    // const [bankType, setBankType] = useState("")
    // const [pinNumber, setPinNumber] = useState("")
    const [loadingBalance, setLoadingBalance] = useState(false)
    const [inputGetBalance, setInputGetBalance] = useState({
        bankType: "",
        pinNumber: ""
    })
    const [dataGetBalance, setDataGetBalance] = useState({})
    const [dataBankBalance, setDataBankBalance] = useState({})
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const passwordInputType = showPassword ? "text" : "password";
    const passwordIconColor = showPassword ? "#262B40" : "";
    console.log(dataGetBalance, "dataGetBalance");
    console.log(dataBankBalance, "dataBankBalance");

    function handleChange(e) {
        setInputGetBalance({
            ...inputGetBalance,
            [e.target.name] : e.target.value
        })
    }

    console.log(inputGetBalance.pinNumber, "inputGetBalance.pinNumber");
    console.log(inputGetBalance.bankType, "inputGetBalance.bankType");

    async function GetBalanceTransfer(bankType, pinNumber) {
        try {
            setLoadingBalance(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"bankCode": "${bankType}", "PinNumber": "${pinNumber}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGetBalance = await axios.post(BaseURL + "/BankTransaction/GetBankBalance", { data: dataParams }, { headers: headers })
            console.log(dataGetBalance, 'ini list dana masuk');
            if (dataGetBalance.status === 200 && dataGetBalance.data.response_code === 200 && dataGetBalance.data.response_new_token.length === 0) {
                setDataGetBalance(dataGetBalance.data.response_data.results)
                setDataBankBalance(dataGetBalance.data.response_data.results.additionalMessage)
                setLoadingBalance(false)
            } else if (dataGetBalance.status === 200 && dataGetBalance.data.response_code === 200 && dataGetBalance.data.response_new_token.length !== 0) {
                setUserSession(dataGetBalance.data.response_new_token)
                setDataGetBalance(dataGetBalance.data.response_data.results)
                setDataBankBalance(dataGetBalance.data.response_data.results.additionalMessage)
                setLoadingBalance(false)
            }
        } catch (error) {
            console.log(error)
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle() {
        setInputGetBalance({
            ...inputGetBalance,
            bankType: "",
            pinNumber: ""
        })
        setDataGetBalance({})
        setDataBankBalance({})
    }

    /* FUNCTION TAB MUTASI */

    const [inputMutasi, setInputMutasi] = useState({
        bankTypeMutasi: "",
        pinNumberMutasi: ""
    })
    const [loadingMutasi, setLoadingMutasi] = useState(false)
    const [dataMutasi, setDataMutasi] = useState({})
    const [dateRangeGetMutasi, setDateRangeGetMutasi] = useState([])
    const [stateGetMutasi, setStateGetMutasi] = useState(null)
    console.log(dateRangeGetMutasi, "dateRangeGetMutasi");
    const [showPasswordMutasi, setShowPasswordMutasi] = useState(false);

    const togglePasswordVisibilityMutasi = () => {
        setShowPasswordMutasi(!showPasswordMutasi);
    };
    const passwordInputTypeMutasi = showPasswordMutasi ? "text" : "password";
    const passwordIconColorMutasi = showPasswordMutasi ? "#262B40" : "";

    function handleChangeMutasi(e) {
        setInputMutasi({
            ...inputMutasi,
            [e.target.name] : e.target.value
        })
    }

    function pickDateMutasi(item) {
        setStateGetMutasi(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeGetMutasi(item)
        }
    }

    async function GetMutasiBank(bankType, pinNumber, periode, next, matchedRec) {
        try {
            setLoadingMutasi(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"bankCode": "${bankType}", "PinNumber": "${pinNumber}", "endDate": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "NextRecord": "${next}", "MatchedRecord": "${matchedRec}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGetMutasi = await axios.post(BaseURL + "/BankTransaction/GetBankStatement", { data: dataParams }, { headers: headers })
            console.log(dataGetMutasi, 'ini list dana masuk');
            if (dataGetMutasi.status === 200 && dataGetMutasi.data.response_code === 200 && dataGetMutasi.data.response_new_token.length === 0) {
                setDataMutasi(dataGetMutasi.data.response_data.results)
                setLoadingMutasi(false)
            } else if (dataGetMutasi.status === 200 && dataGetMutasi.data.response_code === 200 && dataGetMutasi.data.response_new_token.length !== 0) {
                setUserSession(dataGetMutasi.data.response_new_token)
                setDataMutasi(dataGetMutasi.data.response_data.results)
                setLoadingMutasi(false)
            }
        } catch (error) {
            // console.log(error)
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
            }
            history.push(errorCatch(error.response.status))
        }
    }
    console.log(dataMutasi, "dataMutasi");

    function resetButtonHandleMutasi() {
        setInputMutasi({
            ...inputMutasi,
            bankTypeMutasi: "",
            pinNumberMutasi: ""
        })
        setDataMutasi({})
        setDateRangeGetMutasi([])
        setStateGetMutasi(null)
    }

    /* FUNCTION TAB TRANSFER BIF */

    const [inputDataBif, setInputDataBif] = useState({
        bankCode: "",
        accNumber: "",
        accName: "",
        amount: "",
        desc: "",
        pinNumber: ""
    })
    const [dataTransferBif, setDataTransferBif] = useState({})
    const [loadingBIF, setLoadingBIF] = useState(false)
    console.log(dataTransferBif, "dataTransferBif");
    
    const [showPasswordTransferBIF, setShowPasswordTransferBIF] = useState(false);

    const togglePasswordVisibilityTransferBIF = () => {
        setShowPasswordTransferBIF(!showPasswordTransferBIF);
    };
    const passwordInputTypeTransferBIF = showPasswordTransferBIF ? "text" : "password";
    const passwordIconColorTransferBIF = showPasswordTransferBIF ? "#262B40" : "";

    function handleChangeTransferBIF(e) {
        setInputDataBif({
            ...inputDataBif,
            [e.target.name] : e.target.value
        })
    }

    async function TransferBIFHandler(bankCode, accNumber, accName, amount, note, pinNumber) {
        try {
            setLoadingBIF(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"BankCode": "${bankCode}", "BeneficiaryAccountNumber": "${accNumber}", "BeneficiaryAccountName": "${accName}", "SettlementAmount": "${amount}", "Description": "${note}", "PinNumber": "${pinNumber}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTransferBif = await axios.post(BaseURL + "/BankTransaction/TransferBiFast", { data: dataParams }, { headers: headers })
            console.log(dataTransferBif, 'ini list dana masuk');
            if (dataTransferBif.status === 200 && dataTransferBif.data.response_code === 200 && dataTransferBif.data.response_new_token.length === 0) {
                setDataTransferBif(dataTransferBif.data.response_data.results)
                setLoadingBIF(false)
            } else if (dataTransferBif.status === 200 && dataTransferBif.data.response_code === 200 && dataTransferBif.data.response_new_token.length !== 0) {
                setUserSession(dataTransferBif.data.response_new_token)
                setDataTransferBif(dataTransferBif.data.response_data.results)
                setLoadingBIF(false)
            }
        } catch (error) {
            // console.log(error)
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    /* FUNCTION TAB TRANSFER ONLINE */

    const [inputDataOnline, setInputDataOnline] = useState({
        bankCode: "",
        accNumber: "",
        accName: "",
        amount: "",
        desc: "",
        pinNumber: ""
    })
    const [dataTransferOnline, setDataTransferOnline] = useState({})
    const [loadingOnline, setLoadingOnline] = useState(false)
    console.log(dataTransferOnline, "dataTransferOnline");

    const [showPasswordTransferOnline, setShowPasswordTransferOnline] = useState(false);

    const togglePasswordVisibilityTransferOnline = () => {
        setShowPasswordTransferOnline(!showPasswordTransferOnline);
    };
    const passwordInputTypeTransferOnline = showPasswordTransferOnline ? "text" : "password";
    const passwordIconColorTransferOnline = showPasswordTransferOnline ? "#262B40" : "";

    function handleChangeTransferOnline(e) {
        setInputDataOnline({
            ...inputDataOnline,
            [e.target.name] : e.target.value
        })
    }

    async function TransferOnlineHandler(bankCode, accNumber, accName, amount, note, pinNumber) {
        try {
            setLoadingOnline(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"BankCode": "${bankCode}", "BeneficiaryAccountNumber": "${accNumber}", "BeneficiaryAccountName": "${accName}", "Amount": "${amount}", "Description": "${note}", "PinNumber": "${pinNumber}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTransferOnline = await axios.post(BaseURL + "/BankTransaction/TransferOnline", { data: dataParams }, { headers: headers })
            console.log(dataTransferOnline, 'ini list dana masuk');
            if (dataTransferOnline.status === 200 && dataTransferOnline.data.response_code === 200 && dataTransferOnline.data.response_new_token.length === 0) {
                setDataTransferOnline(dataTransferOnline.data.response_data.results)
                setLoadingOnline(false)
            } else if (dataTransferOnline.status === 200 && dataTransferOnline.data.response_code === 200 && dataTransferOnline.data.response_new_token.length !== 0) {
                setUserSession(dataTransferOnline.data.response_new_token)
                setDataTransferOnline(dataTransferOnline.data.response_data.results)
                setLoadingOnline(false)
            }
        } catch (error) {
            // console.log(error)
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
          history.push('/login');
        }
        if (user_role === "102") {
            history.push("/404")
        } 
      }, [access_token])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Transaksi Bank</span>

            <div className='detail-akun-menu mt-3' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => balance("getBalance")} id="getbalancetab">
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="getbalancespan">Get Balance</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => balance("mutasi")} id="mutasitab">
                    <span className='menu-detail-akun-span' id="mutasispan">Mutasi</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => balance("transferBif")} id="transferbiftab">
                    <span className='menu-detail-akun-span' id="transferbifspan">Transfer BIF</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => balance("transferOnline")} id="transferonlinetab">
                    <span className='menu-detail-akun-span' id="transferonlinespan">Transfer Online</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>{}
            <div className='base-content-beranda'>
                {
                    isGetBalance === "getBalance" ? (
                        <>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div style={{ width: "30%" }}>Nama Bank <span style={{ color: "red" }}>*</span></div>
                                    <Form.Select name="bankType" className='input-text-ez me-3' style={{ display: "inline" }} value={inputGetBalance.bankType} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Bank</option>
                                        <option value={"014"}>Bank BCA</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"013"}>Bank Permata</option>
                                        {/* <option value={"022"}>Bank CIMB Niaga</option> */}
                                        {/* <option value={"008"}>Bank Mandiri</option> */}
                                        {/* <option value={"002"}>Bank BRI</option>
                                        <option value={"009"}>Bank BNI</option> */}
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <div style={{ width: "30%" }}>PIN <span style={{ color: "red" }}>*</span></div>
                                    <InputGroup style={{ width: "65%" }}>
                                        <Form.Control required name="pinNumber" className='input-text-user' type={passwordInputType} placeholder="Masukkan PIN" value={inputGetBalance.pinNumber} onChange={(e) => handleChange(e)}  />
                                        <InputGroup.Text onClick={togglePasswordVisibility} className="pass-log">
                                            <FontAwesomeIcon color={passwordIconColor} icon={faEye} />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => GetBalanceTransfer(inputGetBalance.bankType, inputGetBalance.pinNumber)}
                                                className={(inputGetBalance.bankType.length !== 0 && inputGetBalance.pinNumber.length !== 0) ? 'btn-ez-on' : "btn-ez"}
                                                disabled={inputGetBalance.bankType.length === 0 || inputGetBalance.pinNumber.length === 0}
                                            >
                                                {
                                                    loadingBalance === true ? (
                                                        <Spinner animation="border" variant="dark" />
                                                    ) : "Terapkan"
                                                }
                                                
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonHandle()}
                                                className={(inputGetBalance.bankType.length !== 0 || inputGetBalance.pinNumber.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputGetBalance.bankType.length === 0 && inputGetBalance.pinNumber.length === 0}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-start align-items-center mt-4'>
                                <div style={{ width: "8rem" }}>Saldo :</div>
                                <strong>{Object.keys(dataGetBalance).length === 0 ? "-" : convertToRupiah(dataGetBalance.balanceAmount)}</strong>
                            </div>
                            <div className='mt-4 pb-4' style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700 }}>
                                {
                                    Object.keys(dataBankBalance).length !== 0 ? (
                                        <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={dataBankBalance}></JSONPretty></div>
                                    ) : (
                                        <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}>-</div>
                                    )
                                }
                            </div>  
                        </>
                    ) : isGetBalance === "mutasi" ? (
                        <>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <div style={{ width: "" }}>Nama Bank <span style={{ color: "red" }}>*</span></div>
                                    <Form.Select name="bankTypeMutasi" className='input-text-ez me-3' style={{ display: "inline" }} value={inputMutasi.bankTypeMutasi} onChange={(e) => handleChangeMutasi(e)}>
                                        <option defaultChecked disabled value="">Pilih Bank</option>
                                        <option value={"014"}>Bank BCA</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"013"}>Bank Permata</option>
                                        {/* <option value={"022"}>Bank CIMB Niaga</option> */}
                                        {/* <option value={"008"}>Bank Mandiri</option> */}
                                        {/* <option value={"002"}>Bank BRI</option>
                                        <option value={"009"}>Bank BNI</option> */}
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <div style={{ width: "20%" }}>PIN <span style={{ color: "red" }}>*</span></div>
                                    <InputGroup style={{ width: "65%" }}>
                                        <Form.Control required name="pinNumberMutasi" className='input-text-user' type={passwordInputTypeMutasi} placeholder="Masukkan PIN" value={inputMutasi.pinNumberMutasi} onChange={(e) => handleChangeMutasi(e)}  />
                                        <InputGroup.Text onClick={togglePasswordVisibilityMutasi} className="pass-log">
                                            <FontAwesomeIcon color={passwordIconColorMutasi} icon={faEye} />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <div className='me-3' style={{ width: "" }}>Periode <span style={{ color: "red" }}>*</span></div>
                                    <DateRangePicker
                                        onChange={pickDateMutasi}
                                        value={stateGetMutasi}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-4 pb-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                className={(inputMutasi.bankTypeMutasi.length !== 0 && inputMutasi.pinNumberMutasi.length !== 0 && dateRangeGetMutasi.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                                disabled={inputMutasi.bankTypeMutasi.length === 0 || inputMutasi.pinNumberMutasi.length === 0 || dateRangeGetMutasi.length === 0}
                                                onClick={() => GetMutasiBank(inputMutasi.bankTypeMutasi, inputMutasi.pinNumberMutasi, dateRangeGetMutasi, "N", "")}
                                            >
                                                {
                                                    loadingMutasi === true ? (
                                                        <Spinner animation="border" variant="dark" />
                                                    ) : "Terapkan"
                                                }
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                className={(inputMutasi.bankTypeMutasi.length !== 0 || inputMutasi.pinNumberMutasi.length !== 0 || dateRangeGetMutasi.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputMutasi.bankTypeMutasi.length === 0 && inputMutasi.pinNumberMutasi.length === 0 && dateRangeGetMutasi.length === 0}
                                                onClick={() => resetButtonHandleMutasi()}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                (inputMutasi.bankTypeMutasi === "011" || inputMutasi.bankTypeMutasi === "013") && (
                                    <Row className="d-flex justify-content-end align-items-center">
                                        <Col xs={2} >
                                            <button
                                                className={(Object.keys(dataMutasi).length !== 0 && dataMutasi.nextRecord === "Y") ? 'btn-ez-on' : 'btn-ez'}
                                                disabled={Object.keys(dataMutasi).length === 0 || (Object.keys(dataMutasi).length !== 0 && dataMutasi.nextRecord === "N")}
                                                style={{ width: "", padding: "0px 15px" }}
                                                onClick={() => GetMutasiBank(inputMutasi.bankTypeMutasi, inputMutasi.pinNumberMutasi, dateRangeGetMutasi, dataMutasi.nextRecord, dataMutasi.matchedRecord)}
                                            >
                                                Next
                                            </button>
                                        </Col>
                                    </Row>
                                )
                            }
                            <div className='p-3 mt-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6, height: 240, overflowY: "auto" }}><JSONPretty id="json-pretty" data={Object.keys(dataMutasi).length === 0 ? "-" : dataMutasi.jsonResponse}></JSONPretty></div>
                        </>
                    ) : isGetBalance === "transferBif" ? (
                        <>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Nama Bank <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Select name="bankCode" className='input-text-user' style={{ display: "" }} value={inputDataBif.bankCode} onChange={(e) => handleChangeTransferBIF(e)}>
                                        <option defaultChecked disabled value="">Pilih Bank</option>
                                        <option value={"014"}>Bank BCA</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"013"}>Bank Permata</option>
                                        {/* <option value={"022"}>Bank CIMB Niaga</option> */}
                                        {/* <option value={"008"}>Bank Mandiri</option> */}
                                        {/* <option value={"002"}>Bank BRI</option>
                                        <option value={"009"}>Bank BNI</option> */}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Rekening Tujuan <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="accNumber" className='input-text-user' type="text" placeholder="Masukkan Rekening Tujuan" value={inputDataBif.accNumber} onChange={(e) => handleChangeTransferBIF(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Nama Pemilik Rekening <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="accName" className='input-text-user' type="text" placeholder="Masukkan Nama Pemilik Rekening" value={inputDataBif.accName} onChange={(e) => handleChangeTransferBIF(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Nominal <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="amount" className='input-text-user' type="text" placeholder="Masukkan Nominal" value={inputDataBif.amount} onChange={(e) => handleChangeTransferBIF(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Bank Code Tujuan <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="bankCode" disabled className='input-text-user' type="text" placeholder="Masukkan Bank Code Tujuan" value={inputDataBif.bankCode} onChange={(e) => handleChangeTransferBIF(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Catatan <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="desc" className='input-text-user' type="text" placeholder="Masukkan Catatan" value={inputDataBif.desc} onChange={(e) => handleChangeTransferBIF(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>PIN <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <InputGroup>
                                        <Form.Control required name="pinNumber" className='input-text-user' type={passwordInputTypeTransferBIF} placeholder="Masukkan PIN" value={inputDataBif.pinNumber} onChange={(e) => handleChangeTransferBIF(e)}  />
                                        <InputGroup.Text onClick={togglePasswordVisibilityTransferBIF} className="pass-log">
                                            <FontAwesomeIcon color={passwordIconColorTransferBIF} icon={faEye} />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-end align-items-center pb-4">
                                <Col xs={2} >
                                    <button
                                        className={(inputDataBif.bankCode.length !== 0 && inputDataBif.accNumber.length !== 0 && inputDataBif.accName.length !== 0 && inputDataBif.amount.length !== 0 && inputDataBif.desc.length !== 0 && inputDataBif.pinNumber.length !== 0) ? 'btn-ez-on' :'btn-ez'}
                                        disabled={inputDataBif.bankCode.length === 0 || inputDataBif.accNumber.length === 0 || inputDataBif.accName.length === 0 || inputDataBif.amount.length === 0 || inputDataBif.desc.length === 0 || inputDataBif.pinNumber.length === 0}
                                        style={{ width: "", padding: "0px 15px" }}
                                        onClick={() => TransferBIFHandler(inputDataBif.bankCode, inputDataBif.accNumber, inputDataBif.accName, inputDataBif.amount, inputDataBif.desc, inputDataBif.pinNumber)}
                                    >
                                        {
                                            loadingBIF === true ? (
                                                <Spinner animation="border" variant="dark" />
                                            ) : "Transfer BIF"
                                        }
                                    </button>
                                </Col>
                            </Row>
                            <div className='p-3 align-items-center' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={Object.keys(dataTransferBif).length !== 0 ? dataTransferBif.jsonResponse : "-"}></JSONPretty></div>
                        </>
                    ) : (
                        <>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Nama Bank <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Select name="bankCode" className='input-text-user' style={{ display: "" }} value={inputDataOnline.bankCode} onChange={(e) => handleChangeTransferOnline(e)}>
                                        <option defaultChecked disabled value="">Pilih Bank</option>
                                        <option value={"014"}>Bank BCA</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"013"}>Bank Permata</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Rekening Tujuan <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="accNumber" className='input-text-user' type="text" placeholder="Masukkan Rekening Tujuan" value={inputDataOnline.accNumber} onChange={(e) => handleChangeTransferOnline(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Nama Pemilik Rekening <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="accName" className='input-text-user' type="text" placeholder="Masukkan Nama Pemilik Rekening" value={inputDataOnline.accName} onChange={(e) => handleChangeTransferOnline(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Nominal <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="amount" className='input-text-user' type="text" placeholder="Masukkan Nominal" value={inputDataOnline.amount} onChange={(e) => handleChangeTransferOnline(e)}/>
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Bank Code Tujuan <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="bankCode" disabled className='input-text-user' type="text" placeholder="Masukkan Bank Code Tujuan" value={inputDataOnline.bankCode} onChange={(e) => handleChangeTransferOnline(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>Catatan <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control name="desc" className='input-text-user' type="text" placeholder="Masukkan Catatan" value={inputDataOnline.desc} onChange={(e) => handleChangeTransferOnline(e)} />
                                </Col>
                            </Row>
                            <Row className=' align-items-center pb-4'>
                                <Col xs={2}>
                                    <div style={{ width: "" }}>PIN <span style={{ color: "red" }}>*</span></div>
                                </Col>
                                <Col xs={10}>
                                    <InputGroup>
                                        <Form.Control required name="pinNumber" className='input-text-user' type={passwordInputTypeTransferOnline} placeholder="Masukkan PIN" value={inputDataOnline.pinNumber} onChange={(e) => handleChangeTransferOnline(e)}  />
                                        <InputGroup.Text onClick={togglePasswordVisibilityTransferOnline} className="pass-log">
                                            <FontAwesomeIcon color={passwordIconColorTransferOnline} icon={faEye} />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-end align-items-center pb-4">
                                <Col xs={2} >
                                    <button
                                        className={(inputDataOnline.bankCode.length !== 0 && inputDataOnline.accNumber.length !== 0 && inputDataOnline.accNumber.length !== 0 && inputDataOnline.amount.length !== 0 && inputDataOnline.desc.length !== 0 && inputDataOnline.pinNumber.length !== 0) ? 'btn-ez-on' : 'btn-ez'}
                                        disabled={inputDataOnline.bankCode.length === 0 || inputDataOnline.accNumber.length === 0 || inputDataOnline.accNumber.length === 0 || inputDataOnline.amount.length === 0 || inputDataOnline.desc.length === 0 || inputDataOnline.pinNumber.length === 0}
                                        style={{ width: "", padding: "0px 15px" }}
                                        onClick={() => TransferOnlineHandler(inputDataOnline.bankCode, inputDataOnline.accNumber, inputDataOnline.accNumber, inputDataOnline.amount, inputDataOnline.desc, inputDataOnline.pinNumber)}
                                    >
                                        {
                                            loadingOnline === true ? (
                                                <Spinner animation="border" variant="dark" />
                                            ) : "Transfer Online"
                                        }
                                    </button>
                                </Col>
                            </Row>
                            <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={Object.keys(dataTransferOnline).length !== 0 ? dataTransferOnline.jsonResponse : "-"}></JSONPretty></div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default GetBalance