import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons"
import {Row, Col, Modal, Button} from '@themesberg/react-bootstrap'
import Logo from "../../assets/icon/indofood_icon.svg"

const LamanPayment = () => {
    const [expanded, setExpanded] = useState(false)
    const myRef = useRef(null)

    const showCheckboxes = () => {
        if (!expanded) {
          setExpanded(true);
        } else {
          setExpanded(false);
        }
    };
    return (
        <div className="main-content mt-5 d-flex justify-content-center align-items-center" style={{padding: "37px 27px 37px 27px"}}>
            <div style={{background: "#FFFFFF", borderRadius: 8}}>
                <div style={{width: 1000}} className="base-content-custom">
                    <div  className="d-flex justify-content-center align-items-center" style={{width: "100%"}}>
                        <img src={Logo} alt="Indofood" />
                        <div className="mx-2">PT Indofood Sukses Makmur Tbk</div>
                        {/* <div style={{background: "#F0F0F0", border: "1px solid #C4C4C4", width: 100, height:48}} className="py-2 px-2">Logo Anda</div>
                        <div className="mx-2">Nama Perusahaan Anda</div> */}
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="px-4 py-4" style={{width: 480}}>
                        <div className="mb-2" style={{fontSize: 14}}>Total Pembayaran</div>
                        <h3 style={{margin: "unset", fontFamily: "Exo", fontWeight: 700, fontSize: 24}}>Rp 100.000</h3>
                        <div className="d-flex justify-content-between align-items-center">
                            <div style={{color: "#888888", fontSize: 14}}>Payment ID: 1082619</div>
                            <div style={{display: "flex", justifyContent: "end", alignItems: "end", padding: "unset"}}>
                                {expanded ?
                                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, height: 48, color: "#077E86", background: "unset", border: "unset"}} onClick={showCheckboxes}>
                                        Detail <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                                    </button> :
                                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, height: 48, color: "#077E86", background: "unset", border: "unset"}} onClick={showCheckboxes}>
                                        Detail <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                                    </button>
                                }
                            </div>
                        </div>
                        <div style={{border: "3px solid #F0F0F0"}}></div>
                        {expanded &&
                            <Row className="mt-2" ref={myRef}>
                                <Col xs={12}>
                                    <div className="my-1">Nama</div>
                                    <input 
                                        className="input-text-user" 
                                        placeholder="Masukkan nama Anda"
                                    />
                                </Col>
                                <Col xs={12} className="mt-1">
                                    <div className="my-1">Email</div>
                                    <input 
                                        className="input-text-user" 
                                        placeholder="Masukkan email Anda"
                                    />
                                </Col>
                                <Col xs={12} className="my-3">
                                    <div style={{fontSize: "14px", background: "rgba(255, 214, 0, 0.16)", borderRadius: "4px", fontStyle: "italic", padding: "12px", gap: 10}}>Data ini akan kami gunakan untuk mengirim bukti transaksi pembayaran melalui email Anda.</div>
                                </Col>
                                <Col xs={12}>
                                <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "center"}}>
                                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: "100%", height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6}}>
                                        Lanjutkan
                                    </button>
                                </div>
                                </Col>
                            </Row>
                        }
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default LamanPayment