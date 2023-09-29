import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Row } from '@themesberg/react-bootstrap'
import { useState } from 'react'
import $ from 'jquery'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import JSONPretty from 'react-json-pretty'
import { useEffect } from 'react'

const GetBalance = () => {

    const user_role = getRole()
    const history = useHistory()
    const access_token = getToken()
    const [isGetBalance, setIsGetBalance] = useState("getBalance")

    function balance(isTabs){
        if(isTabs === "getBalance"){
            setIsGetBalance(isTabs)
            setBankTypeMutasi("")
            setDataMutasi({})
            setDateRangeGetMutasi([])
            setStateGetMutasi(null)
            setInputDataBif({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: ""
            })
            setDataTransferBif({}) 
            setInputDataOnline({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: ""
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
            setBankType("")
            setDataGetBalance({})
            setDataBankBalance({})
            setInputDataBif({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: ""
            })
            setDataTransferBif({})
            setInputDataOnline({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: ""
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
            setBankType("")
            setDataGetBalance({})
            setDataBankBalance({})
            setBankTypeMutasi("")
            setDataMutasi({})
            setDateRangeGetMutasi([])
            setStateGetMutasi(null)
            setInputDataOnline({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: ""
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
            setBankType("")
            setDataGetBalance({})
            setDataBankBalance({})
            setBankTypeMutasi("")
            setDataMutasi({})
            setDateRangeGetMutasi([])
            setStateGetMutasi(null)
            setInputDataBif({
                bankCode: "",
                accNumber: "",
                accName: "",
                amount: "",
                desc: ""
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

    const [bankType, setBankType] = useState("")
    const [dataGetBalance, setDataGetBalance] = useState({})
    const [dataBankBalance, setDataBankBalance] = useState({})
    console.log(dataGetBalance, "dataGetBalance");
    console.log(dataBankBalance, "dataBankBalance");

    function handleChange(e) {
        setBankType(e.target.value)
    }

    async function GetBalanceTransfer(bankType) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"bankType": "${bankType}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGetBalance = await axios.post(BaseURL + "/BankTransaction/GetBankBalance", { data: dataParams }, { headers: headers })
            console.log(dataGetBalance, 'ini list dana masuk');
            if (dataGetBalance.status === 200 && dataGetBalance.data.response_code === 200 && dataGetBalance.data.response_new_token.length === 0) {
                setDataGetBalance(dataGetBalance.data.response_data.results)
                setDataBankBalance(dataGetBalance.data.response_data.results.additionalMessage)
            } else if (dataGetBalance.status === 200 && dataGetBalance.data.response_code === 200 && dataGetBalance.data.response_new_token.length !== 0) {
                setUserSession(dataGetBalance.data.response_new_token)
                setDataGetBalance(dataGetBalance.data.response_data.results)
                setDataBankBalance(dataGetBalance.data.response_data.results.additionalMessage)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    /* FUNCTION TAB MUTASI */

    const [bankTypeMutasi, setBankTypeMutasi] = useState("")
    const [dataMutasi, setDataMutasi] = useState({})
    const [dateRangeGetMutasi, setDateRangeGetMutasi] = useState([])
    const [stateGetMutasi, setStateGetMutasi] = useState(null)
    console.log(dateRangeGetMutasi, "dateRangeGetMutasi");

    function handleChangeMutasi(e) {
        setBankTypeMutasi(e.target.value)
    }

    function pickDateDanaMasuk(item) {
        setStateGetMutasi(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeGetMutasi(item)
        }
    }

    async function GetMutasiBank(bankType, periode, next) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"bankType": "${bankType}", "endDate": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "NextRecord": "${next}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGetMutasi = await axios.post(BaseURL + "/BankTransaction/GetBankStatement", { data: dataParams }, { headers: headers })
            console.log(dataGetMutasi, 'ini list dana masuk');
            if (dataGetMutasi.status === 200 && dataGetMutasi.data.response_code === 200 && dataGetMutasi.data.response_new_token.length === 0) {
                setDataMutasi(dataGetMutasi.data.response_data.results)
            } else if (dataGetMutasi.status === 200 && dataGetMutasi.data.response_code === 200 && dataGetMutasi.data.response_new_token.length !== 0) {
                setUserSession(dataGetMutasi.data.response_new_token)
                setDataMutasi(dataGetMutasi.data.response_data.results)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }
    console.log(dataMutasi, "dataMutasi");

    /* FUNCTION TAB TRANSFER BIF */

    const [inputDataBif, setInputDataBif] = useState({
        bankCode: "",
        accNumber: "",
        accName: "",
        amount: "",
        desc: ""
    })
    const [dataTransferBif, setDataTransferBif] = useState({})
    console.log(dataTransferBif, "dataTransferBif");

    function handleChangeTransferBIF(e) {
        setInputDataBif({
            ...inputDataBif,
            [e.target.name] : e.target.value
        })
    }

    async function TransferBIFHandler(bankCode, accNumber, accName, amount, note) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"BankCode": "${bankCode}", "BeneficiaryAccountNumber": "${accNumber}", "BeneficiaryAccountName": "${accName}", "SettlementAmount": "${amount}", "Description": "${note}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTransferBif = await axios.post(BaseURL + "/BankTransaction/TransferBiFast", { data: dataParams }, { headers: headers })
            console.log(dataTransferBif, 'ini list dana masuk');
            if (dataTransferBif.status === 200 && dataTransferBif.data.response_code === 200 && dataTransferBif.data.response_new_token.length === 0) {
                setDataTransferBif(dataTransferBif.data.response_data.results)
            } else if (dataTransferBif.status === 200 && dataTransferBif.data.response_code === 200 && dataTransferBif.data.response_new_token.length !== 0) {
                setUserSession(dataTransferBif.data.response_new_token)
                setDataTransferBif(dataTransferBif.data.response_data.results)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    /* FUNCTION TAB TRANSFER ONLINE */

    const [inputDataOnline, setInputDataOnline] = useState({
        bankCode: "",
        accNumber: "",
        accName: "",
        amount: "",
        desc: ""
    })
    const [dataTransferOnline, setDataTransferOnline] = useState({})
    console.log(dataTransferOnline, "dataTransferOnline");

    function handleChangeTransferOnline(e) {
        setInputDataOnline({
            ...inputDataOnline,
            [e.target.name] : e.target.value
        })
    }

    async function TransferOnlineHandler(bankCode, accNumber, accName, amount, note) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"BankCode": "${bankCode}", "BeneficiaryAccountNumber": "${accNumber}", "BeneficiaryAccountName": "${accName}", "Amount": "${amount}", "Description": "${note}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTransferOnline = await axios.post(BaseURL + "/BankTransaction/TransferOnline", { data: dataParams }, { headers: headers })
            console.log(dataTransferOnline, 'ini list dana masuk');
            if (dataTransferOnline.status === 200 && dataTransferOnline.data.response_code === 200 && dataTransferOnline.data.response_new_token.length === 0) {
                setDataTransferOnline(dataTransferOnline.data.response_data.results)
            } else if (dataTransferOnline.status === 200 && dataTransferOnline.data.response_code === 200 && dataTransferOnline.data.response_new_token.length !== 0) {
                setUserSession(dataTransferOnline.data.response_new_token)
                setDataTransferOnline(dataTransferOnline.data.response_data.results)
            }
        } catch (error) {
          // console.log(error)
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
                            <Row className='pb-4'>
                                <Col xs={6} className="d-flex justify-content-between align-items-center">
                                    <div style={{ width: "30%" }}>Nama Bank <span style={{ color: "red" }}>*</span></div>
                                    <Form.Select name="statusDanaMasuk" className='input-text-ez me-3' style={{ display: "inline" }} value={bankType} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Bank</option>
                                        <option value={"014"}>Bank BCA</option>
                                        <option value={"022"}>Bank CIMB Niaga</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"008"}>Bank Mandiri</option>
                                        <option value={"013"}>Bank Permata</option>
                                        <option value={"002"}>Bank BRI</option>
                                        <option value={"009"}>Bank BNI</option>
                                    </Form.Select>
                                    <button
                                        className='btn-ez-on'
                                        style={{ width: "40%", padding: "0px 15px" }}
                                        onClick={() => GetBalanceTransfer(bankType)}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-start align-items-center'>
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
                            <Row className='pb-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <div style={{ width: "" }}>Nama Bank <span style={{ color: "red" }}>*</span></div>
                                    <Form.Select name="statusDanaMasuk" className='input-text-ez me-3' style={{ display: "inline" }} value={bankTypeMutasi} onChange={(e) => handleChangeMutasi(e)}>
                                        <option defaultChecked disabled value="">Pilih Bank</option>
                                        <option value={"014"}>Bank BCA</option>
                                        <option value={"022"}>Bank CIMB Niaga</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"008"}>Bank Mandiri</option>
                                        <option value={"013"}>Bank Permata</option>
                                        <option value={"002"}>Bank BRI</option>
                                        <option value={"009"}>Bank BNI</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <div className='me-3' style={{ width: "" }}>Periode <span style={{ color: "red" }}>*</span></div>
                                    <DateRangePicker
                                        onChange={pickDateDanaMasuk}
                                        value={stateGetMutasi}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={2} className="d-flex justify-content-start align-items-center">
                                    <button
                                        className='btn-ez-on'
                                        style={{ width: "", padding: "0px 15px" }}
                                        onClick={() => GetMutasiBank(bankTypeMutasi, dateRangeGetMutasi, "N")}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                            </Row>
                            {
                                (bankTypeMutasi === "011" || bankTypeMutasi === "013") && (
                                    <Row className="d-flex justify-content-end align-items-center">
                                        <Col xs={2} >
                                            <button
                                                className='btn-ez-on'
                                                style={{ width: "", padding: "0px 15px" }}
                                                onClick={() => GetMutasiBank(bankTypeMutasi, dateRangeGetMutasi, dataMutasi.nextRecord)}
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
                                        <option value={"022"}>Bank CIMB Niaga</option>
                                        <option value={"011"}>Bank Danamon</option>
                                        <option value={"008"}>Bank Mandiri</option>
                                        <option value={"013"}>Bank Permata</option>
                                        <option value={"002"}>Bank BRI</option>
                                        <option value={"009"}>Bank BNI</option>
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
                            <Row className="d-flex justify-content-end align-items-center pb-4">
                                <Col xs={2} >
                                    <button
                                        className='btn-ez-on'
                                        style={{ width: "", padding: "0px 15px" }}
                                        onClick={() => TransferBIFHandler(inputDataBif.bankCode, inputDataBif.accNumber, inputDataBif.accName, inputDataBif.amount, inputDataBif.desc)}
                                    >
                                        Transfer BIF
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
                            <Row className="d-flex justify-content-end align-items-center pb-4">
                                <Col xs={2} >
                                    <button
                                        className='btn-ez-on'
                                        style={{ width: "", padding: "0px 15px" }}
                                        onClick={() => TransferOnlineHandler(inputDataOnline.bankCode, inputDataOnline.accNumber, inputDataOnline.accNumber, inputDataOnline.amount, inputDataOnline.desc)}
                                    >
                                        Transfer Online
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