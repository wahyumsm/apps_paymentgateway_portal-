import React from 'react'
import { Button, Col, Form, Row, Table, Modal, Alert, Toast } from '@themesberg/react-bootstrap'
import { BaseURL, convertFormatNumber, convertToRupiah, getRole, getToken, setUserSession } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import Checklist from '../../assets/icon/checklist_icon.svg'
import { useEffect } from 'react'
import axios from 'axios'
import encryptData from '../../function/encryptData'
import noteIconRed from "../../assets/icon/note_icon_red.svg"

function AlokasiSaldo() {

    const user_role = getRole()
    const [balance, setBalance] = useState({})
    const [balanceDetail, setBalanceDetail] = useState([])
    const [disbursementChannel, setDisbursementChannel] = useState([])
    const [showModalSaveAlokasiSaldo, setShowModalSaveAlokasiSaldo] = useState(false)
    const [showAlertSuccess, setShowAlertSuccess] = useState(false)
    const [showAlertSaldoTidakCukup, setShowAlertSaldoTidakCukup] = useState(false)
    const [disburseBCA, setDisburseBCA] = useState({
        id: "32",
        checked: true,
        minAlokasi: false,
        addedAmount: 0
    })
    const [disburseDana, setDisburseDana] = useState({
        id: "31",
        checked: false,
        minAlokasi: false,
        addedAmount: 0
    })
    const [disburseMandiri, setDisburseMandiri] = useState({
        id: "33",
        checked: false,
        minAlokasi: false,
        addedAmount: 0
    })
    const [addedDisbursementChannels, setaddedDisbursementChannels] = useState([{
        id: "32",
        addedAmount: 0
    }])
    const [inputHandle, setInputHandle] = useState({
        nominalBCA: 0,
        nominalDana: 0,
        checklistBCA: true,
        DanaFlag: false,
        BCAFlag: false,
        MandiriFlag: false,
    })

    function convertToRupiahFunct(sisaSaldo, alokasiDana, alokasiBCA, alokasiMandiri) {
        // console.log(sisaSaldo - alokasiDana - alokasiBCA - alokasiMandiri, 'ini sisaSaldo');
        // console.log(alokasiDana, 'ini alokasiDana');
        // console.log(alokasiBCA, 'ini alokasiBCA');
        // console.log(alokasiMandiri, 'ini alokasiMandiri');
        let finalSisaSaldo = Number(sisaSaldo) - Number(alokasiDana) - Number(alokasiBCA) - Number(alokasiMandiri)
        setTimeout(() => {
            if (finalSisaSaldo < 0) {
                setShowAlertSaldoTidakCukup(true)
            } else {
                setShowAlertSaldoTidakCukup(false)
            }
        }, 500);
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(finalSisaSaldo)
    }

    function handleChecklist(e, catId) {
        console.log(e.target.name.slice(9));
        console.log(e.target.checked);
        // if (e.target.checked === true) {
        //     setaddedDisbursementChannels([
        //         ...addedDisbursementChannels,
        //         {
        //             id: e.target.id,
        //             addedAmount: 0
        //         }
        //     ])
        // } else {
        //     const newAddedDisbursementChannels = addedDisbursementChannels.filter(item => (
        //         item.id !== e.target.id
        //     ))
        //     setaddedDisbursementChannels(newAddedDisbursementChannels)
        // }
        if (e.target.id === "31") {
            setDisburseDana({
                ...disburseDana,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        } else if (e.target.id === "32") {
            setDisburseBCA({
                ...disburseBCA,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        } else if (e.target.id === "33") {
            setDisburseMandiri({
                ...disburseMandiri,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.checked,
            [`nominal${(e.target.name).slice(9)}`]: 0
        })
    }

    function handleChangeAmount(e, catId, minimalAlokasiSaldo) {
        if (e.target.id === "31" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseDana({
                ...disburseDana,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "31" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseDana({
                ...disburseDana,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "32" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseBCA({
                ...disburseBCA,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "32" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseBCA({
                ...disburseBCA,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "33" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseMandiri({
                ...disburseMandiri,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "33" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseMandiri({
                ...disburseMandiri,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name]: Number(e.target.value).toString()
        })
    }

    function handleChangeText(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value
        })
        addedDisbursementChannels.forEach(item => {
            if (!item.channel) {
                setaddedDisbursementChannels([
                    ...addedDisbursementChannels,
                    {
                        channel: e.target.name,
                        addedAmount: e.target.value
                    }
                ])
            } else if (item.channel && item.channel === e.target.name) {
                setaddedDisbursementChannels([
                    ...addedDisbursementChannels,
                    {
                        addedAmount: e.target.value
                    }
                ])
            }
        })
        // setNominalBCA(e.target.value)
    }

    function handleChangeNumber(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: Number(e.target.value).toString()
        })
        // setNominalBCA(Number(e.target.value).toString())
    }

    function setOnBlurFunction(value, key) {
        setInputHandle({
            ...inputHandle,
            [key]: true
        })
    }

    function setOnFocusFunction(value, key) {
        setInputHandle({
            ...inputHandle,
            [key]: false
        })
    }

    async function getBalance() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const balance = await axios.post("/Partner/GetBalance", { data: "" }, { headers: headers })
            console.log(balance, 'ini balance alokasi');
            if (balance.status === 200 && balance.data.response_code === 200 && balance.data.response_new_token.length === 0) {
                setBalance(balance.data.response_data)
                setBalanceDetail(balance.data.response_data.balance_detail)
            } else if (balance.status === 200 && balance.data.response_code === 200 && balance.data.response_new_token.length !== 0) {
                setUserSession(balance.data.response_new_token)
                setBalance(balance.data.response_data)
                setBalanceDetail(balance.data.response_data.balance_detail)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getDisbursementChannel() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const disbursementChannel = await axios.post("/Partner/ListDisburseChannel", { data: "" }, { headers: headers })
            console.log(disbursementChannel, "disburse channel");
            if (disbursementChannel.status === 200 && disbursementChannel.data.response_code === 200 && disbursementChannel.data.response_new_token.length === 0) {
                setDisbursementChannel(disbursementChannel.data.response_data)
            } else if (disbursementChannel.status === 200 && disbursementChannel.data.response_code === 200 && disbursementChannel.data.response_new_token.length !== 0) {
                setUserSession(disbursementChannel.data.response_new_token)
                setDisbursementChannel(disbursementChannel.data.response_data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function saveAlokasiSaldo(channelDana, channelBCA, channelMandiri) {
        try {
            setShowModalSaveAlokasiSaldo(false)
            let newArr = []
            if (channelDana.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelDana.id),
                    mpaycat_id: Number(channelDana.cat_id),
                    amount: Number(channelDana.addedAmount),
                })
            }
            if (channelBCA.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelBCA.id),
                    mpaycat_id: Number(channelBCA.cat_id),
                    amount: Number(channelBCA.addedAmount),
                })
            }
            if (channelMandiri.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelMandiri.id),
                    mpaycat_id: Number(channelMandiri.cat_id),
                    amount: Number(channelMandiri.addedAmount),
                })
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(JSON.stringify(newArr))
            console.log(dataParams);
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const savedAlokasiSaldo = await axios.post("/Partner/SplitDisburseChannel", { data: dataParams }, { headers: headers })
            console.log(savedAlokasiSaldo, 'ini saved');
            if (savedAlokasiSaldo.status === 200 && savedAlokasiSaldo.data.response_code === 200 && savedAlokasiSaldo.data.response_new_token.length === 0) {
                setShowAlertSuccess(true)
                setTimeout(() => {
                    setShowAlertSuccess(false)
                    window.location.reload()
                }, 2000);
            } else if (savedAlokasiSaldo.status === 200 && savedAlokasiSaldo.data.response_code === 200 && savedAlokasiSaldo.data.response_new_token.length !== 0) {
                setUserSession(savedAlokasiSaldo.data.response_new_token)
                setShowAlertSuccess(true)
                setTimeout(() => {
                    setShowAlertSuccess(false)
                    window.location.reload()
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBalance()
        getDisbursementChannel()
    }, [])
    
    console.log(inputHandle, 'ini inputhandle');
    console.log(disburseBCA, 'ini disburseBCA');
    console.log(disburseDana, 'ini disburseDana');
    console.log(disburseMandiri, 'ini disburseMandiri');
    console.log(balance, "balance");
    console.log(showAlertSaldoTidakCukup, "showAlertSaldoTidakCukup");

    return (
        <div className="py-5 mt-5 content-page">
            <div className="head-title">
                <span className='breadcrumbs-span'>{(user_role === "102") ? "Beranda" : <Link to={"/"}>Beranda</Link>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Alokasi Saldo</span>
            </div>
            <br/>
            <div className="main-content">
                <span className='mt-4' style={{fontWeight: 600}}>Alokasi Saldo</span>
                <Row className='mt-2'>
                    <Col lg={4} className="mb-2">
                        <div className="card-information base-content-beranda" style={{ padding: "15px 25px" }}>
                            <p className="p-info">Saldo Tersedia</p>
                            <p className="p-amount">{(balance.balance !== undefined) ? convertToRupiah(balance.balance) :"Rp 0"}</p>
                        </div>
                    </Col>
                    {
                        balanceDetail.length !== 0 &&
                        balanceDetail.map(item => {
                            return (
                                <Col lg={4} className="mb-2" key={item.mpartballchannel_id}>
                                    <div className="card-information base-content-beranda" style={{ padding: "15px 25px" }}>
                                        <p className="p-info">Alokasi Saldo di {item.mpaytype_name}</p>
                                        <p className="p-amount">{(item.mpartballchannel_balance !== 0) ? convertToRupiah(item.mpartballchannel_balance) : "Rp 0"}</p>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <div className='mt-4'>
                    <span className='mt-4' style={{fontWeight: 600}}>Alokasikan Saldo</span>
                    <div className='base-content mt-2' style={{ padding: "20px 40px" }}>
                        <span style={{fontWeight: 600}}>Pilih Tujuan Alokasi Saldo</span>
                        <Row className='alokasi-saldo mt-3' style={{ verticalAlign: "middle" }}>
                            {
                                disbursementChannel.length !== 0 &&
                                disbursementChannel.map(item => {
                                    return (
                                        <Col xs={1} key={item.mpaytype_id}>
                                            {/* <img src={item.mpaytype_icon} alt={item.mpaytype_name} /> */}
                                            <Form.Check onChange={(e) => handleChecklist(e, item.mpaytype_mpaycat_id)} name={`checklist${item.mpaytype_name}`} checked={(item.mpaytype_name === "BCA") ? inputHandle.checklistBCA : inputHandle[`checklist${item.mpaytype_name}`]} label={item.mpaytype_name} id={item.mpaytype_id} htmlFor={item.mpaytype_id} />
                                        </Col>
                                    )
                                })
                            }
                            {/* <Col xs={1}>
                                <Form.Check label="Dana" id="Dana" htmlFor="Dana" />
                            </Col> */}
                        </Row>
                        <div className='mt-4' style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                        <div className='alokasi-amount mt-2'>
                            <Row>
                                {
                                    (disburseDana.checked === false && disburseBCA.checked === false && disburseMandiri.checked === false) ?
                                    <span style={{ fontSize: 14, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Tujuan alokasi wajib dipilih salah satu.</span> :
                                    disbursementChannel.length !== 0 &&
                                    disbursementChannel.map(item => {
                                        return (
                                            (inputHandle[`checklist${item.mpaytype_name}`] !== undefined && inputHandle[`checklist${item.mpaytype_name}`] === true) ?
                                            <Col lg={5} key={item.mpaytype_id}>
                                                <span style={{fontWeight: 600}}>{item.mpaytype_name}</span>
                                                <Form.Control onChange={(e) => handleChangeAmount(e, item.mpaytype_mpaycat_id, item.min_topup_allocation)} value={inputHandle[`nominal${item.mpaytype_name}`] === 0 ? 0 : inputHandle[`nominal${item.mpaytype_name}`]} min={0} className='input-text-ez' style={{ width: "70%", marginLeft: "unset" }} placeholder="Rp" id={item.mpaytype_id} name={`nominal${item.mpaytype_name}`} type='number' onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} />
                                                {/* {
                                                    inputHandle[`${item.mpaytype_name}Flag`] === true?
                                                    <Form.Control onBlur={() => setOnBlurFunction(!inputHandle[`${item.mpaytype_name}Flag`], `${item.mpaytype_name}Flag`)} onChange={handleChangeNumber} className='input-text-ez' style={{ width: "70%", marginLeft: "unset" }} placeholder="Rp" name={item.mpaytype_name} type="number" value={inputHandle.nominalBCA === 0 ? "Rp" : inputHandle.nominalBCA} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} /> :
                                                    <Form.Control onFocus={() => setOnFocusFunction(!inputHandle[`${item.mpaytype_name}Flag`], `${item.mpaytype_name}Flag`)} onChange={handleChangeText} className='input-text-ez' style={{ width: "70%", marginLeft: "unset" }} placeholder="Rp" name={item.mpaytype_name} type="text" value={inputHandle.nominalBCA === 0 ? "Rp" : convertFormatNumber(inputHandle.nominalBCA)} />
                                                    
                                                } */}
                                                {
                                                    item.mpaytype_id === 31 && disburseDana.minAlokasi === true && showAlertSaldoTidakCukup === false ? // kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : item.min_topup_allocation}</span> :
                                                    item.mpaytype_id === 31 && disburseDana.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 31 && disburseDana.minAlokasi === false && showAlertSaldoTidakCukup === true ? // tidak kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 32 && disburseBCA.minAlokasi === true && showAlertSaldoTidakCukup === false ?// kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : item.min_topup_allocation}</span> :
                                                    item.mpaytype_id === 32 && disburseBCA.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 32 && disburseBCA.minAlokasi === false && showAlertSaldoTidakCukup === true ?
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 33 && disburseMandiri.minAlokasi === true && showAlertSaldoTidakCukup === false ? // kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : item.min_topup_allocation}</span> :
                                                    item.mpaytype_id === 33 && disburseMandiri.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 33 && disburseMandiri.minAlokasi === false && showAlertSaldoTidakCukup === true ? // tidak kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    <span style={{ fontSize: 12, color: "#C4C4C4" }}>Masukkan nominal saldo yang akan dialokasikan.</span>
                                                }
                                            </Col> : null
                                        )
                                    })
                                }
                            </Row>
                        </div>
                        <div className='mt-4' style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                        <div className='alokasi-ringkasan mt-2'>
                            <span className='mb-3' style={{fontWeight: 600}}>Ringkasan</span>
                            <Table style={{ marginTop: 20 }}>
                                <tr>
                                    <td>
                                        <span>Saldo Tersedia</span>
                                    </td>
                                    <td>
                                        <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{(balance.balance !== undefined) ? convertToRupiah(balance.balance) :"Rp 0"}</span>
                                    </td>
                                </tr>
                                {/* {
                                    addedDisbursementChannels.length !== 0 &&
                                    addedDisbursementChannels.map(item => {
                                        return (
                                            <tr>
                                                <td>
                                                    <span>Alokasi ke {(item.id === "31") ? "Dana" : (item.id === "32") ? "BCA" : (item.id === "33") ? "Mandiri" : null}</span>
                                                </td>
                                                <td>
                                                    <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah(item.addedAmount)}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                } */}
                                {
                                    disbursementChannel.length !== 0 ?
                                    disbursementChannel.map(item => {
                                        return (
                                            <tr>
                                                {
                                                    (item.mpaytype_id === 31 && disburseDana.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 31 && disburseDana.checked === true) ? "Dana" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : 0)}</span>
                                                        </td>
                                                    </> :
                                                    (item.mpaytype_id === 32 && disburseBCA.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 32 && disburseBCA.checked === true) ? "BCA" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : 0)}</span>
                                                        </td>
                                                    </>:
                                                    (item.mpaytype_id === 33 && disburseMandiri.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 33 && disburseMandiri.checked === true) ? "Mandiri" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : 0)}</span>
                                                        </td>
                                                    </> : null
                                                }
                                            </tr>
                                        )
                                    }) : null
                                }
                            </Table>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "dotted", borderTopColor: "#C4C4C4" }}></div>
                            <Table style={{ marginTop: -10 }}>
                                <tr>
                                        <td>
                                            <span style={{ fontSize: 16, fontWeight: 600 }}>Saldo Tersisa</span>
                                        </td>
                                        <td>
                                            {
                                                showAlertSaldoTidakCukup ?
                                                // <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600, color: "#B9121B" }}>{convertToRupiahFunct((balance.balance !== undefined ? balance.balance : 0) - (Number(disburseDana.addedAmount)) - (Number(disburseBCA.addedAmount)) - (Number(disburseMandiri.addedAmount)))}</span> :
                                                <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600, color: "#B9121B" }}>{convertToRupiahFunct((balance.balance !== undefined) ? balance.balance : 0, disburseDana.addedAmount, disburseBCA.addedAmount, disburseMandiri.addedAmount)}</span> :
                                                <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiahFunct((balance.balance !== undefined) ? balance.balance : 0, disburseDana.addedAmount, disburseBCA.addedAmount, disburseMandiri.addedAmount)}</span>
                                            }
                                        </td>
                                    </tr>
                            </Table>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                            <div className='mt-2'>
                                <Row>
                                    <Col xxl={10}>
                                        <span style={{ fontSize: 18, fontWeight: 600 }}>Keterangan</span>
                                    </Col>
                                    <Row>
                                        <Col xxl={10}>
                                            <span style={{ color: "#888888", marginLeft: 10 }}><FontAwesomeIcon style={{ width: 5, marginRight: 5 }} icon={faCircle} /> Anda dapat mengalokasikan seluruh atau hanya sebagian saldo anda.</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xxl={10}>
                                            <span style={{ color: "#888888", marginLeft: 10 }}><FontAwesomeIcon style={{ width: 5, marginRight: 5 }} icon={faCircle} /> Anda dapat mengalokasikan saldo ke BCA dan DANA atau hanya salah satu saja.</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xxl={10}>
                                            <span style={{ color: "#888888", marginLeft: 10 }}><FontAwesomeIcon style={{ width: 5, marginRight: 5 }} icon={faCircle} /> Jika anda belum mengalokasikan saldo yang anda miliki, maka anda tidak bisa menggunakan saldo tersebut.</span>
                                        </Col>
                                    </Row>
                                </Row>
                            </div>
                        </div>
                        <div className='mt-4' style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                        <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            <button
                                onClick={() => setShowModalSaveAlokasiSaldo(true)}
                                className={((disburseDana.checked === true && disburseDana.minAlokasi === true) || (disburseDana.checked === true && disburseDana.minAlokasi === false && disburseDana.addedAmount === 0) || (disburseBCA.checked === true && disburseBCA.minAlokasi === true) || (disburseBCA.checked === true && disburseBCA.minAlokasi === false && disburseBCA.addedAmount === 0) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === true) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === false && disburseMandiri.addedAmount === 0) || (disburseDana.checked === false && disburseBCA.checked === false && disburseMandiri.checked === false) || showAlertSaldoTidakCukup === true) ? "btn-off mt-3 mb-3" : 'add-button mt-3 mb-3'}
                                style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                                disabled={(disburseDana.checked === true && disburseDana.minAlokasi === true) || (disburseDana.checked === true && disburseDana.minAlokasi === false && disburseDana.addedAmount === 0) || (disburseBCA.checked === true && disburseBCA.minAlokasi === true) || (disburseBCA.checked === true && disburseBCA.minAlokasi === false && disburseBCA.addedAmount === 0) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === true) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === false && disburseMandiri.addedAmount === 0) || (disburseDana.checked === false && disburseBCA.checked === false && disburseMandiri.checked === false) || showAlertSaldoTidakCukup === true}
                            >
                                Alokasikan Saldo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                size="lg"
                centered
                show={showModalSaveAlokasiSaldo}
                onHide={() => setShowModalSaveAlokasiSaldo(false)}
                style={{ borderRadius: 8 }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">Apakah Kamu Yakin Alokasikan Saldo?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">Saldo yang sudah di alokasikan tidak dapat dipindahkan atau ditarik ulang.</p>
                    </div>
                    <p>
                        
                    </p>                
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalSaveAlokasiSaldo(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;" }} className="mx-2">Tidak</Button>
                        <Button onClick={() => saveAlokasiSaldo(disburseDana, disburseBCA, disburseMandiri)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* <Alert
                // variant='secondary'
                show={showAlertSuccess}
                // show={true}
                onClose={() => closeHandle()}
                style={{ backgroundColor: "#077E86" }}
            >
                <div className='d-flex justify-content-center'>
                    <div>
                        <img src={circleCheck} className='me-1 mb-1' style={{ verticalAlign: "middle" }} />
                        <span style={{ color: "#FFFFFF" }}>Alokasi Saldo Telah Berhasil</span>
                    </div>
                    <Button variant="close" size="xs" style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }} onClick={() => setShowAlertSuccess(false)} />
                </div>
            </Alert> */}
            {
                showAlertSuccess &&
                <div className="d-flex justify-content-center align-items-center" style={{ zIndex: 3, position: "fixed", top: 70 }}>
                    <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowAlertSuccess(false)} show={showAlertSuccess} className="text-center" position="bottom-center">
                    <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Alokasi Saldo Telah Berhasil</Toast.Body>
                    </Toast>
                </div>
            }
        </div>
    )
}

export default AlokasiSaldo