import React, { useEffect, useRef, useState } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import {Row, Col, Modal, Button} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons"
import Upload from "../../assets/icon/upload_icon.svg"
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from "../../function/helpers";
import { useHistory } from "react-router-dom";
import axios from "axios"
import noteIconRed from "../../assets/icon/note_icon_red.svg";

function CustomDesignPayment () {
    const access_token = getToken()
    const [showModalSave, setShowModalSave] = useState(false)
    const [showModalBatal, setShowModalBatal] = useState(false)
    const [image, setImage] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const hiddenFileInput = useRef(null)
    const history = useHistory()
    const user_role = getRole()
    const [upload, setUpload] = useState(false)
    const [inputHandle, setInputHandle] = useState({
        namaPerusahaan: ""
    })

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
        });
    }

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = (event) => {
        if(event.target.files[0]) {
            setImage(event.target.files[0])
            if (parseFloat(event.target.files[0].size / 1024).toFixed(2) > 500) {
                setUpload(true)
                setImageFile(imageFile)
            } 
            else {
                setUpload(false)
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    setImageFile(reader.result)
                })
                reader.readAsDataURL(event.target.files[0])
            }
        }
    }

    // console.log(parseFloat(image.size / 1024).toFixed(2), "ini image");
    // console.log(String(imageFile).slice(27), "ini image file");

    function cancelChange(){
        setShowModalBatal(false)
        setInputHandle({
            namaPerusahaan: ""
        })
        setImage(null)
        setImageFile(null)
    }

    async function saveCustomDesignHandler (namaPerusahaan, image) {
        setShowModalSave(false)
        try {
            if (namaPerusahaan === undefined) {
                namaPerusahaan = inputHandle.namaPerusahaan
            }
            if (image === undefined) {
                image = null
            }
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append('mpaylink_corporate_name', namaPerusahaan)
            formData.append('mpaylink_logo_url', image)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const customDesign = await axios.post(BaseURL + "/PaymentLink/CustomDesignPaymentLink", formData, { headers: headers })
            if(customDesign.status === 200 && customDesign.data.response_code === 200 && customDesign.data.response_new_token.length === 0) {
                setInputHandle(customDesign.data.response_data)
                history.push("/listpayment")
            } else if (customDesign.status === 200 && customDesign.data.response_code === 200 && customDesign.data.response_new_token.length !== 0) {
                setUserSession(customDesign.data.response_new_token)
                setInputHandle(customDesign.data.response_data)
                history.push("/listpayment")
            }
        } catch (e) {
            history.push(errorCatch(e.response.status))
        }
    }

    async function getDetailCustomHandler () {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getDetailCustom = await axios.post(BaseURL + "/PaymentLink/GetCustomDesignPaymentLink", {data: ""}, { headers: headers })
            // console.log(getDetailCustom, "ini detail custom");
            if(getDetailCustom.status === 200 && getDetailCustom.data.response_code === 200 && getDetailCustom.data.response_new_token.length === 0) {
                const dataDetailCustom = getDetailCustom.data.response_data
                setInputHandle({namaPerusahaan: dataDetailCustom.mpaylink_corporate_name})
                setImageFile(dataDetailCustom.mpaylink_logo_url)
            } else if (getDetailCustom.status === 200 && getDetailCustom.data.response_code === 200 && getDetailCustom.data.response_new_token.length !== 0) {
                setUserSession(getDetailCustom.data.response_new_token)
                // setInputHandle(getDetailCustom.data.response_data)
                const dataDetailCustom = getDetailCustom.data.response_data
                setInputHandle({namaPerusahaan: dataDetailCustom.mpaylink_corporate_name})
                setImageFile(dataDetailCustom.mpaylink_logo_url)
            }
        } catch (e) {
            // console.log(e);
            history.push(errorCatch(e.response.status))
        }
    }

    function toLaporan() {
        history.push("/laporan");
    }

    function toDashboard() {
        history.push("/");
      }
    
    function toListPay() {
        history.push("/listpayment");
    }

    function toCustomDesign() {
        history.push("/custom-design-payment");
    }

    useEffect(() => {
        if(!access_token) {
            history.push('/login')
        }
        getDetailCustomHandler()
    }, [access_token])
    
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className="breadcrumbs-span">{user_role === "102"? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>Beranda</span>} &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<span style={{ cursor: "pointer" }} onClick={() => toListPay()}>Payment Link</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<span style={{ cursor: "pointer" }} onClick={() => toCustomDesign()}>Custom Design Laman Bayar</span> </span>
            <div className="head-title">
                <h2 className="h4 mt-4 mb-4" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Custom Design Laman Bayar</h2>
            </div>
            <Row>
                <Col xs={6} className="content-main">
                    <h2 className="h5" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 16, color: "#383838"}}>Preview Tampilan</h2>
                    <div className="base-content-custom">
                        <div className="base-content-custom d-flex justify-content-center align-items-center py-2 px-2" >
                            {!imageFile ?
                                    <div style={{background: "#F0F0F0", border: "1px solid #C4C4C4", width: 100, height:48}} className="py-2 px-2">Logo Anda</div> :
                                <>                                        
                                    <img src={imageFile} alt="alt" width="96px" height="44px" />
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={hiddenFileInput}
                                        id="image"
                                        name="image"
                                        
                                    />
                                </>
                            }                            
                            {inputHandle.namaPerusahaan !== "" ? 
                                <div className="mx-2" style={{fontFamily: "Nunito", fontSize: 16}}>{inputHandle.namaPerusahaan}</div> :
                                <div className="mx-2" style={{fontFamily: "Nunito", fontSize: 16}}>Nama Perusahaan Anda</div>
                            }
                        </div>
                        <div className="px-4 py-4">
                            <div className="mb-2" style={{fontSize: 14}}>Total Pembayaran</div>
                            <h3 style={{margin: "unset", fontFamily: "Exo", fontWeight: 700, fontSize: 24}}>Rp 100.000</h3>
                            <div className="d-flex justify-content-between align-items-center">
                                <div style={{color: "#888888", fontSize: 14}}>Payment ID: 1082619</div>
                                <div style={{display: "flex", justifyContent: "end", alignItems: "end", padding: "unset"}}>
                                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, height: 48, color: "#077E86", background: "unset", border: "unset", cursor: "unset"}} >
                                        Detail <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                                    </button>
                                </div>
                            </div>
                            <div style={{border: "3px solid #F0F0F0"}}></div>
                            <Row className="mt-2">
                                <Col xs={12}>
                                    <div className="my-1">Nama</div>
                                    <input 
                                        className="input-text-user" 
                                        placeholder="Masukkan nama Anda"
                                        disabled = {true}
                                        style={{background: "#FFFFFF"}}
                                    />
                                </Col>
                                <Col xs={12} className="mt-1">
                                    <div className="my-1">Email</div>
                                    <input 
                                        className="input-text-user" 
                                        placeholder="Masukkan email Anda"
                                        disabled = {true}
                                        style={{background: "#FFFFFF"}}
                                    />
                                </Col>
                                <Col xs={12} className="my-3">
                                    <div style={{fontSize: "14px", background: "rgba(255, 214, 0, 0.16)", borderRadius: "4px", fontStyle: "italic", padding: "12px", gap: 10}}>Data ini akan kami gunakan untuk mengirim bukti transaksi pembayaran melalui email Anda.</div>
                                </Col>
                                <Col xs={12}>
                                <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "center"}}>
                                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: "100%", height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6, cursor: "unset" }}>
                                        Lanjutkan
                                    </button>
                                </div>
                                </Col>
                            </Row>
                        </div>                        
                    </div>
                </Col>
                <Col xs={6}>
                    <h2 className="h5" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 16, color: "#383838"}}>Atur Tampilan</h2>
                    <div className="base-content-custom">
                        <div className="px-4 py-4">
                            <div>Logo Perusahaan</div>
                            <div className="d-flex justify-content-start align-items-center mt-2">
                                {!imageFile ?
                                    <div style={{background: "#F0F0F0", border: "1px solid #C4C4C4", width: 100, height:48}} className="text-center py-2">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            ref={hiddenFileInput}
                                            id="image"
                                            name="image"
                                        />
                                    </div> :
                                    <>                                        
                                        <img src={imageFile} alt="alt" width="96px" height="44px" />
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            ref={hiddenFileInput}
                                            id="image"
                                            name="image"
                                        />
                                    </>
                                } 
                                <div className="mx-2">
                                    <div onClick={handleClick} className="d-flex justify-content-start align-items-center" style={{cursor: "pointer"}}>
                                        <img src={Upload} alt="Upload"/>
                                        <div style={{fontStyle: "underline", color: "#077E86", fontSize: 14}}>Upload File</div>
                                    </div>
                                    <div style={{color: "#C4C4C4", fontSize: 12}} className="my-1">Ukuran 2:1, size maks 500 kb</div>
                                </div>
                            </div>
                            {upload === true ?
                                <>
                                    <div style={{ color: "#B9121B", fontSize: 12 }}>
                                        <img src={noteIconRed} className="me-2" />
                                        Ukuran file melebihi 500 kb
                                    </div>
                                </> : ""
                            }
                            <Row>
                                <Col xs={12}>
                                    <div className="my-2">Nama Perusahaan</div>
                                    <input 
                                        className="input-text-user" 
                                        placeholder="Masukkan nama Perusahaan Anda"
                                        name="namaPerusahaan"
                                        onChange={handleChange}
                                        value={inputHandle.namaPerusahaan}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "center"}}>
                        <button onClick={() => setShowModalBatal(true)} className="me-1" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: "100%", height: 45, background: "#FFFFFF", color:"#888888", border: "0.6px solid #EBEBEB", borderRadius: 6 }}>
                            Batal
                        </button>
                        <button onClick={() => setShowModalSave(true)} className="ms-1" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: "100%", height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                            Simpan
                        </button>
                    </div>
                </Col>
            </Row>
            <Modal
                size="lg"
                centered
                show={showModalSave}
                onHide={() => setShowModalSave(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">Simpan Perubahan?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 12, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">Seluruh perubahan yang anda buat akan tersimpan dan tampilan laman bayar anda akan diperbarui.</p>
                    </div>              
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalSave(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">Batal</Button>
                        <Button onClick={() => saveCustomDesignHandler(inputHandle.namaPerusahaan, image)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Simpan</Button>
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
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">Batalkan Perubahan?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 12, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">Seluruh perubahan yang anda buat akan terhapus dan tampilan dikembalikan seperti sebelumnya.</p>
                    </div>              
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalBatal(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">Kembali</Button>
                        <Button onClick={cancelChange} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Batalkan</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CustomDesignPayment