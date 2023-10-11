import React, {useEffect, useRef, useState} from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Image, Row} from '@themesberg/react-bootstrap';
import $ from 'jquery'
import axios from 'axios';
import { BaseURL, errorCatch, getRole, getToken, language, RouteTo, setUserSession } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import { useHistory } from 'react-router-dom';
import edit from '../../assets/icon/edit_icon.svg';
import deleted from '../../assets/icon/delete_icon.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import DataTable from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { eng } from '../../components/Language';
import validator from "validator";

function DetailAkun() {

    const access_token = getRole()
    const [isDetailAkun, setIsDetailAkun] = useState(true);
    const [dataAkun, setDataAkun] = useState({})
    const [subAccount, setSubAccount] = useState([])
    const [dataListCallBack, setDataListCallBack] = useState([])
    const history = useHistory()
    const myRef = useRef(null)
    const [expandedSubAcc, setExpandedSubAcc] = useState(false)
    const [inputHandle, setInputHandle] = useState({})
    const [errorURL, setErrorURL] = useState([])
    // console.log(inputHandle, 'inputHandle');

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    const showCheckboxesSubAccount = () => {
        if (!expandedSubAcc) {
          setExpandedSubAcc(true);
        } else {
          setExpandedSubAcc(false);
        }
    };

    const columns = [
        {
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px"
        },
        {
            name: language === null ? eng.sumberAgen : language.sumberAgen,
            selector: row => row.agen_source,
        },
        {
            name: language === null ? eng.namaBank : language.namaBank,
            selector: row => row.bank_name,
        },
        {
            name: language === null ? eng.noRek : language.noRek,
            selector: row => row.bank_number,
        },
        {
            name: language === null ? eng.namaPemilikRek : language.namaPemilikRek,
            selector: row => row.bank_account_name,
        }
    ]

    async function userDetailPartner (url) {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userDetailPartner = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            if (userDetailPartner.data.response_code === 200 && userDetailPartner.status === 200 && userDetailPartner.data.response_new_token.length === 0) {
                userDetailPartner.data.response_data.sub_account = userDetailPartner.data.response_data.sub_account.map((obj, id) => ({...obj, number : id + 1, icon: <div className="d-flex justify-content-center align-items-center"><img src={edit} alt="edit" /><img src={deleted} alt="delete" className="ms-2" /></div>}))
                setDataAkun(userDetailPartner.data.response_data)
                setSubAccount(userDetailPartner.data.response_data.sub_account)
                getListCallback(userDetailPartner.data.response_data.mpartner_id)
            } else if (userDetailPartner.data.response_code === 200 && userDetailPartner.status === 200 && userDetailPartner.data.response_new_token.length !== 0) {
                userDetailPartner.data.response_data.sub_account = userDetailPartner.data.response_data.sub_account.map((obj, id) => ({...obj, number : id + 1, icon: <div className="d-flex justify-content-center align-items-center"><img src={edit} alt="edit" /><img src={deleted} alt="delete" className="ms-2" /></div>}))
                setUserSession(userDetailPartner.data.response_new_token)
                setDataAkun(userDetailPartner.data.response_data)
                setSubAccount(userDetailPartner.data.response_data.sub_account)
                getListCallback(userDetailPartner.data.response_data.mpartner_id)
            }

        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListCallback(id) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id": "${id}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataListCallBacks = await axios.post(BaseURL + "/Partner/GetListCallbackForPartner", {data: dataParams}, {headers: headers})
            if (dataListCallBacks.data.response_code === 200 && dataListCallBacks.status === 200 && dataListCallBacks.data.response_new_token.length === 0) {
                setDataListCallBack(dataListCallBacks.data.response_data)
            } else if (dataListCallBacks.data.response_code === 200 && dataListCallBacks.status === 200 && dataListCallBacks.data.response_new_token.length !== 0) {
                setUserSession(dataListCallBacks.data.response_new_token)
                setDataListCallBack(dataListCallBacks.data.response_data)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
            <div>Loading...</div>
        </div>
    );

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px'
            },
        },
    };

    useEffect(()=>{
        if (!access_token) {
            history.push("/login")
        }
        userDetailPartner('/Account/GetPartnerDetail')
    },[])

    async function updateUrlCallback(id, newUrl, oldUrl) {
        try {
            // console.log(newUrl, 'newUrl');
            // console.log(oldUrl, 'oldUrl');
            let callbackList = []
            let errorDataURL = []
            if (Object.keys(newUrl).length !== 0) {
                let newestUrl = []
                for (const key in newUrl) {
                    // console.log(newUrl[key], 'newUrl[key]');
                    // console.log(validator.isURL(newUrl[key]), 'validator.isURL(newUrl[key])');
                    if (!validator.isURL(newUrl[key])) {
                        errorDataURL.push(key)
                    }
                    newestUrl.push({
                        callback_id: Number(key),
                        callbackurl_url: newUrl[key]
                    })
                }
                // console.log(errorDataURL, 'errorDataURL');
                // oldUrl.forEach(el => {
                //     newestUrl.forEach(item => {
                //         if (item.callback_id === el.mpartnercallback_id) {
                //             callbackList.push({
                //                 callback_id: item.callback_id,
                //                 callbackurl_ID: el.mcallbackurl_id,
                //                 callbackurl_url: item.callbackurl_url,
                //             })
                //         }
                //     })
                //     callbackList.push({
                //         callback_id: el.mpartnercallback_id,
                //         callbackurl_ID: el.mcallbackurl_id,
                //         callbackurl_url: el.mpartnercallback_url,
                //     })
                // });
                // callbackList = callbackList.filter((item, idx, arr) => arr.findIndex(item2 => (item2.callback_id === item.callback_id)) === idx)
                setErrorURL(errorDataURL)
            } else {
                callbackList = oldUrl.map(item => {
                    return{
                        callback_id: item.mpartnercallback_id,
                        callbackurl_ID: item.mcallbackurl_id,
                        callbackurl_url: item.mpartnercallback_url,
                    }
                })
            }
            // const auth = "Bearer " + getToken()
            // const dataParams = encryptData(`{"partner_id":"${id}", "callback_url_list":${JSON.stringify(callbackList)}}`)
            // const headers = {
            //     'Content-Type':'application/json',
            //     'Authorization' : auth
            // }
            // const editCallback = await axios.post(BaseURL + "/Partner/UpdateOrAddCallbackURLPartner", { data: dataParams }, { headers: headers })
            // if(editCallback.status === 200 && editCallback.data.response_code === 200 && editCallback.data.response_new_token.length === 0) {
            //     alert(editCallback.data.response_data.response_message)
            //     window.location.reload()
            // } else if(editCallback.status === 200 && editCallback.data.response_code === 200 && editCallback.data.response_new_token.length !== 0) {
            //     setUserSession(editCallback.data.response_new_token)
            //     alert(editCallback.data.response_data.response_message)
            //     window.location.reload()
            // }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }


    function detailAkunTabs(isTabs){
        setIsDetailAkun(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }

  return (
    <div className='container-content mt-5'>
        <span className='breadcrumbs-span'>{language === null ? eng.laporan : language.laporan}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? eng.detailAkun : language.detailAkun}</span>
        <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
            <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => detailAkunTabs(true)} id="detailakuntab">
                <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">{language === null ? eng.detailAkun : language.detailAkun}</span>
            </div>
            <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => detailAkunTabs(false)} id="konfigurasitab">
                <span className='menu-detail-akun-span' id="konfigurasispan">{language === null ? eng.konfigurasi : language.konfigurasi}</span>
            </div>
        </div>
        {
            isDetailAkun ?
            <>
            <div className='detail-akun-section'>
                <hr className='hr-style' style={{marginTop: -2}}/>
                <br/>
                <span className='head-title'>{language === null ? eng.profilPerusahaan : language.profilPerusahaan}</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.status : language.status}</td>
                                {dataAkun.mpartner_is_active === true ?
                                    <td><div className='active-box'><span className='active-box-span'>{language === null ? eng.aktif : language.aktif}</span></div></td>
                                    :
                                    <td><div className='inactive-box'><span className='inactive-box-span'>{language === null ? eng.tidakAktif : language.tidakAktif}</span></div></td>}
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.idPartner : language.idPartner}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_id} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaPerusahaan : language.namaPerusahaan}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.emailPerusahaan : language.emailPerusahaan}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_email} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.noTelp : language.noTelp}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_telp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.alamat : language.alamat}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_address} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>{language === null ? eng.detailNpwp : language.detailNpwp}</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.noNpwp : language.noNpwp}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_npwp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaNpwp : language.namaNpwp}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_npwp_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>{language === null ? eng.profilDirekturPerusahaan : language.profilDirekturPerusahaan}</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaDirektur : language.namaDirektur}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_direktur} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.noHpDirektur : language.noHpDirektur}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartner_direktur_telp} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>{language === null ? eng.rekening : language.rekening}</span>
                <br/>
                <br/>
                <div className='base-content'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaBank : language.namaBank}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mbank_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.noRek : language.noRek}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartnerdtl_account_number} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</td>
                                <td><input type='text'className='input-text-ez' value={dataAkun.mpartnerdtl_account_name} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                </div>
                <br/>
                <span className='head-title'>{language === null ? eng.rekeningSubAkun : language.rekeningSubAkun}</span>
                <br/>
                <br/>
                <div className='base-content mb-5'>
                    <table style={{width: '100%', marginLeft: 'unset'}} className="table-form">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.sumberAgen : language.sumberAgen}</td>
                                <td><input type='text'className='input-text-ez' value={subAccount.length !== 0 ? subAccount[0].agen_source : "-"} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaBank : language.namaBank}</td>
                                <td><input type='text'className='input-text-ez' value={subAccount.length !== 0 ? subAccount[0].bank_name : "-"} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.noRek : language.noRek}</td>
                                <td><input type='text'className='input-text-ez' value={subAccount.length !== 0 ? subAccount[0].bank_number : "-"} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                            <tr>
                                <td style={{width: 200}}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</td>
                                <td><input type='text'className='input-text-ez' value={subAccount.length !== 0 ? subAccount[0].bank_account_name : "-"} disabled style={{width: '100%', marginLeft: 'unset'}}/></td>
                            </tr>
                            <br/>
                        </tbody>
                    </table>
                    {
                        subAccount.length !== 0 ?
                        (
                            expandedSubAcc ?
                                <div style={{display: "flex", justifyContent: "end", alignItems: "center", padding: "unset"}}>
                                    <button className='mb-4 pb-3 py-3 text-end' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, width: 300, height: 48, color: "#077E86", background: "unset", border: "unset"}} onClick={showCheckboxesSubAccount}>
                                        {language === null ? eng.sembunyikanDaftarSubAkun : language.sembunyikanDaftarSubAkun} <FontAwesomeIcon icon={faChevronUp} className="ms-2" />
                                    </button>
                                </div> :
                                <div className='mb-4' style={{display: "flex", justifyContent: "end", alignItems: "center", padding: "unset"}} >
                                    <button className='mb-4 pb-3 py-3 text-end' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", gap: 8, width: 300, height: 48, color: "#077E86", background: "unset", border: "unset"}} onClick={showCheckboxesSubAccount}>
                                        {language === null ? eng.lihatDaftarSubAkun : language.lihatDaftarSubAkun} <FontAwesomeIcon icon={faChevronDown} className="ms-2" />
                                    </button>
                                </div>
                        ) : ""
                    }
                    {
                        subAccount.length !== 0 ?
                        (
                            expandedSubAcc &&
                                <div className="div-table pb-4 mb-4" ref={myRef}>
                                    <DataTable
                                        columns={columns}
                                        data={subAccount}
                                        customStyles={customStyles}
                                        // progressPending={pendingSettlement}
                                        progressComponent={<CustomLoader />}
                                        // dense
                                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                        // pagination
                                    />
                                </div>
                        ) : ""
                    }
                </div>
            </div>
            </> :
            <>
                <div className='konfigurasi-section' style={{marginTop: 24}}>
                    <hr className='hr-style' style={{marginTop: -25}}/>
                    <div className='base-content'>
                        {/* <span>You will need to know your <b>Partner ID</b> and <b>Secret Key</b> to communicate with Ezeelink. Please use the Development server while you are still in development.</span> */}
                        <span>{language === null ? eng.descSectionOneSub : language.descSectionOneSub} <b>{language === null ? eng.partnerId : language.partnerId}</b> {language === null ? eng.dan : language.dan} <b>Secret Key</b> {language === null ? eng.descSectionTwoSub : language.descSectionTwoSub}</span>
                        <br/>
                        <br/>
                        <p className='head-title'>API Keys</p>
                        <div className='sub-base-content'>
                            <table  style={{width: '100%', marginLeft: 'unset'}} className="table-api-keys">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>{language === null ? eng.partnerId : language.partnerId}</td>
                                        <td>:</td>
                                        <td><span><b>{dataAkun.mpartner_id}</b></span></td>
                                    </tr>
                                    <tr>
                                        <td>API Key</td>
                                        <td>:</td>
                                        <td><span><b>{dataAkun.public_key}</b></span></td>
                                    </tr>
                                    <tr>
                                        <td>Secret Key</td>
                                        <td>:</td>
                                        <td><span><b>{dataAkun.private_key}</b></span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <br/>
                        </div>
                        <br/>
                        <div className='base-content' style={{background: 'rgba(255, 214, 0, 0.16)', borderRadius: 4, padding: 12}}>
                            <span>
                                <i>
                                    {language === null ? eng.thisKeyInKonfigurasi : language.thisKeyInKonfigurasi} <b><u>{language === null ? eng.hubungiKami : language.hubungiKami}</u></b>
                                </i>
                            </span>
                        </div>
                        <br/>
                    </div>
                    <br/>
                    <div className="base-content mb-5">
                        <p>{language === null ? eng.ezeelinkMemerlukanUrl : language.ezeelinkMemerlukanUrl}</p>
                        <br/>
                        <Row>
                            {
                                dataListCallBack.length !== 0 &&
                                dataListCallBack.map((item, idx) => {
                                    return(
                                        <>
                                            <Col xs={3} key={item.mcallbackurl_id}>
                                                <span>{item.mcallbackurl_name}</span>
                                            </Col>
                                            <Col xs={9}>
                                                <div>
                                                    <input type='text' className='input-text-ez' onChange={handleChange} defaultValue={item.mpartnercallback_url} name={`${item.mcallbackurl_id}`} style={{width: '100%', marginLeft: 'unset'}}/>
                                                    {
                                                        errorURL.length !== 0 && (errorURL.find(el => el === String(item.mcallbackurl_id)) !== undefined || String(errorURL.find(el => el === String(item.mcallbackurl_id))).length === 0) ?
                                                        <p>{"Format URL salah"}</p> :
                                                        <p>{language === null ? eng.addressUrl : language.addressUrl}</p>
                                                    }
                                                    {/* <p>Address where we will send the notification via HTTP Post request. E.g http://yourwebsite.com/notification/handing</p> */}
                                                    <br/>
                                                </div>
                                            </Col>
                                        </>
                                    )
                                })
                            }
                            {/* <Col xs={3}>
                                <span>{language === null ? eng.paymentNotifUrl : language.paymentNotifUrl}*</span>
                            </Col>
                            <Col xs={9}>
                                <div>
                                    <input type='text'className='input-text-ez' onChange={handleChange} defaultValue={dataAkun.callback_url} name="callbackUrl" style={{width: '100%', marginLeft: 'unset'}}/>
                                    <p>{language === null ? eng.addressUrl : language.addressUrl}</p>
                                    <br/>
                                </div>
                            </Col> */}
                        </Row>
                        <div style={{ display: "flex", justifyContent: "end", marginTop: 16 }}>
                        <button onClick={() => updateUrlCallback(dataAkun.mpartner_id, inputHandle, dataListCallBack)} className='mb-5' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                            {language === null ? eng.update : language.update}
                        </button>
                    </div>
                    </div>
                </div>
            </>
        }
    </div>
  )
}

export default DetailAkun