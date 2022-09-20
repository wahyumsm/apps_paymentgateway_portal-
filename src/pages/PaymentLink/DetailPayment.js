import React, { useEffect, useState } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faCog} from "@fortawesome/free-solid-svg-icons";
import CopyIcon from '../../assets/icon/carbon_copy.svg'
import { useHistory, useParams } from "react-router-dom";
import { convertToRupiah, errorCatch, getToken, setUserSession } from "../../function/helpers";
import encryptData from "../../function/encryptData";
import axios from "axios";

function DetailPayment() {
    const history = useHistory()
    const access_token = getToken()
    const { paymentId } = useParams()
    const [detailPayment, setDetailPayment] = useState([])

    const toNewTab = () => {
        window.open(detailPayment.tpaylink_url)
    }
    async function getDetailPayLink(paymentId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"tpaylink_id":"${paymentId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const detailPayment = await axios.post("/PaymentLink/PaymentLinkDetails", { data: dataParams }, { headers: headers })
            // console.log(detailPayment, "ini detail payment");
            if (detailPayment.status === 200 && detailPayment.data.response_code === 200 && detailPayment.data.response_new_token.length === 0) {
                setDetailPayment(detailPayment.data.response_data)
            } else if (detailPayment.status === 200 && detailPayment.data.response_code === 200 && detailPayment.data.response_new_token.length !== 0) {
                setUserSession(detailPayment.data.response_new_token)
                setDetailPayment(detailPayment.data.response_data)
            }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function tutupPaymentLinkHandler(paymentId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"payment_code":"${paymentId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getCloseLink = await axios.post("/PaymentLink/PaylinkUpdateStatus", { data: dataParams }, { headers: headers })
            // console.log(getCloseLink, "ini close link payment");
            if (getCloseLink.status === 200 && getCloseLink.data.response_code === 200 && getCloseLink.data.response_new_token.length === 0) {
                history.push('/listpayment')
            } else if (getCloseLink.status === 200 && getCloseLink.data.response_code === 200 && getCloseLink.data.response_new_token.length !== 0) {
                setUserSession(getCloseLink.data.response_new_token)
                history.push('/listpayment')
            }
            alert("Success")
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    const copyLink = async () => {
        var copyText = detailPayment.tpaylink_url;
        if ("clipboard" in navigator) {
          await navigator.clipboard.writeText(copyText);
        } else {
          document.execCommand("copy", true, copyText);
        }
        alert("Text copied");
    };

    useEffect(() => {
        if(!access_token) {
            history.push('/login')
        }
        getDetailPayLink(paymentId)
    }, [paymentId])
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Payment Link &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Payment Link Detail</span>
            <div className="head-title">
                <h2 className="h4 mt-4 mb-4" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Payment Link Detail</h2>
            </div>
            <div className="base-content-beranda">
                <div className="d-flex justify-content-between align-items-center mx-3 my-1">
                    <div>Payment ID</div>
                    <div>Nominal</div>
                    <div>Payment Link</div>
                </div>
                <div style={{fontWeight: 700}} className="d-flex justify-content-between align-items-center mx-3 my-1">
                    <div>{detailPayment.tpaylink_code}</div>
                    <div className="pe-4">{convertToRupiah(detailPayment.tpaylink_amount)}</div>
                    <div className="d-flex justify-content-center align-items-center">
                        <button onClick={toNewTab} style={{border:"unset", background: "unset", fontWeight: 700, color: "#077E86"}} >Kunjungi</button>
                        <div className="mx-1">|</div>
                        <button onClick={copyLink} style={{border:"unset", background: "unset", fontWeight: 700, color: "#077E86"}} className=" d-flex justify-content-center align-items-center"><img src={CopyIcon} alt="copy" className="me-1" /><span style={{color: "#077E86"}}>Salin</span></button>
                    </div>
                </div>
            </div>
            <div className="head-title">
                <h4 className="h4 mt-4 mb-4" style={{fontSize: "18px"}}>Detail</h4>
            </div>
            <div className="base-content-beranda">
                <table className="report-pie-table">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td><div style={{color: "#888888"}}>ID Referensi</div></td>
                            <td><div className="mx-5" style={{fontWeight: 600, fontFamily: "Exo"}}>{detailPayment.tpaylink_ref_id}</div></td>
                        </tr>
                        <tr>
                            <td><div style={{color: "#888888"}}>Dibuat Pada</div></td>
                            <td><div className="mx-5" style={{fontWeight: 600, fontFamily: "Exo"}}>{(`${detailPayment.tpaylink_crtdt}`).slice(0,10).replace(/-/g,"/") + " " + (`${detailPayment.tpaylink_crtdt}`).slice(11,16)}</div></td>
                        </tr>
                        <tr>
                            <td><div style={{color: "#888888"}}>Tanggal Kadaluarsa</div></td>
                            <td><div className="mx-5" style={{fontWeight: 600, fontFamily: "Exo"}}>{(`${detailPayment.tpaylink_exp_date}`).slice(0,10).replace(/-/g,"/") + " " + (`${detailPayment.tpaylink_exp_date}`).slice(11,16)}</div></td>
                        </tr>
                        <tr>
                            <td><div style={{color: "#888888"}}>Metode Pembayaran</div></td>
                            <td><div className="mx-5" style={{fontWeight: 600, fontFamily: "Exo"}}>{detailPayment.mpaytype_name !== null ? detailPayment.mpaytype_name : "-"}</div></td>
                        </tr>
                        <tr>
                            <td><div style={{color: "#888888"}}>Batas Pembayaran</div></td>
                            <td><div className="mx-5" style={{fontWeight: 600, fontFamily: "Exo"}}>{detailPayment.tpaylink_use_limit}</div></td>
                        </tr>
                        <tr>
                            <td><div style={{color: "#888888"}}>Deskripsi</div></td>
                            <td><div className="mx-5" style={{fontWeight: 600, fontFamily: "Exo"}}>{detailPayment.tpaylink_desc !== "" ? detailPayment.tpaylink_desc : "-"}</div></td>
                        </tr>
                        <tr>
                            <td><div style={{color: "#888888"}}>Status</div></td>
                            <td><div className="mx-5 px-5" style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "75%", color: "#3DB54A", fontWeight: 600, background: "#EBF8EC", borderRadius: 4, fontFamily: "Nunito"}}>{detailPayment.status_name}</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "end"}}>
                <button onClick={() => tutupPaymentLinkHandler(detailPayment.tpaylink_code)} style={{ display: detailPayment.status_name === "Active" ? "" : "none", color:"#FFFFFF", fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 250, height: 45, background: "linear-gradient(180deg, #FF434D 0%, #B9121B 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Tutup Payment Link
                </button>
            </div>
        </div>
    )
}

export default DetailPayment