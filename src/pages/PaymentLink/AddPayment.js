import React, { useEffect, useState } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import {Row, Col, Modal, Button} from "@themesberg/react-bootstrap"
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/DateRangePicker";
import noteIconRed from "../../assets/icon/note_icon_red.svg"
import checklistCircle from '../../assets/img/icons/checklist_circle.svg';
import CopyIcon from '../../assets/icon/iconcopy_icon.svg'
import check from '../../assets/icon/checklistpayment_icon.svg'
import $ from 'jquery'
import { useHistory } from "react-router-dom";
import { errorCatch, getToken, setUserSession } from "../../function/helpers";
import axios from "axios";
import encryptData from "../../function/encryptData";
import time from "../../assets/icon/time_icon.svg";
import { clamp } from "date-fns";
import Buttons from "../../components/Button"

function AddPayment () {
    const [showModal, setShowModal] = useState(false)
    const [showModalBatal, setShowModalBatal] = useState(false)
    const [showModalFeeMethod, setShowModalFeeMethod] = useState(false)
    const [text, setText] = useState('');
    const [save, setSave] = useState(false)
    const history = useHistory()
    const access_token = getToken()
    const [paymentType, setPaymentType] = useState([])
    const [checked, setChecked] = useState("1")
    const [expanded, setExpanded] = useState(false)
    const [inputHandle, setInputHandle] = useState ({
        nominal: null,
        paymentId: 0,
        refId: "",
        expDate: "",
        useLimit: 0,
        countLimit: 0,
        vaNumber: "",
        typePayment: 0,
        desc: "",
        custName: "",
        custEmail: "",
    })

    const handleOnChangeCheckBox = (e) => {
        setChecked(e.target.value);
        if (e.target.value === "2") setShowModalFeeMethod(true)
    }


    const showCheckboxes = () => {
        if (!expanded) {
          setExpanded(true);
        } else {
          setExpanded(false);
        }
    };

    async function paymentTypeHandler() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getPaymentType = await axios.post("/PaymentLink/GetListPaymentType", { data: "" }, { headers: headers })
            // console.log(getPaymentType, "ini payment type");
            if (getPaymentType.data.response_code === 200 && getPaymentType.status === 200 && getPaymentType.data.response_new_token.length === 0) {
                setPaymentType(getPaymentType.data.response_data)
            } else if (getPaymentType.data.response_code === 200 && getPaymentType.status === 200 && getPaymentType.data.response_new_token.length !== 0) {
                setUserSession(getPaymentType.data.response_new_token)
                setPaymentType(getPaymentType.data.response_data)
            }
            
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function addPaylinkHandler (paymentId, refId, nominal, expDate, useLimit, countLimit, vaNumber, typePayment, custName, custEmail, desc) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"tpaylink_code": "${paymentId}", "tpaylink_ref_id": "${refId}", "tpaylink_amount": ${nominal}, "tpaylink_exp_date": "${expDate}", "tpaylink_use_limit": ${useLimit}, "tpaylink_count_limit": ${countLimit}, "tpaylink_va_number": "${vaNumber}", "tpaylink_mpatype_id": "${typePayment}", "tpaylink_cust_name": "${custName}", "tpaylink_cust_email": "${custEmail}", "tpaylink_desc": "${desc}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const addPaymentLink = await axios.post("/PaymentLink/PaymentLinkCreate", { data: dataParams }, { headers: headers })
            console.log(addPaymentLink, "ini payment type");
            if (addPaymentLink.data.response_code === 200 && addPaymentLink.status === 200 && addPaymentLink.data.response_new_token.length === 0) {
                // setInputHandle(addPaymentLink.data.response_data)
                alert("Data User Management Berhasil Ditambahkan")

            } else if (addPaymentLink.data.response_code === 200 && addPaymentLink.status === 200 && addPaymentLink.data.response_new_token.length !== 0) {
                setUserSession(addPaymentLink.data.response_new_token)
                // setInputHandle(addPaymentLink.data.response_data)
                alert("Data User Management Berhasil Ditambahkan")
            }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    function handleChange(e) {
        setInputHandle({
          ...inputHandle,
          [e.target.name]: e.target.value,
        });
    }
    

    useEffect(() => {
        if(!access_token) {
            history.push("/login")
        }
        paymentTypeHandler()
    },[])

    $("textarea").keyup(function () {
        var characterCount = $(this).val().length,
          current = $("#current");      
        current.text(characterCount);
    });

    const copyHandler = (event) => {
        setText(event.target.value);
      };
    
    const copyUrl = async () => {
        var copyText = document.getElementById("copied");
        await navigator.clipboard.writeText(copyText.value);
        setSave(true)
    };

    const closeModal = () => {
        setShowModal(false)
        setSave(false)
    }

    function toDashboard () {
        history.push("/")
    }

    function toListPay () {
        history.push("/listpayment")
    }

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className="breadcrumbs-span"><span style={{cursor: "pointer"}}  onClick={() => toDashboard()}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<span style={{cursor: "pointer"}} onClick={() => toListPay()}>Payment Link</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Buat Payment Link</span>
            <div className="head-title">
                <h2 className="h4 my-4" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Buat Payment Link</h2>
            </div>
            <div className="base-content-beranda">
                <Row>
                    <Col xs={12}>
                        <div className="my-1">Amount <span style={{color: "red"}}>*</span></div>
                        <input 
                            onChange={handleChange}
                            name="nominal"
                            className="input-text-user" 
                            placeholder="Masukkan Nominal Tagihan"
                            value={inputHandle.nominal}
                        />
                        <div className="my-1" style={{fontSize: "12px"}}>*Biaya Admin: Rp 0 ( Dibebankan kepada partner )</div>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xs={6}>
                        <div className="my-1">Payment ID</div>
                        <input
                            onChange={handleChange}
                            name="paymentId"
                            className="input-text-user"
                            disabled
                            value="18737182"
                        />
                    </Col>
                    <Col xs={6}>
                        <div className="my-1">ID Referensi<span style={{color: "red"}}>*</span></div>
                        <input
                            name="refId"
                            className="input-text-user"
                            placeholder="Masukkan ID Referensi"
                        />
                        <div className="my-1" style={{fontSize: "12px"}}>Catatan: ID Referensi bisa berupa kata atau digit angka</div>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xs={6}>
                        <div className="my-3">Tanggal</div>
                        <DateRangePicker 
                            clearIcon={null}
                            className="input-date-user"
                            disabled
                            value={new Date()}
                        />
                    </Col>
                    <Col xs={6} className="position-relative">
                        <div className="my-1">Atur Waktu<span style={{color: "red"}}>*</span></div>
                        <div className="position-relative d-flex justify-content-between align-items-center ">
                            <input
                                className="input-text-user"
                                placeholder="Masukkan ID Referensi"
                            />
                            <div onClick={showCheckboxes} className="position-absolute right-1" style={{cursor: "pointer"}}>
                                <img src={time} alt="time" />
                            </div>                            
                        </div>
                        {expanded && (
                            <div className="right-2 border-black-0 border border-solid position-absolute bg-white mx-1 pt-4" style={{borderRadius: 8, height: "10rem", width: "10rem"}}>
                                <Buttons />
                            </div>
                        )}
                        {/* <TimePicker 
                            hour={hour}
                            minute={minute}
                            period={period}
                            setHour={setHour}
                            setMinute={setMinute}
                            setPeriod={setPeriod}
                        /> */}
                        <div className="my-1" style={{fontSize: "12px"}}>Kadaluarsa : 16 - 08 - 2022  15:43</div>
                        {/* <div style={{ color: "#B9121B", fontSize: 12 }}>
                            <img src={noteIconRed} className="me-2" />
                            Masa kadaluarsa tidak boleh kurang dari 5 menit
                        </div> */}
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xs={12}>
                        <div className="my-1">Batas Pemakaian</div>
                        <input 
                            onChange={handleChange}
                            name="useLimit"
                            type="number"
                            className="input-text-user"
                        />
                        <div className="my-1" style={{fontSize: "12px"}}>Catatan: Batas Pemakaian adalah seberapa banyak link anda dapat di akses</div>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={12}>
                        <div className="my-1">Metode Pembayaran</div>
                        <div className="d-flex justify-content-start align-items-center">
                            <div className="form-check me-2">
                                <input onChange={handleOnChangeCheckBox} value="1" className="form-check-input" type="radio" name="typePayment" id="typePayment" checked={checked === "1" && true} />
                                <label className="form-check-label" htmlFor="typePayment" style={{fontWeight: 400, fontSize: "14px"}}>Semua Metode Pembayaran</label>
                            </div>
                            <div className="form-check ms-2">
                                <input onChange={handleOnChangeCheckBox} value="2" className="form-check-input" type="radio" name="typePayment" id="typePayment" checked={checked === "2"} />
                                <label className="form-check-label" htmlFor="typePayment" style={{fontWeight: 400, fontSize: "14px"}}>Atur Beberapa</label>
                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-start align-items-center my-2">
                            {paymentType.map((item, idx) => {
                                return (
                                    <div key={idx} className="mx-2" >
                                        {item.mpaytype_icon !== "" ?
                                            <img src={item.mpaytype_icon} alt={item.mpaytype_name} width={128} height={64} /> :
                                            ""
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        
                    </Col>
                </Row>
                <Row className="mt-3 mb-5">
                    <Col xs={12}>
                        <div className="my-1">Deskripsi</div>
                        <textarea 
                            name="desc"
                            value={inputHandle.desc}
                            onChange={handleChange}
                            placeholder="Masukkan Deskripsi"
                            className="input-text-area"
                            style={{padding: 10, fontSize: "14px"}}
                            maxLength={150}
                        />
                        <div id="the-count" className="text-end">
                            <span id="current">0</span>
                            <span id="maximum"> / 150</span>
                        </div>
                    </Col>              
                </Row>                
            </div>
            <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "end"}}>
                <button onClick={() => setShowModal(true)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 250, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Buat Payment Link
                </button>
            </div>
            <Modal centered show={showModal} onHide={() => setShowModal(false)} style={{borderRadius: 8}}>
                <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 12 }}>
                        <img src={checklistCircle} alt="logo" />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, padding: "0px 12px", textAlign: "center" }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Selamat, Payment Link Kamu Berhasil Dibuat</p>
                    </div>
                    <Row>
                        <Col xs={12}>
                            <div className="my-1">Payment Link</div>
                            <input 
                                id="copied"
                                className="input-text-user" 
                                placeholder="Masukkan Nominal Tagihan"
                                value="https://ezeelink.co.id/paymentlink/idpaymentlink"
                                onChange={copyHandler}                                
                            />                            
                        </Col>
                    </Row>
                    {save ?                        
                    <div className="my-3" style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <Button variant="primary" style={{ fontFamily: "Exo", color: "#FFFFFF", background: "#492E20", maxHeight: 45, width: 500, height: "100%" }}><span><img src={check} alt="copy" className="me-2" /></span>Link Tersalin</Button>
                    </div> :                    
                    <div className="my-3" style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <Button onClick={copyUrl} variant="primary" style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxHeight: 45, width: 500, height: "100%" }}><span><img src={CopyIcon} alt="copy" className="me-2" /></span>Salin Link</Button>
                    </div>
                    }
                    <div className="my-2" style={{fontSize: 14, textAlign: "center"}}>Silahkan salin link diatas untuk menerima pembayaran kamu.</div>
                    <div className="my-3 mt-3" style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <Button variant="primary" onClick={() => closeModal()} style={{ fontFamily: "Exo", color: "#888888", background: "unset", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB" }}>Tutup</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                size="lg"
                centered
                show={showModalBatal}
                onHide={() => setShowModalBatal(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">Apakah Kamu Yakin Ingin Keluar dari Halaman ini?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 12, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">Seluruh perubahan yang kamu buat akan terhapus</p>
                    </div>            
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalBatal(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">Tidak</Button>
                        <Button onClick={() => setShowModalBatal(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Keluar</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                size="lg"
                centered
                show={showModalFeeMethod}
                onHide={() => setShowModalFeeMethod(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset", color: "#393939" }} className="text-center">Atur Metode Pembayaran</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "start", marginTop: 20 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, marginBottom: "unset", color: "#393939" }} className="text-center">Virtual Account</p>
                    </div>
                    <div className="form-check ">
                        {paymentType.map((item, idx) => {
                            return (
                                <div key={idx} className="my-2 align-items-center">
                                    {item.mpaytype_icon !== "" ?
                                        <>
                                            <input className="form-check-input mt-4" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label ms-2" for="flexCheckDefault">
                                                <img src={item.mpaytype_icon} style={{width: 128, height: 64}}/>
                                            </label>
                                        </> : 
                                        ""
                                    }
                                </div>
                            )
                        })}              
                    </div>
                    <div style={{ color: "#B9121B", fontSize: 12 }} className="mb-2">
                        <img src={noteIconRed} className="me-2" />
                        Metode pembayaran harus dipilih.
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalFeeMethod(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">Batal</Button>
                        <Button onClick={() => setShowModalFeeMethod(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Simpan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AddPayment
